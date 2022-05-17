import mongoose from "mongoose";


const User = mongoose.Schema({
    walletPublicAddress: {
        type: String,
        unique: true,
        required: true,
        trim: true,

    }
}, {
    timestamps: true
})



export default mongoose.model("Users", User);