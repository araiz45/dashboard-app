import mongoose, { model } from 'mongoose';

const entrySchema = new mongoose.Schema ({ 
    productName: String,
    salesmanName: String,
    purchasingPrice: Number,
    sellingPrice: Number,
    salesCharges: Number,
    quantity: Number,
    totalSalesCharges: Number,
    totalPurchasingPrice: Number,
    totalSellingPrice: Number,
    totalProfit: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const entryModel = model("entry", entrySchema);

export default entryModel;