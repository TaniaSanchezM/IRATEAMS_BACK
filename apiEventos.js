const express = require("express");
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const { request } = require("http");

let port = 5000;

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



app.get("/", function(request, response)
{
        // INICIALIZAR API, al inicio API vacia, no se puede hacer un get de algo "vacio"
        let respuesta = {error:true, msg:"Punto de inicio", resultado:err}
        response.status(200).send(respuesta);
}
)


app.get("/eventos", function (request, response)
{
    console.log("entrada get")

    let id = request.query.id;

    let sql;
    let respuesta;

    if(id == null)
    {
        console.log("get eventos");
        sql = "SELECT * FROM IRATEAMS.evento JOIN IRATEAMS.usuario ON (evento.id_creador = usuario.id_usuario) ORDER BY fecha ASC;"
        
    }else
    {
        console.log("get evento");
        url = "/eventos?id="+request.query.id
        sql = "SELECT * FROM IRATEAMS.evento JOIN IRATEAMS.usuario ON (evento.id_creador = usuario.id_usuario) WHERE id_evento ="+id
    }

    connection.query(sql, function(err, result)
    {
        if(err)
        {
            console.log("error get");
            console.log(err);
        }else
        {
            console.log(result);
            respuesta = {error:true, msg:"Get evento/s", resultado:result};
            response.status(200).send(respuesta)
            // response.send(respuesta);
        }
    })

    console.log("salida get");


})

// app.get('/eventos', function(request, response){
//     let query = `SELECT * FROM eventos`;
//     let respuesta;
//     connection.query(query,(err, results) =>{
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
//                 respuesta = {error:false, msg:"Se han encontrado eventos", resultado:results}
//                 response.status(200).send(respuesta);
//             }
//         }
//     });
// });

app.post("/eventos", function(request, response)
{
    console.log("Entra al post")

    let respuesta;
    console.log(request.body)

    let evento = { deporte: request.body.deporte,
                    titulo: request.body.titulo,
                    id_creador: request.body.id_creador,
                    nPersSolicitadas: request.body.nPersSolicitadas,
                    fecha: request.body.fecha,
                    direccion: request.body.direccion,
                    localidad: request.body.localidad,
                    descripcion: request.body.descripcion,
                    material: request.body.material,
                    pago: request.body.pago

    }




    let sql = `INSERT INTO evento(deporte, titulo, id_creador, nPersSolicitadas, fecha, direccion, localidad, descripcion, material, pago ) 
                VALUES(\"${request.body.deporte}\", \"${request.body.titulo}\", \"${request.body.id_creador}\", \"${request.body.nPersSolicitadas}\", \"${request.body.fecha}\", \"${request.body.direccion}\", \"${request.body.localidad}\", \"${request.body.descripcion}\", \"${request.body.material}\", \"${request.body.pago}\")`

    connection.query(sql, function(err,result)
    {
        if(err)
        {
            console.log("error put");
            console.log(err)
        }
        else{
            console.log(result)
            respuesta = {error:false, msg:"Evento creado", resultado:result}
            response.status(200).send(respuesta);
            
        }
    })
    console.log("salida post")

    
})

app.put("/eventos", function(request, response)
{
    console.log("Entra put");

    let respuesta;


    // let id = request.body.id
    let deporte = request.body.deporte
    let titulo = request.body.titulo
    let id_creador = request.body.id_creador
    let nPersSolicitadas = request.body.nPersSolicitadas
    let fecha = request.body.fecha
    let direccion = request.body.direccion
    let localidad = request.body.localidad
    let descripcion = request.body.descripcion
    let material = request.body.material
    let pago = request.body.pago
    let id_evento = request.body.id_evento

    let params = [  deporte,
                    titulo,
                    id_creador,
                    nPersSolicitadas,
                    fecha,
                    direccion,
                    localidad,
                    descripcion,
                    material,
                    pago
                    ]
    
    
    let sql = "UPDATE evento SET deporte = COALESCE(?,evento.deporte), titulo = COALESCE(?,evento.titulo), id_creador = COALESCE(?, id_creador), nPersSolicitadas = COALESCE(?, evento.nPersSolicitadas), fecha = COALESCE(?, evento.fecha), direccion = COALESCE(?, evento.direccion), localidad = COALESCE(?, evento.localidad), descripcion = COALESCE(?, evento.descripcion), material = COALESCE(?, evento.material), pago = COALESCE(?, evento.pago) WHERE id_evento="+id_evento
          
    
    
    connection.query(sql, params, function(err,result){

        if(err)
        {
            console.log("Error put");
            console.log(err)
        }
        else{
                
            console.log(result)
            respuesta = {error:false, msg:"Evento modificado", resultado:result}
            response.status(200).send(respuesta);
        
        }
    })
    console.log("salida put")


})

app.delete("/eventos", function(request, response)
{
    

    let id = request.body.id_evento
    console.log(id)

    let respuesta;

    let sql2 = "DELETE FROM evento WHERE id_evento="+id

    connection.query(sql2, function(err,result){

        if(err){
                console.log(err)
        }
        else{
                console.log("Evento eliminado")
                console.log(result)
                respuesta = {error:false, msg:"Evento eliminado", resultado:result}
                response.status(500).send(respuesta);
               
                
        }
    })
    console.log("funcionando")


})

app.listen(port,"localhost",()=>{
    console.log("Conectado desde el servidor "+port)
 })