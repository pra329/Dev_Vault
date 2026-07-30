const {default: mongoose} = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 60,
        required: true
    },
    email: {
        type: String,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
        lowercase: true,
        unique: true,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: '',
        maxlength: 200
    },
    avatarUrl: {
        type: String,
        default: '',
    },
    techStack: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: ''
    },
    preferences: {
        theme: {
            type: String,
            enum: ["light", "dark"],
            default: "light"
        },
        defaultVisibility: {
            type: String,
            enum: ["private", "public"],
            default: "private"
        }
    },
    starred: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Snippet"
    }],
    isPublicProfile: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);