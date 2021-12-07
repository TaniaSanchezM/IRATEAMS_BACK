const express    = require("express");
const app        = express();
const cors       = require('cors');
const mysql      = require('mysql2');
const crypto     = require('crypto');
const jwt        = require('jsonwebtoken');
const connection = mysql.createConnection(
    {
        host: "irateams.cjzbqozgh304.eu-west-3.rds.amazonaws.com",
        user: "admin",
        password: "Irateams2021",
        database: "IRATEAMS"
    });

connection.connect(function (error) {
    if (error) {
    }
    else {
        console.log('Conexión correcta');
    }
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const KEY       = 'secret.-.password-.-';
const Encrypt   =  (pwd) => crypto.createHmac('sha256', KEY).update(pwd).digest('hex');
const TOKEN_KEY = 'c38bdf8c-5682-11ec-bf63-0242ac130002';
app.post('/login', (req, res) => {
    const user              = req.body.user;
    const encryptpassword   = Encrypt(req.body.password);
    const password          = req.body.password;
    const params            = [user,user,password,encryptpassword]
    const query             = `SELECT id_usuario from usuario WHERE (username = ? || mail = ?) and (password = ? or password = ?)`;
    let response;
    connection.query(query,params,(err, results) =>{
        if(err){
            console.error(err);
            response = {
                error:true,
                msg:"Error al conectar con la base de datos", 
                resultado:err
            };
            res.status(500).send(response);
            return;
        }
        if (results.length > 0) { 
            const token = generateAccessToken(results[0].id_usuario);
            response    = {
                error:false,
                msg:"Inicio de sesión completado", 
                resultado:results,
                token:token
            }
            res.status(200).send(response);
        } else {
            response = {
                error:false,
                msg:"El usuario o la contraseña no son correctos", 
                resultado:results
            }
            res.status(404).send(response);
        }
          
    });
  });

app.get('/login/check',authenticateToken,(req,res)=>{
    res.status(200).send({
        error:false,
        msg:"Token correcto", 
    })
});


  function generateAccessToken (userID) {
    return jwt.sign({userID}, TOKEN_KEY, {expiresIn: '7d'});
  }
  
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1]
    const token = authHeader;
    if (token == null) {
      return res.sendStatus(401)
    }
    jwt.verify(token, TOKEN_KEY, (err, data) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.userId = data.userId;
      next();
    });
  }

app.listen(4120, "localhost", () => {
    console.log("Conectado desde el servidor 4120")
})