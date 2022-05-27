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
    exteraLink: {
        type: String,
        trim: true,
    },
    network: {
        type: String,
        trim: true,
        required: true,
    },
    numberOfViews: {
        type: Number,
        default: 0
    },
    numberOfLikes: {
        type: number,
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
        default: "IPFS"
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
    }
}, {
    timestamps: true
}, {
    collection: 'NFTItems'
})


export default mongoose.model("NFTItem", NFTItemSchema);