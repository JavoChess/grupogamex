const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { promisify } = require('util');
const { table } = require('console');

dotenv.config({ path: './.env' });

// app y puerto dinámico
const app = express();
const port = process.env.PORT || 3000;

// Usos
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Conexión a la DBjawsdb with Heroku
let connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

/* Verifica si está loegado el usuario */
IsLoggedIn = async (req, res, next) => {
  //console.log(req.cookies);

  if (req.cookies.jwt) {
    try {
      // Verifica el token, para ver que usuario es
      const decoded = await promisify(jwt.verify)(  
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // Checa si el usuario existe
      connection.query(
        'select * from usuarios where id_usuario = ?',
        [decoded.id],
        (error, results) => {
          //console.log(results);
          if (!results) {
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (err) { 
      console.log(err);
      return next();
    }
  } else {
    next();
  }
};


/* define el rendering de varaibles dependiendo de los parámetros en valores */
const mainRendering = valores => {

  let objRender = {}; 
  objRender.tabledata = valores[0] === 0 ? [] : valores[0];
  objRender.tabledata2 = valores[1] === 0 ? [] : valores[1];
  objRender.tabledata3 = valores[2] === 0 ? [] : valores[2];
  objRender.tabledata4 = valores[3] === 0 ? [] : valores[3];
  objRender.vistaUsuarios = valores[4] === 0 ? 'd-none' : '';
  objRender.vistaMateriales = valores[5] === 0 ? 'd-none' : '';
  objRender.vistaCompras = valores[6] === 0 ? 'd-none' : '';
  objRender.vistaProfile = valores[7] === 0 ? 'd-none' : '';
  objRender.vistaInicio = valores[8] === 0 ? 'd-none' : '';
  objRender.vistaListaPedidos = valores[9] === 0 ? 'd-none' : '';
  objRender.vistaAlmacen = valores[10] === 0 ? 'd-none' : '';
  objRender.vistaFacturacion = valores[11] === 0 ? 'd-none' : '';
  objRender.usuario = valores[12] ;
  objRender.tabledata5 = valores[13] === 0 ? [] : valores[13];
  return objRender;
} 


// Pantalla de inicio
app.get('/main', IsLoggedIn, (req, res) => {

  if (req.user) {
    const renderDef = mainRendering([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, req.user, 0]);
    res.render('inicio', renderDef);
  } else {
    res.redirect('/');
  }
});


/* ----------------- */
/* VISTA FACTURACION */
/* ----------------- */

/* Vista Almacén */
app.get('/facturacion', IsLoggedIn, (req, res) => {
  const sql =   'select '
              +   'a.id_recepcion, '
              +   'a.id_pedido, '
              +   'a.recepcion_created_at, '
              +   'a.tx_vehiculo, '
              +   'a.nb_chofer, '
              +   'a.nu_pzs_recibidas '
              + 'from almacen a '
              + 'left join facturacion b '
              + 'on a.id_recepcion = b.id_recepcion '
              + 'where b.id_recepcion is null' ;

  if (req.user) {
    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const datos = JSON.parse(JSON.stringify(results));
        const renderDef = mainRendering([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, req.user, datos]);
        res.render('inicio', renderDef);
      }
    });
  } else {
    res.redirect('/');
  }
});


/* ------------------------- */
/* TERMINA VISTA FACTURACION */
/* ------------------------- */



// Vista administración de usuarios
// REVISAR EL SQL
app.get('/usuarios', IsLoggedIn, (req, res) => {
  if (req.user) {
    
    const sql = 'select id_usuario, nb_usuario, cd_usuario, nb_area, tp_usuario from usuarios';
    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const datos = JSON.parse(JSON.stringify(results));
        const renderDef = mainRendering([datos, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, req.user, 0]);
        res.render('inicio', renderDef);
      }
    });
  } else {
    res.redirect('/');
  }
});



/* profile */
app.get('/profile', IsLoggedIn, (req, res) => {
  if (req.user) {
    const renderDef = mainRendering([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, req.user, 0]);
    res.render('inicio', renderDef);
  } else {
    // lo manda al login
    res.redirect('/');
  }
});



/* Vista catalogo de materiales */
app.get('/materiales', IsLoggedIn, (req, res) => {
  const sql = 'select * from materiales';
  if (req.user) {
    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const datos = JSON.parse(JSON.stringify(results));
        const renderDef = mainRendering([0, datos, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, req.user, 0]);
        res.render('inicio', renderDef); 
      }
    });
  } else {
    res.redirect('/');
  }
});



