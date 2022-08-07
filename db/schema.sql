/* crea la base */
create database grupogamex;

/* habilita el usuario 'root' */
alter user 'root'@'localhost' identified with mysql_native_password by '';
flush privileges;

/* crea la primera tabla de usuarios */
create table ( 
    usuario_id int not null auto_increment,
    nombre varchar(150) not null,
    apellido varchar(150) not null,
    area varchar(50) not null,
    usuario varchar(50) not null,
    contrasena varchar(50) not null,
    tipo_usuario varchar(50),
    primary key (usuario_id)
);

/* crea una tabla con los tipos de usuario */
create table ( 
    tipo_usuario_id int not null AUTO_INCREMENT,
    tipo_usuario varchar(50),
    puesto varchar(150),
    primary key (tipo_usuario_id)
);

