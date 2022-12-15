/* crea la base */
create database grupogamex;

use grupogamex;

/* habilita el usuario 'root' */
alter user 'root'@'localhost' identified with mysql_native_password by '';
flush privileges; 

/* crea la primera tabla de usuarios */
drop table usuarios;

create table usuarios (
	id_usuario int primary key not null auto_increment,
    usuario_created_at timestamp default current_timestamp, 
    usuario_updated_at timestamp on update current_timestamp, 
	nb_usuario varchar(100),
    nb_area varchar(60),
    cd_usuario varchar(50), 
    cd_contrasena varchar(60),
    tp_usuario varchar(15)
);

/* crea una tabla con los tipos de usuario */
create table tipo_usuarios ( 
    tipo_usuario_id int primary key not null  AUTO_INCREMENT,
    tipo_usuario varchar(50),
    puesto varchar(150)
);


/* crea tabla de materiales */
create table materiales ( 
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
create table pedidos ( 
    id_pedido int primary key not null auto_increment,
    pedidos_created_at timestamp default current_timestamp,
    pedidos_updated_at timestamp on update current_timestamp,
    id_usuario int,
	foreign key (id_usuario) references (usuarios),
    nu_compra int,
    nb_proveedor varchar(150) not null,
    fh_pedido date,
    tx_terminos varchar(150),
    tx_entregar_en varchar(50),
    nu_horario varchar(10),
    nb_contacto varchar(100),
    nb_estatus varchar(15),
    tx_especificaciones varchar(200)
);


/* crea la tabla prodpedidos */
create table prodpedidos ( 
    id_pedido int,
    id_producto int,
    ppedidos_created_at timestamp default current_timestamp,
    ppedidos_updated_at timestamp on update current_timestamp,
    nb_producto varchar(150),
    nu_cantidad int,
    cd_articulo varchar(50),
    tx_especificaciones varchar(250),
    im_unidad float,
    im_pedido float,
    fh_entrega date,
    cd_moneda varchar(3),
    im_tipo_de_cambio float
);


/* crea la tabla recepción */
create table recepcion ( 
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


alter table usuarios modify contrasena varchar(60);