/* Vista compras. El usuario de Compras puede hacer pedidos en esta vista */
app.get('/compras', IsLoggedIn, (req, res) => {
  if (req.user) { 
    const renderDef = mainRendering([0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, req.user, 0]);
    res.render('inicio', renderDef);
  } else {
    res.redirect('/');
  }
});


/* Vista lista de pedidos */
app.get('/listapedidos', IsLoggedIn, (req, res) => {
  const sql = "select * from pedidos where nb_estatus = 'Pendiente' ";
  if (req.user) {
    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const datos = JSON.parse(JSON.stringify(results));
        const renderDef = mainRendering([0, 0, datos, 0, 0, 0, 0, 0, 0, 1, 0, 0, req.user, 0]);
        res.render('inicio', renderDef);
      }
    });
  } else {
    res.redirect('/');
  }
});



/* Vista lista de pedidos filtrada */
app.post('/listapedidosfiltrada', (req, res) => {
  const estatus = req.body.nb_estatus;
  const sql = 'select * from pedidos where nb_estatus = ?';

  connection.query(sql, [estatus], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const datos = JSON.parse(JSON.stringify(results));
      res.send(datos);
    }
  });
});



/* Vista lista de los productos pedidos filtrada (cuando da clic en un elemento, de los pedidos, 
    se lanza este subquery y manda los productos asociados a dicho pedido) */
app.post('/listapedidosfiltradaproductos', (req, res) => {
  const id_pedido = req.body.id_pedido;
  const sql = 'select * from prodpedidos where id_pedido = ?';

  connection.query(sql, [id_pedido], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const datos = JSON.parse(JSON.stringify(results));
      res.send(datos);
    }
  });
});


/* boton de autorizar/Cancelar un pedido */
app.post('/actualizapedido', (req, res) => {
  const { nb_estatus, id_pedido, id_usr_cambia_estatus, tx_comentarios_estatus } = req.body;
  const sql = 'update pedidos set nb_estatus = ?, id_usr_cambia_estatus = ?, tx_comentarios_estatus = ? where id_pedido = ?';

  connection.query(
    sql,
    [nb_estatus, id_usr_cambia_estatus, tx_comentarios_estatus, id_pedido],
    (err, results) => {
      err ? console.log(err) : res.end(nb_estatus);
    }
  );
});


/* Vista Almacén */
app.get('/almacen', IsLoggedIn, (req, res) => {
  const sql =
    'select a.nu_orden_compra, ' +
    'b.id_prodpedido, ' +
    'a.id_pedido, ' +
    'a.nb_proveedor, ' +
    'a.nb_estatus, ' +
    'b.id_producto, ' +
    'b.nb_producto, ' +
    'b.nu_cantidad, ' +
    'b.cd_articulo, ' +
    'b.nb_prodpedido_estatus ' +
    'from pedidos as a ' +
    'inner join  prodpedidos as b ' +
    'on a.id_pedido = b.id_pedido ' +
    "where a.nb_estatus = 'Autorizado' " +
    "and b.nb_prodpedido_estatus = 'Pendiente' ";

  if (req.user) {
    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const datos = JSON.parse(JSON.stringify(results));
        const renderDef = mainRendering([0, 0, 0, datos, 0, 0, 0, 0, 0, 0, 1, 0, req.user, 0]);
        res.render('inicio', renderDef);
      }
    });
  } else {
    res.redirect('/');
  }
});



/* Viene de la vista de almacen cuando registran una recepción.
   El req.body trae los valores  */
app.post('/registraRecepcion', (req, res) => {
  const valores = req.body;
  delete valores.id_prodpedido;
  const sql = 'insert into almacen set ?';

  connection.query(sql, [valores], (err, results) => {
    /* retorna el nuevo id  */ //console.log(results.insertId);
    const nuevoId = results.insertId;
    err ? res.end('0') : res.end(String(nuevoId));
  });
});



/* Posterior al insert nuevo en tbl almacen, edita el estatus en tbl prodpedidos
   a 'Recibido' */
app.post('/editaProdPedido', (req, res) => {
  const id_prodpedido = req.body.id_prodpedido;
  const sql = "update prodpedidos set nb_prodpedido_estatus = 'Recibido' where id_prodpedido = ? ";

  connection.query(sql, [id_prodpedido], (err, results) => {
    err ? res.end('0') : res.end('ok');
  });
});



