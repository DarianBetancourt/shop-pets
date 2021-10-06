const express = require("express")
const router = express.Router()
const Product = require("../models/product")
const Order = require("../models/order")
const User = require("../models/user")
const Pet = require("../models/pet")
const validator =require('validator');
const bot = require("../telegram/bot")

router.get("/order/complete=:complete",async(req,res)=>{
    try {
        const orders = await Order.find({complete:req.params.complete})
        if(orders){
            res.status(200).send(orders)
        }else{
            res.status(400).send("error")
        }
    } catch (error) {
        console.log(error)
    }
   
})

router.post("/order",async(req,res)=>{
    try {
        let bool=false;
        /* Order */
        const order = await Order.create(req.body)
        /* updating stock items */
        for (let i = 0; i < order.items.length; i++) {
            let id = order.items[i].item_id
            let quantity = order.items[i].quantity
            try {
                /* en caso de que sea mascota */
                let item = Pet.findById(id)
                console.log(item._id)

                if (item._id==undefined){
                    item = await Product.findById(id)
                    /* */
                    if((item.stock > 0) && (item.stock > quantity)){
                        item.stock = item.stock - quantity
                        await Product.findByIdAndUpdate(id,{stock:item.stock}, {new: true,})
                        if(item.stock<5){
                            bot.telegram.sendMessage("-596158219",`alerta => ${item.name} de id:${item._id} solo le quedan ${item.stock} unidades`)//stock
                        }
                    }
                    else{
                        bool=true
                        res.status(400).send({error:"insufficient product stocks"}) 
                    }

                }
                else{

                    if(item.status=="available"){
                        await Pet.findByIdAndUpdate(id,{status:"pending"}, {new: true,})
                    }
                    else{
                        bool=true
                        res.status(400).send({error:"Pet unavailable"}) 
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }

        if(bool==false){
            res.status(200).send(order)
        }
    } catch (error) {
        console.log(error)
        res.status(400).send("error adding order")
    }
})

router.get("/order/:id",async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const order = await Order.findById(req.params.id)
            const user = await User.findById(order.user_id)
            let items =[] 
            for (let i = 0; i < order.items.length; i++) {
                let id= order.items[i].item_id
                let item = await Pet.findById(id)
                if (item!=undefined) {
                    items[i]=item
                }else{
                    item = await Product.findById(id)
                    items[i]=item
                }
            }
           res.status(200).send({"order":order,"user":user,"items":items})
        }else{
            res.status(400).send("invalid order id")
        }
         
     } catch (error) {
         console.log(error)
         res.status(400).send("error getting order")
     }
})
router.get("/order/:id/completed",async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const order = await order.findByIdAndUpdate(req.params.id,{complete:true}, {new: true,})
            res.status(200).send({message:"order completed",order:order});
        }
        else{
            res.status(400).send("invalid order id")
        }
        
     } catch (error) {
         console.log(error)
         res.status(400).send("error updating order")
     }
})
router.put("/order/:id",async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const order = await order.findByIdAndUpdate(req.params.id, req.body, {new: true,})
            res.status(200).send(order);
        }
        else{
            res.status(400).send("invalid order id")
        }
        
     } catch (error) {
         console.log(error)
         res.status(400).send("error updating order")
     }
})
router.delete("/order/:id",async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            await order.findByIdAndDelete(req.params.id)
            res.status(200).send("deleted order whit id : "+req.params.id)
        }
        else{
            res.status(400).send("invalid order id")
        }
        
     } catch (error) {
         console.log(error)
         res.status(400).send("error")
     }
})


module.exports = router
