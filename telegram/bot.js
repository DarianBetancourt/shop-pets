/** @type {typeof import('telegraf').Telegraf} */
require('dotenv/config');
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.SECRET_TOKEN_TELEGRAM)
const Product = require('../models/product')
const Pet = require('../models/pet')
const Order = require('../models/order')

bot.start((ctx)=>{
    ctx.reply("hola Bienvenid@")
})
bot.help((ctx)=>{
    ctx.reply("en que te puedo ayudar?")
    ctx.reply("settings")
})
/* test comand */
bot.command("darian",async (ctx)=>{
    bot.telegram.sendMessage("-596158219","test stock")//stock
    bot.telegram.sendMessage("-567101484","test adoptions")//adoptions
    bot.telegram.sendMessage("-433173100","test sales")//sales 
    //ctx.reply("es un hacker y desarrollador Fullstack") 
})
bot.command("products",async(ctx)=>{
    const products= await Product.find({},{tags:0,category:0,__v:0,photoUrl:0})
    products.forEach(product => {
        let add=`${process.env.HOST}/product/add_stock/${product.stock}/${product._id}`;
        let delet=`${process.env.HOST}/product/del/${product._id}`;
        let subtract=`${process.env.HOST}/product/subtract_stock/${product.stock}/${product._id}`;
        let message = 
        `<u>id:</u> ${product._id} 
        <u>produto:</u> ${product.name} 
        <u>estoque:</u><strong> ${product.stock}</strong>`
        ctx.reply(message,{reply_markup:{
            inline_keyboard:[
                //fila 1
             [{text:"delete", url:delet},
             {text:"stock +", url:add},
             {text:"stock -", url:subtract}],
            ]
        },
        parse_mode:"HTML",})
    });
})
bot.command("orders",async(ctx)=>{
    const orders = await Order.find({complete:false})
    
    orders.forEach(async order => {
        let message
        let total=0
        let msg_items="";
        
        /* url to complete order */
        let completed=`${process.env.HOST}/store/order/${order._id}/completed`;
        let items =[]
            /* find items of order */ 
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
            /**************** Make Message **************** */
            for(i=0;i<items.length;i++){

                let subtotal = order.items[i].quantity * items[i].price
                
                msg_items = msg_items + `<u>item ${i+1}:</u> ${items[i].name}
                <u>price: ${items[i].price} quantity:</u>${order.items[i].quantity} 
                <u>subtotal:</u> ${subtotal}
                <u>---------</u>`
                total=total+subtotal

            }

            message = `<u>orden id:</u> ${order._id} 
            <u>items:</u> 
            ${msg_items}
            <u>total:</u> ${total}` 
            
            /* ************************************************ */
            /* Send Message */
            ctx.reply(message,{reply_markup:{
                inline_keyboard:[
                    //fila 1
                 [{text:"completed", url:completed}]
                ]
            },
            parse_mode:"HTML",})

    })

    
    
})
bot.command("pets_inAdoption",async(ctx)=>{
    const count= await Pet.count({status:"available",in_adoption:true})
        ctx.reply(count)
})
bot.command("pets_total",async(ctx)=>{
        const count= await Pet.count({status:"available"})
        ctx.reply(count)
})
bot.command("pets_detail",async(ctx)=>{
    const pets= await Pet.find({status:"available"})
    pets.forEach(pet => {
        ctx.reply(pet)
    });
    
})

bot.on('message', (ctx) => {
    //ctx.replyWithSticker('')
    ctx.replyWithPhoto('https://picsum.photos/200/300/')
}) 



bot.launch()

module.exports = bot;