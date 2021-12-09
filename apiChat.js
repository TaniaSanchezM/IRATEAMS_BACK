const express = require("express");
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const { response, request } = require("express");

let sql;
const connection = mysql.createConnection(
    {
        host: "irateams.cjzbqozgh304.eu-west-3.rds.amazonaws.com",
        user: "admin",
        password: "Irateams2021",
        database: "IRATEAMS"
    });

connection.connect(function (error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Conexión correcta');
    }
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ENDPOINTS AQUÍ!!
///////   CHAT GENERAL   ///////

app.get("/chats",
    function (request, response) {
        url = "/chats?id=" + request.query.id;
        sql = "SELECT id_chat, id_user1, id_user2, username, mail, nombreCompleto FROM IRATEAMS.chat JOIN IRATEAMS.evento ON (id_user2 =  id_creador) JOIN IRATEAMS.usuario ON (id_creador = id_usuario) WHERE id_user1 =" + request.query.id;

        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                respuesta = { err: true, msg: "Error al conectar con la base de datos", resultado: err }
                response.status(500).send(respuesta);
            } else {
                respuesta = { error: false, msg: "Se han encontrado los chats", resultado: result }
                response.status(200).send(respuesta);
            }
        })
    })

app.post("/chat",
    function (request, response) {
        sql = `SELECT * FROM IRATEAMS.chat WHERE (id_user1 = ${request.body.id} AND id_user2 = ${request.body.id}) OR (id_user2 = ${request.body.id} AND id_user1 = ${request.body.id})`;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                respuesta = { err: true, msg: "Error al conectar con la base de datos", resultado: err }
                response.status(500).send(respuesta);
            } else {
                // respuesta = {error:false, msg:"Chat creado correctamente", resultado:result}
                // response.status(200).send(respuesta);
                if (result == "") {
                    sql = `INSERT INTO IRATEAMS.chat (id_user1, id_user2)
                VALUES ('${request.body.id_user1}', '${request.body.id_user2}')`;

                    connection.query(sql, function (err, result) {
                        if (err) {
                            console.log(err);
                            respuesta = { err: true, msg: "Error al conectar con la base de datos", resultado: err }
                            response.status(500).send(respuesta);
                        } else {
                            respuesta = {error:false, msg:"Chat creado correctamente", resultado:result}
                            response.status(200).send(respuesta);
                        }
                    })
                } else if (result != "") {
                    respuesta = {error:false, msg:"El chat ya está creado", resultado:result}
                    response.status(200).send(respuesta);
                }
            }
        })
    })

app.delete("/chats",
    function (request, response) {
        sql = `DELETE FROM IRATEAMS.chat WHERE id_chat=${request.body.id}`
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                respuesta = { err: true, msg: "Error al conectar con la base de datos", resultado: err }
                response.status(500).send(respuesta);
            } else {
                respuesta = {error:false, msg:"Chat eliminado correctamente", resultado:result}
                response.status(200).send(respuesta);
            }
        })
    })

///////   CHAT INDIVIDUAL   ///////

app.get("/mensajes",
    function (request, response) {
        url = "/mensajes?id=" + request.query.id;
        sql = "SELECT * FROM IRATEAMS.mensajes JOIN IRATEAMS.chat ON (mensajes.id_chat = chat.id_chat) JOIN IRATEAMS.evento ON (id_user2 = id_creador) JOIN IRATEAMS.usuario ON (id_creador = id_usuario) WHERE chat.id_chat = " + request.query.id;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                respuesta = { err: true, msg: "Error al conectar con la base de datos", resultado: err }
                response.status(500).send(respuesta);
            } else {
                respuesta = { error: false, msg: "Se han encontrado los mensajes", resultado: result }
                response.status(200).send(respuesta);
            }
        })
    })

app.post("/mensajes",
    function (request, response) {

        sql = `INSERT INTO IRATEAMS.mensajes (id_chat, id_emisor, mensaje, fecha)
    VALUES ('${request.body.id_chat}', '${request.body.id_emisor}', '${request.body.mensaje}', '${request.body.fecha}')`;

        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                respuesta = { err: true, msg: "Error al conectar con la base de datos", resultado: err }
                response.status(500).send(respuesta);
            } else {
                respuesta = { error: false, msg: "Mensaje creado mensajes", resultado: result }
                response.status(200).send(respuesta);
            }
        })
    })

// app.delete("/mensajes/:id",
// function(request, response)
// {
//     sql = `DELETE FROM IRATEAMS.mensajes WHERE id_mensaje=${request.params.id}`;

//     connection.query(sql, function(err, result)
//     {
//         if(err){
//             console.log(err);
//         } else {
//             response.send(result);
//         }
//     })
// })




app.listen(4000, "localhost", () => {
    console.log("Conectado desde el servidor")
})