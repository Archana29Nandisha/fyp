import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'developer', 'user'],
        default: 'user'  
    },
}, {
    timestamps: true,
});

// Export as ES Module
export default mongoose.model("User", userSchema);
