import mongoose from "mongoose";


const NFTItemSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    file: {
        type: mongoose.Schema.ObjectId,
        ref: 'AccountResource',
        required: true
    },
    price: {
        type: Number
    },
    currency: {
        type: String,
        required: true,
        enum: ["ETH"],
        default: "ETH"
    },
    exteraLinks: [{
        type: String,
        trim: true,
    }],
    network: {
        type: String,
        trim: true,
        required: true,
        enum: ["Ethereum", "Polygon"]
    },
    numberOfViews: {
        type: Number,
        default: 0
    },
    numberOfLikes: {
        type: Number,
        default: 0
    },
    viewList: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Account',
        }
    ],
    likeList: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Account',
    }],
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'Account',
        require: true
    },
    metaDataURL: {
        type: String,
        trim: true,
    },
    metaDataProvider: {
        type: String,
        trim: true,
        default: "IPFS",
        enum: ["IPFS", "Torrent", "S3"]
    },
    metaDataStoreType: {
        type: String,
        trim: true,
        default: "DECENTRALIZED",
        enum: ["DECENTRALIZED", "CENTRALIZED"]
    },
    activity: {
        type: mongoose.Schema.ObjectId,
        ref: 'NFTActivity',
        default: null
    },
    priceHistory: {
        type: mongoose.Schema.ObjectId,
        ref: 'NFTPriceHistory',
        default: null
    },
    status: {
        type: String,
        enum: ["List", "Sale", "Unlist", "Transfer", "Delete"],
    }
}, {
    timestamps: true
}, {
    collection: 'NFTItems'
})


export default mongoose.model("NFTItem", NFTItemSchema);