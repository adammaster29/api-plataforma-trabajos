
CREATE DATABASE BUSQUEDA;

use BUSQUEDA



-- Tabla: Roles
CREATE TABLE roles (
    id_rol INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL
);


-- Tabla: Usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    id_rol INT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);



-- Tabla: Candidatos
CREATE TABLE candidatos (
    id_candidato INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT,
    experiencia VARCHAR(255),
    educacion VARCHAR(255),
    hoja_vida VARCHAR(255)
	FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);



-- Tabla: Empresas
CREATE TABLE empresas (
    id_empresa INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT,
    nombre_empresa VARCHAR(100),
	nit VARCHAR(100) NOT NULL,
    sector VARCHAR(100),
	 direccion VARCHAR(100),
    telefono VARCHAR(30),
	FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla: Ofertas
CREATE TABLE ofertas (
    id_oferta INT PRIMARY KEY IDENTITY(1,1),
    id_empresa INT ,
    titulo VARCHAR(100),
    descripcion VARCHAR(500),
    ubicacion VARCHAR(100),
    salario VARCHAR(50),
    fecha_publicacion DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa)
);

-- Tabla: Postulaciones
CREATE TABLE Postulaciones (
    id_postulacion INT PRIMARY KEY IDENTITY(1,1),
    id_candidato INT,
    id_oferta INT,
    fecha_postulacion DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (id_candidato) REFERENCES candidatos(id_candidato),
	FOREIGN KEY (id_oferta) REFERENCES ofertas(id_oferta)
);




select * from usuarios   
DELETE FROM usuarios;

DBCC CHECKIDENT ('empresas', RESEED, 0);

delete usuarios   where id_usuario = 1


ALTER TABLE candidatos
ALTER COLUMN educacion VARCHAR(255);
EXEC sp_help 'candidatos';       --tamaño de las columnas en la tabla SQL

delete candidatos
where id_candidato= 4

INSERT INTO usuarios(nombre,email,contraseña,id_rol,fecha_registro) VALUES('Adalberto',)
SELECT * FROM roles
SELECT * FROM candidatos
drop table postulaciones




--proxima agregar notificaciones

CREATE TABLE notificaciones (
  id_notificacione INT PRIMARY KEY IDENTITY,
  usuario_id INT,
  mensaje NVARCHAR(255),
  leído BIT DEFAULT 0,
  fecha DATETIME DEFAULT GETDATE()
);
