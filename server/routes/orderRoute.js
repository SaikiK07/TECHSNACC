import express from 'express'
import {placeOrder, placeOrderStripe, allOrders, userOrders,updateStatus, getSalesData, getPaymentData, verifyStripe, downloadInvoice, getProductsOrderedCount} from '../controllers/orderController.js'
import adminAuth from '../middlewares/adminAuth.js'
import authUser from '../middlewares/auth.js'

const orderRouter = express.Router()

//admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//payment features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)

//user features
orderRouter.post('/userorders',authUser,userOrders)


orderRouter.get('/salesdata', getSalesData);
orderRouter.get('/paymentdata', getPaymentData);

//verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

orderRouter.get('/invoice/:orderId',downloadInvoice)

orderRouter.get('/mostorder', getProductsOrderedCount);

export default orderRouter