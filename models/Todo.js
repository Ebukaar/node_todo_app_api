const mongoose = require("mongoose")

const TodoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
   {
    timestamps: true
});

module.exports = new mongoose.model("Todo", TodoSchema);