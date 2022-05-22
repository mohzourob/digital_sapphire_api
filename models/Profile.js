import mongoose from "mongoose";


const profileSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    bannerImage: {
        type: String,
        trim: true,
    },
    coverImage: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    links: {
        facebook: {
            type: String,
            trim: true,
        },
        instagram: {
            type: String,
            trim: true,
        },
        twitter: {
            type: String,
            trim: true,
        },
        discord: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        }
    },
    account: {
        type: mongoose.Schema.ObjectId,
        ref: 'Account'
    }
}, {
    timestamps: true
}, {
    collection: 'Profiles'
})



export default mongoose.model("Profile", profileSchema);