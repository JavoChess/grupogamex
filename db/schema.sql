/* crea la base */
create database grupogamex;

/* habilita el usuario 'root' */
alter user 'root'@'localhost' identified with mysql_native_password by '';
flush privileges;

/* crea la primera tabla de usuarios */
create table grupogamex.usuarios ( 
    usuario_id int primary key not null auto_increment,
    nombre varchar(150) not null,
    apellido varchar(150) not null,
    area varchar(50) not null,
    usuario varchar(50) not null,
    contrasena varchar(50) not null,
    tipo_usuario varchar(50) not null
    
);

/* crea una tabla con los tipos de usuario */
create table grupogamex.tipo_usuarios ( 
    tipo_usuario_id int primary key not null  AUTO_INCREMENT,
    tipo_usuario varchar(50),
    puesto varchar(150)
);


/* crea tabla de materiales */
create table grupogamex.materiales ( 
    material_id int primary key not null auto_increment,
    nombre varchar(150) not null,
    codigo varchar(10) not null,
    tipo_producto varchar(20) not null,
    marca varchar(20) not null,
    cliente varchar(15) not null,
    proveedor varchar(50) not null,
    almacen varchar(1) not null,
    clasif_almacen varchar(1) not null,
    estatus varchar(10) not null
    
);


/* crea la tabla pedidos */
create table grupogamex.pedidos ( 
    id_pedido int primary key not null auto_increment,
    id_producto int,
    nu_compra int,
    nb_proveedor varchar(150) not null,
    nb_usuario varchar(50) not null,
    fh_pedido date,
    tx_terminos varchar(150),
    tx_entregar_en varchar(50),
    nu_horario varchar(10),
    nb_contacto varchar(100),
    nb_estatus varchar(15),
    tx_comentario varchar(200)
);


/* crea la tabla prodpedidos */
create table grupogamex.prodpedidos ( 
    id_pedido int,
    id_producto int,
    nb_producto varchar(150),
    nu_cantidad float,
    cd_articulo varchar(50),
    tx_especificaciones varchar(150),
    im_unidad float,
    im_pedido float,
    fh_entrega date,
    cd_moneda varchar(5),
    im_tipo_de_cambio float
);


/* crea la tabla recepción */
create table grupogamex.recepcion ( 
    id_recepcion int primary key not null auto_increment,
    id_pedido int,
    fh_recepcion date,
    nb_proveedor varchar(150),
    tx_vehiculo varchar(50),
    nb_chofer varchar(100),
    nu_remision varchar(50),
    tx_descripcion_pzs varchar(200),
    nu_pzs_recibidas int,
    fh_entrega date,
    nb_recibio varchar(150),
    nb_autorizo varchar(150)

);
