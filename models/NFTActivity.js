import mongoose from "mongoose";


const NFTActivitySchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'NFTItems',
        require: true
    },
    activities: [{
        event: {
            type: String,
            enum: ["List", "Sale", "Unlist", "Transfer", "Delete", "Create"],
            require: true
        },
        price: {
            type: Number
        },
        currency: {
            type: String,
        },
        from: {
            type: mongoose.Schema.ObjectId,
            ref: 'Account',
        },
        to: {
            type: mongoose.Schema.ObjectId,
            ref: 'Account',
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
}, {
    collection: 'NFTActivity'
})


export default mongoose.model("NFTActivities", NFTActivitySchema);