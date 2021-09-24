const mongoose = require('mongoose');

const Schema = mongoose.Schema

const ProductSchema = new Schema({
  id: {
    type: Number,
    required: true
  },

  name: {
      type: String,
      required: true
  },

  description: {
      type: String,
      required: true
  },

  photoUrl: {
      type: String,
      require: true
  },

  category: {
    type: String,
    require: true
  },

  stock:{
    type: Boolean,
    require: true
  },

  expirationDate:{
    type: FormData,
  },

  price: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Product', ProductSchema)