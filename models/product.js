const mongoose = require('mongoose');

const Schema = mongoose.Schema

const ProductSchema = new Schema({
  
  name: {
      type: String,
      required: true
  },

  description: {
      type: String,
      required: true
  },

  category: {
    type: String,
    require: true
  },

  tags: {
    type: Array,
  },

  photoUrl: {
    type: Array,
  },

  stock:{
    type: Number,
    require: true
  },

  expirationDate:{
    type: Date,
  },

  price: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Product', ProductSchema)