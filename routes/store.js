const express = require("express")
const router = express.Router()
const Product = require("../models/product")
const Order = require("../models/order")
const User = require("../models/user")
const Pet = require("../models/pet")
const validator =require('validator')
const bot = require("../telegram/bot")
const middle = require("../auth/authMiddleware") //middleware


/* inventory, Products in stock and Pets availables*/
router.get("/inventory",middle.authMiddleware, async(req,res)=>{
    try {
        /* Products in stock */
        const products = await Product.find({stock:{$gt:0}})
        /* Pets availables */
        const pets = await Pet.find({status:"available"})
        /* Make inventory */
        const inventory={products:products,pets:pets}
        res.status(200).json(inventory) 
    } catch (error) {
        res.status(400).send("error getting inventory")
    }
    
})

/* get Orders, complete (false) or complete (true) */
router.get("/order/complete=:complete",middle.authMiddleware,async(req,res)=>{
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

/* create new Order */
router.post("/order",middle.authMiddleware,async(req,res)=>{
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

/* get Order by id */
router.get("/order/:id",middle.authMiddleware,async(req,res)=>{
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

/* update order by id */
router.put("/order/:id",middle.authMiddleware,async(req,res)=>{
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

/* delete order by id */
router.delete("/order/:id",middle.authMiddleware,async(req,res)=>{
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

/* Routes for Bot */
    /* update an order by its id, as completed (complete = true)*/
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


module.exports = router
