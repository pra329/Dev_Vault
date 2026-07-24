const { default: mongoose } = require("mongoose");

const collectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    color: {
        type: String,
        default: '#534AB7'
    },
    icon: {
        type: String,
        default: 'folder'
    }
},{
    timestamps: true
});

collectionSchema.index(
    { userId: 1, name: 1 },
    { unique: true }
);

module.exports = mongoose.model("Collection", collectionSchema)