/* Posterior a la edición en prodpedidos, hace un 'requery' */
app.get('/prodPedidosRequery', (req, res) => {
  const sql =
    'select a.nu_orden_compra, ' +
    'b.id_prodpedido, ' +
    'a.id_pedido, ' +
    'a.nb_proveedor, ' +
    'a.nb_estatus, ' +
    'b.id_producto, ' +
    'b.nb_producto, ' +
    'b.nu_cantidad, ' +
    'b.cd_articulo, ' +
    'b.nb_prodpedido_estatus ' +
    'from pedidos as a ' +
    'inner join  prodpedidos as b ' +
    'on a.id_pedido = b.id_pedido ' +
    "where a.nb_estatus = 'Autorizado' " +
    "and b.nb_prodpedido_estatus = 'Pendiente' ";

  connection.query(sql, (err, results) => {
    err ? res.send(err) : res.send(JSON.parse(JSON.stringify(results)));
  });
});



/* cuando abre el modal de prod pedidos le envía la lista de productos unicos */
app.get('/compras/listaprod', (req, res) => {
  const sql = 'select distinct id_producto, nb_producto from productos';
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const datos = JSON.parse(JSON.stringify(results));
      res.send(datos);
    }
  });
});


// TABLA PEDIDOS
/* Agrega un nuevo registro a la tabla pedidos */
app.post('/pedidos/guardar', (req, res) => { 
  const valores = req.body;
  const sql = 'insert into pedidos set ?';
  connection.query(sql, [valores], (err, results) => {
    /* retorna el nuevo id  */ //console.log(results.insertId);
    const nuevoId = results.insertId;
    err ? res.end(err) : res.end(String(nuevoId));
  });
});


// TABLA PRODPEDIDOS
/* Recibe los rows, y recorre para armar el sql insert */
app.post('/pedidos/prodpedidos/', (req, res) => {
  const prodPedidos = req.body;

  /* estructura del body:
       {
        '0': {object},
        '1': {object},
        ...
        'n': {object},
        totalRows: 'n'
       } 
       y cada objeto {nb_producto: 'a', nu_cantidad: 'b', ....}
   */

  const reg = parseInt(prodPedidos.totalRows);
  let regArray = [];

  /* arma el array de arrays.  */
  for (let i = 0; i < reg; i++) {
    regArray.push([
      prodPedidos[i].nb_producto,
      prodPedidos[i].nu_cantidad,
      prodPedidos[i].im_unidad,
      prodPedidos[i].cd_moneda,
      prodPedidos[i].im_tipo_de_cambio,
      prodPedidos[i].im_pedido,
      prodPedidos[i].cd_articulo,
      prodPedidos[i].fh_entrega,
      prodPedidos[i].id_producto,
      prodPedidos[i].id_pedido,
      'Pendiente',
    ]);
  }

  //console.log(regArray);
  const cols =
    '(nb_producto,nu_cantidad,im_unidad,cd_moneda,im_tipo_de_cambio,im_pedido,cd_articulo,fh_entrega,id_producto,id_pedido,nb_prodpedido_estatus)';
  const sql = 'insert into prodpedidos ' + cols + ' values ?';

  connection.query(sql, [regArray], (err, results) => {
    err ? res.end(err) : res.end('ok');
  });
});

// TABLA USUARIOS

/* Elimina de la tabla usuarios el id seleccionado */
app.post('/usuarios/eliminar/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'delete from usuarios where id_usuario = ?';
  connection.query(sql, [id], (err, results) => {
    err ? res.end(err) : res.end('eliminado');
  });
});

/* Edita de la tabla usuarios el id seleccionado */
app.post('/usuarios/editar/:id', (req, res) => {
  const valores = req.body;
  const id = req.params.id;
  const sql = 'update usuarios set ? where id_usuario = ?';
  connection.query(sql, [valores, id], (err, results) => {
    err ? res.end(err) : res.end('editado');
  });
});

/* Agrega un nuevo registro a la tabla usuarios */
app.post('/usuarios/guardar', (req, res) => {
  const valores = req.body;
  const sql = 'insert into usuarios set ?';
  //console.log(valores);
  connection.query(sql, [valores], (err, results) => {
    err ? res.end(err) : res.end('Registro correcto');
  });
});



// TABLA MATERIALES

