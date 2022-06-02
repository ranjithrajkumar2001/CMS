const express = require("express")
const connection = require("./database")
const app = express()
const port = 5000
const bodyParser = require("body-parser")
const route = require("./routes/routing")

//Database Connection
connection.connect(function(err){
    if(err) throw err
    console.log("Database Connected")
})

//Middlewares
app.use(express.static('public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
// app.use(upload.array()); 
//Routing
app.use(route)
app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})
