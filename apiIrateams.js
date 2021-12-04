const express = require("express");
const app = express();
const cors = require('cors');
const mysql = require('mysql2');


const connection = mysql.createConnection(
    {
        host : "irateams.cjzbqozgh304.eu-west-3.rds.amazonaws.com",
        user : "admin",
        password : "Irateams2021",
        database : "IRATEAMS"
    });

connection.connect(function(error){
    if (error){
        console.log(error);
    }
    else {
        console.log('Conexión correcta');
    }
});

app.use(cors());
app.use(express.urlencoded({extended : false}));
app.use(express.json());

// ENDPOINTS AQUÍ!!

app.listen(3306,"localhost",()=>{
    console.log("Conectado desde el servidor 3306")
 })