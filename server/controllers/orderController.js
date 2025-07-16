import orderModel from "../modles/orderModel.js"
import userModel from "../modles/userModel.js"
import productModel from "../modles/productModel.js"

import fs from 'fs';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe'

import transporter from '../config/nodemailer.js'
import { ORDER_SUCCESS_TEMPLATE } from '../config/orderTemplate.js'

//global variables
const currency = 'inr'
const deliveryCharge = 100

//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//placing order using cod
const placeOrder =async (req,res)=>{
    try {
        
        const {userId,items,amount,address} = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date:Date.now()
        }

        const newOrder =new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})
        res.json({success:true,message:'Order Placed'})

        // Send email AFTER response (non-blocking)
        const user = await userModel.findById(userId);
        const html = ORDER_SUCCESS_TEMPLATE
            .replace("{{name}}", user.name)
            .replace("{{orderId}}", newOrder._id.toString())
            .replace("{{amount}}", amount.toString())
            .replace("{{paymentMethod}}", "Cash on Delivery");

        transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "🎉 Order Confirmed - Thank You for Shopping!",
            html,
        }).catch((error) => {
            console.error("Email sending failed:", error.message);
        });
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//placing order using stripe
const placeOrderStripe =async (req,res)=>{
    try {
        
        const {userId,items,amount,address} = req.body
        const { origin } = req.headers

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date:Date.now()
        }

        const newOrder =new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item)=>({
            price_data:{
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//verify stripe
const verifyStripe = async (req,res) =>{

    const {orderId,success,userId} =req.body
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            await userModel .findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true})
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//all orders data for admin panel
const allOrders =async(req,res)=>{
    try {
        
        const orders =await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//user order data for frontend
const userOrders =async (req,res)=>{
    try {
        
        const {userId} =req.body
        const orders = await orderModel.find({userId})

        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//update order status from admin
const updateStatus =async (req,res)=>{
    try {
        
        const{orderId,status} =req.body

        await orderModel.findByIdAndUpdate(orderId,{status})

        res.json({success:true,message:"Status Updated"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// Fetch sales data for charts 📊
const getSalesData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Please provide both startDate and endDate" });
        }

        const salesData = await orderModel.aggregate([
            {
                $addFields: {
                    dateObj: { $toDate: "$date" } // Convert timestamp to Date
                }
            },
            {
                $match: {
                    dateObj: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateObj" } },
                    totalSales: { $sum: "$amount" },
                    totalOrders: { $sum: 1 },
                    paidOrders: { $sum: { $cond: ["$payment", 1, 0] } },
                    unpaidOrders: { $sum: { $cond: ["$payment", 0, 1] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({ success: true, sales: salesData });
    } catch (error) {
        console.log("Error fetching sales data:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const getPaymentData = async (req, res) => {
    try {
        const paymentData = await orderModel.aggregate([
            {
                $group: {
                    _id: "$paymentMethod", // Group by payment method
                    totalSales: { $sum: "$amount" }, // Total sales for each method
                    totalOrders: { $sum: 1 } // Total number of orders
                }
            }
        ]);

        res.json({ success: true, payments: paymentData });
    } catch (error) {
        console.log("Error fetching payment data:", error);
        res.json({ success: false, message: error.message });
    }
};


const createInvoiceDirectory = () => {
    const dir = './invoices';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  };

  const downloadInvoice = async (req, res) => {
    try {
        const { orderId } = req.params; // Get orderId from URL params
        const order = await orderModel.findById(orderId);
        const user = await userModel.findById(order.userId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Ensure the 'invoices' directory exists
        createInvoiceDirectory();

        // Generate a PDF invoice
        const doc = new PDFDocument({ margin: 50 });
        const filePath = `invoices/invoice_${orderId}.pdf`;
        doc.pipe(fs.createWriteStream(filePath));

        // Header
        doc.fontSize(22).text("INVOICE", { align: "center", underline: true });
        doc.moveDown();

        // Order Details
        doc.fontSize(14).text(`Order ID: ${orderId}`);
        doc.text(`User Name: ${user.username}`);
        doc.text(`Amount: ${order.amount}`);
        doc.text(`Payment Method: ${order.paymentMethod}`);
        doc.text(`Status: ${order.payment ? "Paid" : "Unpaid"}`);
        doc.moveDown();

        // Line Separator
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Table Header
        doc.fontSize(12).font("Helvetica-Bold");

        // Define column positions
        const col1X = 50, col2X = 100, col3X = 300, col4X = 400, col5X = 460, col6X = 520;
        const rowHeight = 20; // Fixed row height for alignment

        let currentY = doc.y;

        doc.text("No.", col1X, currentY);
        doc.text("Item Name", col2X, currentY);
        doc.text("Price", col3X, currentY);
        doc.text("Quantity", col4X, currentY);
        doc.text("Total", col5X, currentY);

        // Draw separator line under header
        currentY += 15;
        doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
        currentY += 5;

        doc.font("Helvetica").fontSize(10);

        // Function to break text after every N characters
        const wrapText = (text, maxLength) => {
            return text.match(new RegExp(`.{1,${maxLength}}`, 'g')).join('\n');
        };

        // Table Rows (Item Details)
        order.items.forEach((item, index) => {
            let itemName = wrapText(item.name, 20); // Wrap item name every 20 characters
            let itemLines = itemName.split("\n").length; // Number of lines used by item name
            let rowHeight = itemLines * 12 + 5; // Adjust row height dynamically

            doc.text(`${index + 1}`, col1X, currentY);
            doc.text(itemName, col2X, currentY, { width: 180 }); // Multi-line support
            doc.text(`${item.price}`, col3X, currentY);
            doc.text(`${item.quantity}`, col4X, currentY);
            doc.text(`${item.price * item.quantity}`, col5X, currentY);

            currentY += rowHeight; // Move to the next row position
        });
        // Line Separator after items table
        doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
        doc.moveDown(5);

        // Footer Section
        doc.fontSize(12).text("Thank you for shopping with us!", { align: "center" });
        doc.text("For any queries, contact support@example.com", { align: "center" });

        doc.end();

        // Check if the file was created successfully
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ success: false, message: "Invoice generation failed." });
        }
        
        // Send the file to the client
        res.download(filePath, `invoice_${orderId}.pdf`, (err) => {
            if (err) {
                console.error("Error sending invoice file:", err);
                res.status(500).json({ success: false, message: "Failed to send invoice" });
            }
        });
    } catch (error) {
        console.error("Error generating invoice:", error);
        res.status(500).json({ success: false, message: "Failed to generate invoice" });
    }
};
const getProductsOrderedCount = async (req, res) => {
    try {
        const productOrderCount = await orderModel.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items._id", // Should be items.productId, not _id
                    totalQuantity: { $sum: "$items.quantity" },
                }
            },
            { $sort: { totalQuantity: -1 } }
        ]);

        if (productOrderCount.length === 0) {
            return res.json({ success: false, message: "No products have been ordered yet." });
        }

        // Fix: Use items.productId instead of items._id
        const productIds = productOrderCount.map(item => item._id);
        const productDetails = await productModel.find({ '_id': { $in: productIds } }).populate("category");

        const response = productOrderCount.map(item => {
            const product = productDetails.find(p => p._id.toString() === item._id.toString());
            return {
                productId: item._id,
                productName: product?.name || "Unknown",
                totalQuantity: item.totalQuantity,
                productImage: product?.image || "",
                productPrice: product?.price || 0,
                productCategory: product?.category?.name || "Unknown",
            };
        });

        const topProducts = response.slice(0, 4);

        await productModel.updateMany({}, { $set: { bestseller: false } });
        await productModel.updateMany(
            { '_id': { $in: topProducts.map(product => product.productId) } },
            { $set: { bestseller: true } }
        );

        res.json({ success: true, productsOrderedCount: response });
    } catch (error) {
        console.log("Error fetching product order count:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export {verifyStripe, getSalesData, placeOrder, placeOrderStripe, allOrders, userOrders,updateStatus, getPaymentData,downloadInvoice,getProductsOrderedCount}