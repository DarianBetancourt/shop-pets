const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    items: {
        item_id:{type:String},
        quantity:{type:Number},
        type: Array,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    total: {
        type: Number,
    },
    shipDate: {
        type: Date,
        default: Date.now
    },
    complete: {
        type: Boolean,
        required: true
    },
})

module.exports = mongoose.model("order", orderSchema);