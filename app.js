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
    /* res.render('inicio', {tabledata: {}, tabledata2: {} }); */
    res.render('inicio', {tabledata: [], 
        tabledata2: [], 
        vistaUsuarios: "d-none", 
        vistaMateriales: "d-none" } );
});



// Obtiene los datos de la tabla usuarios y los manda al Front
app.get("/usuarios", (req, res) => {

    const sql = "select usuario_id, nombre, apellido, usuario, tipo_usuario from usuarios";
    connection.query(sql, function(err, results, fields) {
        if (err) {
            console.log(err);
        } else {
            
            // source: https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
            const tabledata = JSON.parse(JSON.stringify(results));
            res.render('inicio', {tabledata: tabledata, 
                                tabledata2: [], 
                                vistaUsuarios: "", 
                                vistaMateriales: "d-none" } );
        }
    });
    
});


// Obtiene los datos de la tabla materiales y los manda al front
app.get("/materiales", (req, res) => {

    const sql = "select * from materiales";
    connection.query(sql, function(err, results, fields) {
        if (err) {
            console.log(err);
        } else { 
            // source: https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
            const tabledata2 = JSON.parse(JSON.stringify(results));
            res.render('inicio', {tabledata: [], 
                                tabledata2: tabledata2, 
                                vistaUsuarios: "d-none", 
                                vistaMateriales: "" } 
            );
        } 
    });

});


/* Agrega un nuevo registro a la tabla materiales */ 
app.post("/materiales/guardar", (req, res) => { 
    //console.log(req.params); 
    const valores = req.body;

    /* console.log(valores); */
    
    const sql = "insert into materiales set ?";
    connection.query(sql, [valores],  function(err, results, fields) {
        err ? res.end(err) : res.end("Registro correcto");
    });
}); 

/* Elimina de la tabla materiales el id seleccionado */ 
app.post("/materiales/eliminar/:id", (req, res) => { 
    //console.log(req.params); 
    const id = req.params.id;
    const sql = "delete from materiales where material_id = ?";
    connection.query(sql, [id],  function(err, results, fields) {
        err ? res.end(err) : res.end("eliminado");
    });
}); 


/* Edita de la tabla materiales el id seleccionado */ 
app.post("/materiales/editar/:id", (req, res) => { 
    //console.log(req.params); 
    const valores = req.body;
    const id = req.params.id;
    const sql = "update materiales set ? where material_id = ?";
    connection.query(sql, [valores, id], function(err, results, fields) {
        err ? res.end(err) : res.end("editado");
    }); 
}); 






app.get("/login", (req, res)=>{
    res.render("login", { tabledata: {}} );
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


