process.env.NTBA_FIX_319 = 1;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routerStore = require("./routes/store")
const routerProduct = require ("./routes/product")
const routerUser = require("./routes/user")
const routerPet = require("./routes/pet")
const bot = require("./telegram/bot")
require('dotenv/config');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

/* Documentation Swagger*/
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));

/* Coneccion MongoDB*/
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_DB

mongoose.connect(mongoUrl, {useNewUrlParser:true, useUnifiedTopology: true,})

/* Aceptar formatos de formulario y json*/
app.use(express.json())
app.use(express.urlencoded({ extended: false}));

/* Rutas */
app.use("/store",routerStore)
app.use("/product",routerProduct)
app.use("/user",routerUser)
app.use("/pet",routerPet) 
app.get('/',(req, res) => {
    res.send(`<h1>Hola mundo</h1>Soy un servidor node con express, sere una API para un PetShop <hr>
	<h1> Hello world</h1>I am a node server with express, I will be an API for a PetShop <hr><br>
	<h1> Olá mundo</h1>Sou um servidor de node com express, serei uma API para um PetShop<hr>`)
})

app.listen(port, () => {
    console.log('Rodando o servidor na porta '+port)
});
