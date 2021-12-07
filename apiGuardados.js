const express = require("express");
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const { use } = require("express/lib/application");

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

// // GET
// app.get("/guardados", function(request,response){
//     let id  = request.query.id;
//     let params = [id];
//     let sql; 

//     if (id == null) {
//          sql = "SELECT * FROM IRATEAMS.guardados"
//     }else{
//         sql =  "SELECT * FROM IRATEAMS.guardados WHERE id_usuario=?"
//         connection.query(sql,params, function(err, results){
//             if(err){
//                 console.error(err);
//                 respuesta = {error:true,msg:"Error al conectar con la base de datos", resultado:err};
//                 response.status(500).send(respuesta);
//             }
//             else{
//                 if (results.length == 0) {
//                     respuesta = {error:false,msg:"No se han encontrado eventos", resultado:results}
//                     response.status(404).send(respuesta);
//                 } else {
//                     respuesta = {error:false,msg:"eventos encontrados", resultado:results}
//                     response.status(200).send(respuesta);
//                 }
//             }
//         });
//     }});

//DELETE

// app.delete("/guardados", function(request, response){
//     let id  = request.body.id_usuario
//     let params = [id]
     

//     let sql = "DELETE FROM IRATEAMS.guardados WHERE id_usuario = ?" 
//     connection.query(sql,params, function(err, results){
//         if(err){
//             console.error(err);
//             respuesta = {error:true,msg:"Error al conectar con la base de datos", resultado:err};
//             response.status(500).send(respuesta);
//         }
//         else{
//             if (results.length == 0) {
//                 respuesta = {error:false,msg:"No se han encontrado eventos", resultado:results}
//                 response.status(404).send(respuesta);
//             } else {
//                 respuesta = {error:false,msg:"eventos encontrados", resultado:results}
//                 response.status(200).send(respuesta);
//             }
//         }
//     });
    
// })

// POST
app.post("/guardados", function(request, response){
    console.log("funciona")
    let user = request.body.id_usuario
    let event = request.body.id_evento
    let params = [user, event]
    let respuesta
    
    let sql=`INSERT INTO IRATEAMS.guardados (id_usuario, id_evento) VALUES (?,?)`

    connection.query(sql,params, function(err, results){
        if(err){
            console.error(err);
            respuesta = {error:true,msg:"Error al conectar con la base de datos", resultado:err};
            response.status(500).send(respuesta);
        }
        else{
            if (results.length == 0) {
                respuesta = {error:false,msg:"No se han encontrado eventos", resultado:results}
                response.status(404).send(respuesta);
            } else {
                respuesta = {error:false,msg:"eventos encontrados", resultado:results}
                response.status(200).send(respuesta);
            }
        }
    });gi
})


app.listen(3000)