const { default: mongoose } = require("mongoose");

const snippetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
      required: false
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags) {
          return tags.length <= 10;
        },
        message: "Only 10 tags are allowed",
      },
    },
    type: {
      type: String,
      default: "Snippet",
    },
    errorMessage: {
      type: String,
      default: "",
    },
    cause: {
      type: String,
      default: "",
    },
    fixCode: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    copiedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true,
  },
);

snippetSchema.index({
  title: "text",
  description: "text",
  tags: "text"
},
{
  language_override: "none",
});

module.exports = mongoose.model("Snippet", snippetSchema);