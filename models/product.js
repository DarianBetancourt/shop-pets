const mongoose = require('mongoose');

const Schema = mongoose.Schema

const ProductSchema = new Schema({
  nome: {
      type: String,
      required: true
  },  
  descricao: {
      type: String,
      required: true
  },
    
    valor: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Product', ProductSchema)