/* Elimina de la tabla materiales el id seleccionado */
app.post('/materiales/eliminar/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'delete from materiales where material_id = ?';
  connection.query(sql, [id], (err, results) => {
    err ? res.end(err) : res.end('eliminado');
  });
});

/* Agrega un nuevo registro a la tabla materiales */
app.post('/materiales/guardar', (req, res) => {
  const valores = req.body;
  const sql = 'insert into materiales set ?';
  connection.query(sql, [valores], (err, results) => {
    err ? res.end(err) : res.end('Registro correcto');
  });
});

/* Edita de la tabla materiales el id seleccionado */
app.post('/materiales/editar/:id', (req, res) => {
  const valores = req.body;
  const id = req.params.id;
  const sql = 'update materiales set ? where material_id = ?';
  connection.query(sql, [valores, id], (err, results) => {
    err ? res.end(err) : res.end('editado');
  });
});

// Root inicial
app.get('/', IsLoggedIn, (req, res) => {
  if (req.user) {
    res.redirect('/main');
  } else {
    res.render('login', {
      mensaje: '',
      valor: 1,
    });
  }
});

// Para registrase, envía el formulario al usuario
app.get('/register', IsLoggedIn, (req, res) => {
  if (req.user) {
    res.redirect('/main');
  } else {
    res.render('register', {
      mensaje: '',
      valor: 1,
    });
  }
});

// logout
app.get('/logout', (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });

  res.status(200).redirect('/');
});

// POST - Registro de usuario
/* app.post("/register", async (req, res) => {
    const valores = req.body;
    let passwordHash = await bcryptjs.hash(valores.cd_contrasena, 10);
    valores.cd_contrasena = passwordHash;

    const sql = "insert into usuarios set ?";
    connection.query(sql, [valores],  (err, results) => {
        if (err) { 
            console.log(err); 
        } 
        // si llega aqui es que se registró correctamente
        res.redirect("/main");
    });
    
}); */

// POST - Registro de usuario  V2
app.post('/register', async (req, res) => {
  //const {nb_usuario, nb_area, cd_usuario, cd_email, cd_contrasena, cd_contrasena_confirm, tp_suuario} = req.body;
  const valores = req.body;
  const sql_mail = 'select cd_email from usuarios where cd_email = ?';

  connection.query(sql_mail, [valores.cd_email], async (err, results) => {
    if (err) {
      console.log(err);
    }

    if (results.length > 0) {
      return res.render('register', {
        mensaje: 'Correo ya registrado',
        valor: 0,
      });
    } else if (valores.cd_contrasena !== valores.cd_contrasena_confirm) {
      return res.render('register', {
        mensaje: 'Contraseña no coincide',
        valor: 0,
      });
    }

    // si llega aqui es que es nuevo mail y la contraseña está ok
    delete valores.cd_contrasena_confirm;
    let passwordHash = await bcryptjs.hash(valores.cd_contrasena, 10);
    const sql_inserta = 'insert into usuarios set ?';
    valores.cd_contrasena = passwordHash;

    connection.query(sql_inserta, [valores], (err2, results2) => {
      if (err2) { 
        console.log(err2);
      }
      // si llega aqui es que se registró correctamente
      res.redirect('/main');
    });
  });
});

/* POST login */
app.post('/login', async (req, res) => {
  try {
    const usuario = req.body.cd_usuario;
    const pass = req.body.cd_contrasena;
    const sql = 'select * from usuarios where cd_usuario = ?';

    connection.query(sql, [usuario], async (err, results) => {
      if (err) {
        console.log(err);
      }

      if (results.length > 0) {
        let qry_pass = results[0].cd_contrasena;
        if (!results || !(await bcryptjs.compare(pass, qry_pass))) {
          res.status(401).render('login', {
            valor: 0,
            mensaje: 'Usuario o password incorrecto',
          });
        } else {
          const id = results[0].id_usuario;
          const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          //console.log(token);
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXPIRES * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          //console.log(cookieOptions);
          res.cookie('jwt', token, cookieOptions);
          req.user = results[0];
          const renderDef = mainRendering([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, req.user, 0]);
          res.render('inicio', renderDef);
        }
      } else {
        res.status(401).render('login', {
          valor: 0,
          mensaje: 'Usuario o password incorrecto',
        });
      }
    });
  } catch (er) {
    console.log(er);
  }
});

// PORT dinámico
app.listen(port, () => { 
  console.log('Server running on port ' + port);
});




// source: https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
