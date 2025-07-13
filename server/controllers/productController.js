import { v2 as cloudinary } from "cloudinary";
import productModel from '../modles/productModel.js'
import categoryModel from '../modles/categoryModel.js'
import mongoose from "mongoose";

// Function to add a product
const addProduct = async (req, res) => {
    
    try {
        const { name, description, price, bestseller, category ,brand} = req.body;
        const attributes = req.body.attributes || {};

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.json({ success: false, message: "Invalid category ID format" });
        }

        // Validate category
        const categoryExists = await categoryModel.findById(category);
        if (!categoryExists) {
            return res.json({ success: false, message: "Invalid category" });
        }

        // Process images
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(item => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

       // Ensure categoryExists.attributes is always an array
        const validAttributes = {};
        (categoryExists.attributes || []).forEach(attr => {
            if (attributes[attr.name]) {
                validAttributes[attr.name] = attributes[attr.name];
            }
        });


        // Create product data
        const productData = {
            name,
            description,
            price: Number(price),
            bestseller: bestseller === "true" ? true : false,
            image: imagesUrl,
            category: new mongoose.Types.ObjectId(category),
            attributes: validAttributes,
            brand,
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List all products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("category");
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove a product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get a single product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId).populate("category");
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, brand, bestseller } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid product ID" });
        }

        // Fetch existing product
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        let updatedData = {
            name,
            description,
            price: Number(price),
            category: new mongoose.Types.ObjectId(category),
            brand,
            bestseller: bestseller === "true",
            date: Date.now(),
            image: [...existingProduct.image], // Preserve existing images
        };

        // Store new image URLs
        const imagesUrl = {};
        if (req.files?.image1) imagesUrl[0] = req.files.image1[0].path;
        if (req.files?.image2) imagesUrl[1] = req.files.image2[0].path;
        if (req.files?.image3) imagesUrl[2] = req.files.image3[0].path;
        if (req.files?.image4) imagesUrl[3] = req.files.image4[0].path;

        // Upload new images and replace only specific indexes
        await Promise.all(
            Object.keys(imagesUrl).map(async (index) => {
                let result = await cloudinary.uploader.upload(imagesUrl[index], { resource_type: "image" });
                updatedData.image[index] = result.secure_url; // Replace only that index
            })
        );

        // Update product in the database
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });

        res.json({ success: true, message: "Product Updated Successfully", updatedProduct });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



export { listProducts, addProduct, removeProduct, singleProduct, updateProduct};
