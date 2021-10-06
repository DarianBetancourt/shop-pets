const express = require("express")
const router = express.Router()
const validator = require("validator")
const Product = require("../models/product")

router.get("/",async(req,res)=>{
    try {
        const products = await Product.find()
        res.status(200).send(products)
    } catch (error) {
        console.log(error)
        res.status(400).send("error getting the products")
    }
})

router.post("/",async(req,res)=>{
   try {
        const product = await Product.create(req.body)
        res.status(200).send(product)
    } catch (error) {
        console.log(error)
        res.status(400).send("error adding product")
    }
})

router.get("/:id",async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const product = await Product.findById(req.params.id)
            res.status(200).send(product)
        }else{
            res.status(400).send("invalid product id")
        }
         
     } catch (error) {
         console.log(error)
         res.status(400).send("error getting product")
     }
 })
router.put("/:id",async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true,})
            res.status(200).send(product);
        }
        else{
            res.status(400).send("invalid product id")
        }
        
     } catch (error) {
         console.log(error)
         res.status(400).send("error updating product")
     }
 })
router.delete("/:id",async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            await Product.findByIdAndDelete(req.params.id)
            res.status(200).send("deleted product whit id : "+req.params.id)
        }
        else{
            res.status(400).send("invalid product id")
        }
        
     } catch (error) {
         console.log(error)
         res.status(400).send("error")
     }
 })
router.get("/add_stock/:old_stock/:id",async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            let new_stock=parseInt(req.params.old_stock)+1;
            const product = await Product.findByIdAndUpdate(req.params.id,{stock:new_stock}, {new: true,})
            //res.status(200).send(product);
            console.log("add success stock:"+product.stock)
            res.status(200).send("add success stock:"+product.stock);
        }
        else{
            res.status(400).send("invalid product id")
            console.log("invalid product id")
        }
        
     } catch (error) {
         console.log(error)
         res.status(400).send("error updating product")
     }
})
router.get("/subtract_stock/:old_stock/:id",async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const product = await Product.findByIdAndUpdate(req.params.id,{stock:req.params.old_stock-1}, {new: true,})
            //res.status(200).send(product);
            console.log("add success stock:"+product.stock)
            res.status(200).send("add success stock:"+product.stock);
        }
        else{
            res.status(400).send("invalid product id")
            console.log("invalid product id")
        }
        
     } catch (error) {
         console.log(error)
         res.status(400).send("error updating product")
     }
})

module.exports = router