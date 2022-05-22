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
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    profile: {
        type: mongoose.Schema.ObjectId,
        ref: 'Profile'
    }
}, {
    timestamps: true
}, {
    collection: 'Accounts'
})



export default mongoose.model("Account", accountSchema);