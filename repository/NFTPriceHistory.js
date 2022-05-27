import mongoose from "mongoose";


const NFTPriceHistorySchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'NFTItems',
        require: true
    }
}, {
    timestamps: true
}, {
    collection: 'NFTActivity'
})


export default mongoose.model("NFTItem", NFTPriceHistorySchema);