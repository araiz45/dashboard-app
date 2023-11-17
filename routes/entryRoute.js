import express, { response } from 'express'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import entryModel from '../models/entryModel.js';
const router = express.Router();

router.get("/test", (req, res) => {
    res.json('test')
})

router.post('/add', async (req, res) => {
    try {
        const cookies = cookie.parse(req.headers.cookie || "")
        const token = cookies.dashToken || null;
        if(!token) {
            return res.status(400).json("Forbidden")
        }
        const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY)
        const {username, id} = decodedToken;
        const {productName, purchasingPrice, sellingPrice, salesCharges, qty} = req.body;
        const purchasingPriceFlt = parseFloat(purchasingPrice);
        const sellingPriceFlt = parseFloat(sellingPrice);
        const salesChargesFlt = parseFloat(salesCharges);
        const qtyFlt = parseInt(qty)
        const salesmanCharges = salesChargesFlt * qtyFlt;
        const totalPurchasePrice = purchasingPriceFlt * qtyFlt;
        const totalSellingPrice = sellingPriceFlt * qtyFlt
        const totalProfit = (totalSellingPrice - totalPurchasePrice) - salesmanCharges;
        
        const entry = await entryModel.create({
            productName,
            salesmanName: username,
            purchasingPrice: purchasingPriceFlt,
            sellingPrice: sellingPriceFlt,
            salesCharges: salesChargesFlt,
            quantity: qtyFlt,
            totalSalesCharges: salesmanCharges,
            totalPurchasingPrice: totalPurchasePrice,
            totalSellingPrice,
            totalProfit,
          })
        res.json("Entry has been added Sucessfully")
    } catch (error) {
        res.status(500).json("Internal Server Error")
        console.log(error)
    }
})


router.get('/show', async (req, res) => {
    const pageNo = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (pageNo - 1) * limit;
    try {
        const data = await entryModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
        console.log(data)
        const totalCount = await entryModel.countDocuments();
        console.log(totalCount);
        res.json({
            data,
            currentPage: pageNo,
            totalPages: Math.ceil(totalCount / limit),
        })
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal Server Error")
    }
})

router.post("/delete", async (req, res) => {
    const {id} = req.body;
    if(id) {
        try {
            const respnose = await entryModel.findByIdAndDelete(id).exec();
            console.log(respnose)
            res.json(respnose)
        } catch (error) {
            res.status(500).json("Internal Server Error")
            console.log(error)
        }
    }
})

export default router