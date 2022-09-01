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


// Conexión a la DBjawsdb with Heroku 
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



app.get("/", (req, res)=>{
    //res.render("start", {tabledata: {} });

    res.render("inicio", {tabledata: {}});

});




// Para ver si muestra msg

// Start route. hace el conteo de los usuarios
app.get("/tabla", (req, res) => {
    
    // obtiene todos los usuarios de "ususarios"
    const sql = "select usuario_id, nombre, apellido, usuario, tipo_usuario from usuarios";
    
    connection.query(sql, function(err, results, fields) {
        if (err) {
            console.log(err);
        } else {
            
            // source: https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
            const tabledata = JSON.parse(JSON.stringify(results));
            
            //console.log(tabledata);
            
            res.render('tabla', {tabledata: tabledata} );
        }
        
    });
    
});


app.get("/login", (req, res)=>{
    res.render("login", { tabledata: {}});
});



app.get("/register", (req, res)=>{
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
        res.render("register", {usuarios: conteo, tabledata: {}});
    });
});




// Post - Registro de usuario 
app.post("/register", (req, res) => {

    const nombre = req.body.fnombre;
    const apellido = req.body.fapellido;
    const area = req.body.farea;
    const usuario = req.body.fusuario;
    const contrasena = req.body.fcontrasena;
    const tipoDeUsuario = req.body.ftipodeusuario;
    const sql = "insert into usuarios (nombre, apellido, area, usuario, contrasena, tipo_usuario) values ('" + 
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
        res.render("home", { tabledata: {}});
    });
    
});


/* login */
app.post("/login", (req, res)=> {
    
    const usuario = req.body.username;
    const pass = req.body.password;
    let conteo = 0;

    let sql = "select count(*) as conteo " + 
              "from usuarios " +
              "where usuario = '" + usuario + "' and contrasena = '"+ pass +"' ";

    //console.log(sql);

    connection.query(sql, function(err, results) {
        if (err) {
            console.log(err);
        }
        
        conteo = results[0].conteo;

        if (conteo == 1) { 
            // usuario con acceso 
            res.render("inicio", {tabledata: {}});
        } else {
            // usuario no encontrado
            res.redirect("/");
        }
    });

});





// agrega port dinámico
app.listen( port, () => {
    console.log("Server running on port " + port);
});


