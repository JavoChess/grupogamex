/* crea la base */
create database grupogamex;

/* habilita el usuario 'root' */
alter user 'root'@'localhost' identified with mysql_native_password by '';
flush privileges;

/* crea la primera tabla de usuarios */
/* crea la primera tabla de usuarios */
create table usuarios ( 
    usuario_id int primary key not null auto_increment,
    nombre varchar(150) not null,
    apellido varchar(150) not null,
    area varchar(50) not null,
    usuario varchar(50) not null,
    contrasena varchar(50) not null,
    tipo_usuario varchar(50) not null
    
);

/* crea una tabla con los tipos de usuario */
create table tipo_usuarios ( 
    tipo_usuario_id int primary key not null  AUTO_INCREMENT,
    tipo_usuario varchar(50),
    puesto varchar(150)
);
