const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

// app y puerto dinámico 
const app = express();
const port = process.env.PORT || 3000;

// Usos básicos
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Conexión a la DBjawsdb
let connection;

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);

} else { 
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'grupogamex'
    });
}


// Para ver si muestra msg

// Home route. hace el conteo de los usuarios
app.get("/", (req, res) => {
    //res.send("Welcome to your first real proyect");
    //res.sendFile(__dirname + "/index.html");
    let sql = "select count(*) as conteo from usuarios";
    let conteo = 0;
    
    connection.query(sql, function(err, results) {
        if (err) {
            console.log(err);
        }
        conteo = results[0].conteo;
        //res.send("we have " + conteo + " users in our users table");
        res.render("index", {usuarios: conteo});
    });
});


// Post - Registro de usuario 
app.post("/register", (req, res) => {

    let nombre = req.body.fnombre;
    let apellido = req.body.fapellido;
    let area = req.body.farea;
    let usuario = req.body.fusuario;
    let contrasena = req.body.fcontrasena;
    let tipoDeUsuario = req.body.ftipodeusuario;
    let sql = "insert into usuarios (nombre, apellido, area, usuario, contrasena, tipo_usuario) values ('" + 
                nombre +  "', '" + 
                apellido +  "', '" + 
                area +  "', '" + 
                usuario +  "', '" + 
                contrasena +  "', '" + 
                tipoDeUsuario + "' )";

    connection.query(sql, function(err, results) {
        if (err) {
            console.log(err);
        }

        // si llega aqui es que se registró correctamente
        res.redirect("/");
    });
    
});

// agrega port dinámico
app.listen( port, () => {
    console.log("Server running on port " + port);
});


