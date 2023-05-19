const express=require('express');
const app=express();
const routes=require('./routes/index')
const fileUpload = require('express-fileupload');
require('dotenv').config();
var models = require('./db/models')


app.use(express.json({limit:'5mb'}))
app.use(express.urlencoded({extended:true}))
app.use(fileUpload());
app.use('/',routes)

app.listen(process.env.SERVER_PORT,()=>{
    models.sequelize.sync().then(()=>{
        console.log('-----Working------')

    })
})