import mongoose from "mongoose";


const accountSchema = mongoose.Schema({
    walletPublicAddress: {
        type: String,
        unique: true,
        required: true,
        trim: true,

    },
    nonceCode: {
        type: String,
        required: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
}, {
    collection: 'Accounts'
})



export default mongoose.model("Account", accountSchema);


/**
 *     profile: {
        type: Schema.ObjectId,
        ref: 'Profile'
    }
 */