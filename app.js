const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcryptjs = require('bcryptjs');

// app y puerto dinámico 
const app = express();
const port = process.env.PORT || 3000;

// Usos
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



// Pantalla de inicio
app.get("/main", (req, res) => {
    
    res.render('inicio', {
                            tabledata: [], 
                            tabledata2: [], 
                            vistaUsuarios: "d-none",  
                            vistaMateriales: "d-none",
                            vistaCompras: "d-none" 
                        } 
        ); 
});



// Vista administración de usuarios
// REVISAR EL SQL
app.get("/usuarios", (req, res) => {

    const sql = "select usuario_id, nombre, apellido, usuario, tipo_usuario from usuarios";
    connection.query(sql, function(err, results, fields) {
        if (err) {
            console.log(err);
        } else {
            
            // source: https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
            const tabledata = JSON.parse(JSON.stringify(results));
            res.render('inicio', {
                                    tabledata: tabledata, 
                                    tabledata2: [], 
                                    vistaUsuarios: "", 
                                    vistaMateriales: "d-none",
                                    vistaCompras: "d-none" 
                                } 
            );
        }
    });
    
});


/* Vista catalogo de materiales */
app.get("/materiales", (req, res) => {
    const sql = "select * from materiales";
    connection.query(sql, function(err, results, fields) {
        if (err) {
            console.log(err);
        } else { 
            // source: https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
            const tabledata2 = JSON.parse(JSON.stringify(results));
            res.render('inicio', {
                                    tabledata: [], 
                                    tabledata2: tabledata2, 
                                    vistaUsuarios: "d-none", 
                                    vistaMateriales: "",
                                    vistaCompras: "d-none" 
                                } 
            );
        } 
    });
});



/* Vista compras. El usuario de Compras puede hacer pedidos en esta vista */
app.get("/compras", (req, res) => {

    res.render('inicio', {
                            tabledata: [], 
                            tabledata2: [], 
                            vistaUsuarios: "d-none", 
                            vistaMateriales: "d-none",
                            vistaCompras: "" 
                        } 
    );
});


/* cuando abre el modal de prod pedidos */
app.get("/compras/listaprod", (req, res) => {
    let col = 'nombre';
    const sql = "select distinct " + col + " from materiales";
    connection.query(sql, function(err, results, fields) {
        if (err) {
            console.log(err);
        } else { 
            const datos = JSON.parse(JSON.stringify(results));
            let resultado_qry =[];
            datos.forEach((v) => 
                resultado_qry.push(v[col])
            );
            res.send(resultado_qry);
        } 
    }); 
});



// TABLA PEDIDOS
/* Agrega un nuevo registro a la tabla materiales */ 
app.post("/pedidos/guardar", (req, res) => { 
    const valores = req.body;
    const sql = "insert into pedidos set ?";
    /* console.log(valores);  */

    connection.query(sql, [valores],  function(err, results, fields) {
        err ? res.end(err) : res.end("Registro correcto");
    });
}); 






// TABLA USUARIOS

/* Elimina de la tabla usuarios el id seleccionado */ 
app.post("/usuarios/eliminar/:id", (req, res) => { 
    const id = req.params.id;
    const sql = "delete from usuarios where usuario_id = ?";
    connection.query(sql, [id],  function(err, results, fields) {
        err ? res.end(err) : res.end("eliminado");
    });
}); 

/* Edita de la tabla usuarios el id seleccionado */ 
app.post("/usuarios/editar/:id", (req, res) => { 
    const valores = req.body;
    const id = req.params.id;
    const sql = "update usuarios set ? where usuario_id = ?";
    connection.query(sql, [valores, id], function(err, results, fields) {
        err ? res.end(err) : res.end("editado");
    }); 
}); 

/* Agrega un nuevo registro a la tabla usuarios */ 
app.post("/usuarios/guardar", (req, res) => { 
    const valores = req.body;
    const sql = "insert into usuarios set ?";
    console.log(valores);
    connection.query(sql, [valores],  function(err, results, fields) {
        err ? res.end(err) : res.end("Registro correcto");
    });
}); 



// TABLA MATERIALES

/* Elimina de la tabla materiales el id seleccionado */ 
app.post("/materiales/eliminar/:id", (req, res) => { 
    const id = req.params.id;
    const sql = "delete from materiales where material_id = ?";
    connection.query(sql, [id],  function(err, results, fields) {
        err ? res.end(err) : res.end("eliminado");
    });
}); 

/* Agrega un nuevo registro a la tabla materiales */ 
app.post("/materiales/guardar", (req, res) => { 
    const valores = req.body;
    const sql = "insert into materiales set ?";
    connection.query(sql, [valores],  function(err, results, fields) {
        err ? res.end(err) : res.end("Registro correcto");
    });
}); 

/* Edita de la tabla materiales el id seleccionado */ 
app.post("/materiales/editar/:id", (req, res) => { 
    const valores = req.body;
    const id = req.params.id;
    const sql = "update materiales set ? where material_id = ?";
    connection.query(sql, [valores, id], function(err, results, fields) {
        err ? res.end(err) : res.end("editado");
    }); 
}); 



// Root inicial
app.get("/", (req, res) => {
    res.render("login");
});

// Para registrase, envía el formulario al usuario
app.get("/register", (req, res)=>{
    res.render("register");
});


// POST - Registro de usuario 
app.post("/register", async (req, res) => {
    const valores = req.body;
    let passwordHash= await bcryptjs.hash(valores.contrasena,10);
    valores.contrasena=passwordHash;
    const sql = "insert into usuarios set ?";
    connection.query(sql, [valores],  function(err, results, fields) {
        if (err) {
            console.log(err);
        }
        // si llega aqui es que se registró correctamente
        res.redirect("/main");
    });
    
});


/* POST login */
app.post("/login",(req, res) => {
    
    const usuario = req.body.username;
    const pass = req.body.password;
    let conteo = 0;
    let sql = "select usuario,contrasena " + 
              "from usuarios " +
              "where usuario = '" + usuario +"' ";


    connection.query(sql, async function(err, results) {
        if (err) {
            console.log(err);
        }
        let passwr=0;
        results.forEach(fila => {
            passwr=fila.contrasena;
        });
        let comparaPw = await bcryptjs.compare(pass,passwr);
    
        if (comparaPw == true) { 
            // usuario con acceso 
            console.log('usuario con acceso');
            res.redirect("/main");
        } else {
            // usuario no encontrado
            console.log('usuario sin acceso');
            res.redirect("/");
        }
    });

});




// PORT dinámico
app.listen( port, () => {
    console.log("Server running on port " + port);
});


