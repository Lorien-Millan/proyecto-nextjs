create database proyecto_tienda_online;

create table proyecto_tienda_online.Usuarios
(
	id int,
    nombre varchar(30),
    email varchar(30),
    contraseña varchar(30),
    rol  varchar(30),
    fecha_registro date,
    PRIMARY KEY (id)
);
insert into proyecto_tienda_online.Usuarios (id, nombre, email, contraseña, rol, fecha_registro) values(1,3425,456,1),(2,9745,2712,1);

create table proyecto_tienda_online.Pedidos
(
	id_pedido int,
    total_pagar varchar(30),
    estado varchar(30),
    fecha date,
    id_usuario int,
    PRIMARY KEY (id_pedido),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (id)
);

create table proyecto_tienda_online.Categorias
(
	id_categoria int,
    nombre varchar(30),
    descripcion varchar(500),
    PRIMARY KEY (id_categoria)
);

create table proyecto_tienda_online.Detalles_pedido
(
	id_detalle_pedido int,
    id_pedido int,
    precio_compra double,
    id_producto int,
    PRIMARY KEY (id_detalle_pedido, id_pedido),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos (id_pedido),
    FOREIGN KEY (id_producto) REFERENCES Productos (id_producto)
);

create table proyecto_tienda_online.Productos
(
	id_producto int,
    titulo varchar(30),
    descripcion varchar(500),
    precio double,
    stock int,
    plataforma varchar(30),
    desarrollador varchar(30),
    calificacion_PEGI int,
    URÑ_imagen varchar(500),
    fecha_lanzamiento date,
    id_usuario int,
    PRIMARY KEY (id_producto)
);