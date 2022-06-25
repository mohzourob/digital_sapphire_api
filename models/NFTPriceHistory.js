import mongoose from "mongoose";


const NFTPriceHistorySchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'NFTItems',
        require: true
    },
    priceHistory: [{
        price: {
            type: Number
        },
        currency: {
            type: String
        },
        date: {
            type: Date
        }
    }]
}, {
    timestamps: true
}, {
    collection: 'NFTPriceHistory'
})


export default mongoose.model("NFTPriceHistories", NFTPriceHistorySchema);