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
    cd_contrasena varchar(50),
    tp_usuario varchar(15)
);

alter table usuarios add cd_email varchar(60);
alter table usuarios modify contrasena varchar(60);


/* crea una tabla con los tipos de usuario */
create table tipo_usuarios ( 
    tipo_usuario_id int primary key not null  auto_increment,
    tipo_usuario varchar(50), 
    puesto varchar(150) 
);

/* crea tabla de productos */
drop table productos;

create table productos (
	id_producto int primary key not null auto_increment,
	nb_producto varchar(100),
	cd_producto varchar(10),
	tp_producto varchar(20),
	nb_marca varchar(50),
	nb_cliente varchar(50),
	nb_proveedor varchar(100),
	tp_almacen char(1),
	cd_almacen char(1),
	cd_estatus varchar(8)
);

select * from productos;





/* crea la tabla pedidos */
drop table pedidos;

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

alter table pedidos add id_usr_cambia_estatus int;
alter table pedidos add tx_comentarios_estatus varchar (200);



/* crea la tabla prodpedidos */
drop table prodpedidos;

create table prodpedidos ( 
	id_prodpedidos int primary key auto_increment,
    id_pedido int ,
	foreign key (id_pedido) references pedidos(id_pedido),
    id_producto int,
    foreign key (id_producto) references productos (id_producto),
    ppedidos_created_at timestamp default current_timestamp,
    ppedidos_updated_at timestamp on update current_timestamp,
    nb_producto varchar(150),
    nu_cantidad int,
    cd_articulo varchar(50),
    im_unidad float,
    im_pedido float,
    fh_entrega date,
    cd_moneda varchar(3),
    im_tipo_de_cambio float
);

alter table prodpedidos add nb_prodpedido_status varchar (15);
alter table prodpedidos rename column nb_prodpedido_status to nb_prodpedido_estatus;
alter table prodpedidos rename column id_prodpedidos to id_prodpedido;



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


/* crea la tabla recepción en almacén */ 
create table almacen ( 
    id_recepcion int primary key not null auto_increment,
    id_pedido int,
    id_usuario int,
	recepcion_created_at timestamp default current_timestamp, 
    recepcion_updated_at timestamp on update current_timestamp, 
    fh_recepcion date,
    tx_vehiculo varchar(50),
    nb_chofer varchar(100),
    cd_valida varchar(1),
    nu_pzs_recibidas int
);



/* Crea tabla facturacion */

drop table facturacion;

create table facturacion (
    id_factura int primary key not null auto_increment,
    id_pedido int,
    id_usuario int,
    id_recepcion int,
	factura_created_at timestamp default current_timestamp, 
    factura_updated_at timestamp on update current_timestamp, 
    cd_folio varchar(50),
    cd_razon_social varchar(200),
    fh_recepcion date
);




/* ejemplo random de registro */
insert into facturacion (id_factura, id_pedido, id_usuario, id_recepcion, cd_folio, cd_razon_social) values (1, 43, 1, 2, 'abc', 'codestar sa de cv');
select * from facturacion;


/* query para la vista de facturación 
(solo aquellos que no están en tbl factuacion)*/
select 
	a.id_recepcion,
	a.id_pedido, 
    a.recepcion_created_at,
    a.tx_vehiculo,
    a.nb_chofer,
    a.nu_pzs_recibidas
from almacen a
left join facturacion b
on a.id_recepcion = b.id_recepcion 
where b.id_recepcion is null
;



