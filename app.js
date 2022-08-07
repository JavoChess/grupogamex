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


// Conexión a la DB
let connection;

if (process.env.JAWSDB_URL) {
    connection = mysql.connection(process.env.JAWSDB_URL);

} else { 
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'grupogamex'
    });
}

// Home route. hace el conteo de los usuarios
app.get("/", (req, res)=>{
    //res.send("Welcome to your first real proyect");
    //res.sendFile(__dirname + "/index.html");
    let sql = "select count(*) as conteo from grupogamex.users2";
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


// Post - Registro de user
app.post("/register", (req, res)=>{

    let nombreUsuario = req.body.nombre;
    let email = req.body.correo;
    let sql = "insert into users2 (name, email) values ('" + nombreUsuario +  "', '" + email + "' )";

    connection.query(sql, function(err, results) {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });
    
});

// agrega port dinámico
app.listen( port, ()=>{
    console.log("Server running a port " + port);
});





// Cambio a process.env.PORT, en la definición de la const