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


// Para mostrar los datos del perfil al editar perfil
app.get("/usuarios", function(request, response)
{
    let id = request.query.id;
    let params =[id];
    let sql;
    if(request.query.id == null){
        sql = "SELECT * FROM IRATEAMS.usuario"
    }
    else {
        sql = "SELECT * FROM IRATEAMS.usuario WHERE id_usuario=?" 
    }

    connection.query(sql, params, function(err, result)
    {
        if(err){
            console.error(err);
            respuesta = {error:true,msg:"Error al conectar con la base de datos", resultado:err};
            response.status(500).send(respuesta);
        }
        else{
            if (result.length == 0) {
                respuesta = {error:false,msg:"Error al obtener usuario", resultado:result}
                response.status(404).send(respuesta);
            } else {
                respuesta = {error:false,msg:"Usuario", resultado:result}
                response.status(200).send(respuesta);
            }
        }
    });
});

// Para registrarse
app.post("/usuarios", function(request, response)
{
    let username =request.body.username;
    let mail =request.body.mail;
    let password= request.body.password;

    let params=[username, mail, password]

    console.log(request.body);
    let sql= "INSERT INTO IRATEAMS.usuario (username, mail, password) VALUES (?,?,?)"
    console.log(sql);
    connection.query(sql, params, function(err, result)
    {
        if(err){
            console.error(err);
            respuesta = {error:true,msg:"Error al conectar con la base de datos", resultado:err};
            response.status(500).send(respuesta);
        }
        else{
            if (result.length == 0) {
                respuesta = {error:false,msg:"Error al crear el usuario", resultado:result}
                response.status(404).send(respuesta);
            } else {
                respuesta = {error:false,msg:"Usuario creado", resultado:result}
                response.status(200).send(respuesta);
            }
        }
    });                  
});

// Para modficicar datos del usuario
app.put("/usuarios", function(request, response)
{
    console.log(request.body);
    
    let password= request.body.password;
    let nombreCompleto= request.body.nombreCompleto;
    let fechaNacimiento= request.body.fechaNacimiento;
    let telefono= request.body.telefono;
    let urlFoto= request.body.urlFoto;

    let id = request.body.id_usuario

    let params=[password, nombreCompleto, fechaNacimiento, telefono, urlFoto, id]

    let sql = "UPDATE IRATEAMS.usuario SET password = ?, nombreCompleto = ?, fechaNacimiento = ?,  telefono = ?, urlFoto = ? WHERE id_usuario= ?";
    
    connection.query(sql, params, function(err, result)
    {
        if(err){
            console.error(err);
            respuesta = {error:true,msg:"Error al conectar con la base de datos", resultado:err};
            response.status(500).send(respuesta);
        }
        else{
            if (result.length == 0) {
                respuesta = {error:false,msg:"Error al modificar los datos de usuario", resultado:result}
                response.status(404).send(respuesta);
            } else {
                respuesta = {error:false,msg:"Datos modificados", resultado:result}
                response.status(200).send(respuesta);
            }
        }
    });
});


// Por ahora no hay funcionalidad de eliminar
app.delete("/usuarios", function(request,response)
{
    let id = request.body.id_usuario
    let params=[id]
    let sql = "DELETE FROM IRATEAMS.usuario WHERE id_usuario = ?"
    
    connection.query(sql,params,function(err, result)
    {
        if(err){
            console.error(err);
            respuesta = {error:true,msg:"Error al conectar con la base de datos", resultado:err};
            response.status(500).send(respuesta);
        }
        else{
            if (result.length == 0) {
                respuesta = {error:false,msg:"Error al eliminar el usuario", resultado:result}
                response.status(404).send(respuesta);
            } else {
                respuesta = {error:false,msg:"Usuario eliminado", resultado:result}
                response.status(200).send(respuesta);
            }
        }
    });
});

// HISTORIAL DE EVENTOS REALIZADOS
app.get("/historial", function(request, response)
{
    let id = request.query.id;
    let params =[id];

    let sql = "SELECT titulo, fecha, direccion, localidad FROM IRATEAMS.evento AS ev JOIN apuntados AS ap ON (ev.id_evento = ap.id_evento) JOIN usuario AS us ON (ap.id_usuario = us.id_usuario) WHERE us.id_usuario = ? AND  fecha < CURDATE();" 

    connection.query(sql,params,function(err, result)
    {
        if(err){
            console.error(err);
            respuesta = {error:true,msg:"Error al conectar con la base de datos", resultado:err};
            response.status(500).send(respuesta);
        }
        else{
            if (result.length == 0) {
                respuesta = {error:false,msg:"Error al obtener el historial", resultado:result}
                response.status(404).send(respuesta);
            } else {
                respuesta = {error:false,msg:"Historial obtenido", resultado:result}
                response.status(200).send(respuesta);
            }
        }
    });
});


// MIS PRÓXIMOS EVENTOS (CALENDARIO)
app.get("/calendario", function(request, response)
{
    let id = request.query.id;
    let params =[id];

    let sql = "SELECT titulo, fecha, direccion, localidad FROM IRATEAMS.evento AS ev JOIN apuntados AS ap ON (ev.id_evento = ap.id_evento) JOIN usuario AS us ON (ap.id_usuario = us.id_usuario) WHERE us.id_usuario = ? AND  fecha >= CURDATE();" 

    connection.query(sql,params,function(err, result)
    {
        if(err){
            console.error(err);
            respuesta = {error:true,msg:"Error al conectar con la base de datos", resultado:err};
            response.status(500).send(respuesta);
        }
        else{
            if (result.length == 0) {
                respuesta = {error:false,msg:"Error al obtener próximos eventos", resultado:result}
                response.status(404).send(respuesta);
            } else {
                respuesta = {error:false,msg:"Próximos eventos", resultado:result}
                response.status(200).send(respuesta);
            }
        }
    });
});

let port = process.env.PORT || 3000
app.listen(port,"heroku",()=>{
    console.log("Conectado desde el servidor " + port)
 })