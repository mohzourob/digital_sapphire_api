import mongoose from "mongoose";


const accountResourceSchema = mongoose.Schema({
    awsPath: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    relativePath: {
        type: String,
        required: true,
        trim: true,
    },
    mimeType: {
        type: String,
        required: true,
        trim: true,
    },
    encoding: {
        type: String,
        required: true,
        trim: true,
    },
    etag: {
        type: String,
        required: true,
        trim: true,
    },
    size: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    account: {
        type: mongoose.Schema.ObjectId,
        ref: 'Account'
    }
},
    {
        timestamps: true
    }, {
    collection: 'AccountResources'
}
)


export default mongoose.model("AccountResource", accountResourceSchema);