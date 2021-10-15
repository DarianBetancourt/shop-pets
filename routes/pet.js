const express = require("express")
const router = express.Router()
const Pet = require("../models/pet")
const validator =require('validator');
const middle = require("../auth/authMiddleware") //middleware

router.get("/",middle.authMiddleware,async(req,res)=>{
    try {
        const pets = await Pet.find()
        if(pets){
            /* pets.push({count:pets.length}) */
            res.status(200).send(pets)
        }else{
            res.status(400).send("error")
        }
    } catch (error) {
        console.log(error)
    }
   
})
router.post("/",middle.authMiddleware,async(req,res)=>{
    try {
        const pet = await Pet.create(req.body)
        res.status(200).send(pet)
    } catch (error) {
        console.log(error)
        res.status(400).send("error adding pet")
    }
})
router.get("/findByStatus/:status",middle.authMiddleware,async(req,res)=>{
    try {
        if(compare(req.params.status)){
            const pet = await Pet.find({status:req.params.status})
            res.status(200).send(pet)
        }else{
            res.status(400).send("invalid pet status")
        }
         
     } catch (error) {
         console.log(error)
         res.status(400).send("error getting pet")
     }
})
router.get("/:id",middle.authMiddleware,async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const pet = await Pet.findById(req.params.id)
            res.status(200).send(pet)
        }else{
            res.status(400).send("invalid pet id")
        }
         
     } catch (error) {
         console.log(error)
         res.status(400).send("error getting pet")
     }
})
router.put("/:id",middle.authMiddleware,async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {new: true})
            res.status(200).send(pet);
        }
        else{
            res.status(400).send("invalid pet id")
        }
        
     } catch (error) {
         console.log(error)
         res.status(400).send("error updating pet")
     }
})
router.delete("/:id",middle.authMiddleware,async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            await Pet.findByIdAndDelete(req.params.id)
            res.status(200).send("deleted pet whit id : "+req.params.id)
        }
        else{
            res.status(400).send("invalid pet id")
        }
        
     } catch (error) {
         console.log(error)
         res.status(400).send("error")
     }
})

/* function to compare the value received in the request 
with the statuses => [available, pending, sold] */

function compare(value){
    if(value=="available" || value == "sold" || value=="pending"){
        return true
    }
    else{
        return false
    }
}

module.exports = router
