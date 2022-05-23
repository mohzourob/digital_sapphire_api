import mongoose from "mongoose";


const profileSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        default: "",
    },
    lastName: {
        type: String,
        trim: true,
        default: "",
    },
    bannerImage: {
        type: mongoose.Schema.ObjectId,
        ref: 'AccountResource',
        default: null
    },
    coverImage: {
        type: mongoose.Schema.ObjectId,
        ref: 'AccountResource',
        default: null
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
        default: "",
    },
    links: {
        facebook: {
            type: String,
            trim: true,
            default: "",
        },
        instagram: {
            type: String,
            trim: true,
            default: "",

        },
        twitter: {
            type: String,
            trim: true,
            default: "",

        },
        discord: {
            type: String,
            trim: true,
            default: "",

        },
        website: {
            type: String,
            trim: true,
            default: "",
        }
    },
    account: {
        type: mongoose.Schema.ObjectId,
        ref: 'Account',
        require: true
    }
}, {
    timestamps: true
}, {
    collection: 'Profiles'
})



export default mongoose.model("Profile", profileSchema);