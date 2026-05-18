-- Script final de base de datos para Arte y Diseño
-- Se utiliza INT IDENTITY para mayor simplicidad en el manejo de IDs

CREATE TABLE [dbo].[Usuarios] (
    [Id]             INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]         VARCHAR (100) NOT NULL,
    [Email]          VARCHAR (100) NOT NULL,
    [Password]       VARCHAR (255) NOT NULL,
    [Fecha_Registro] DATETIME      DEFAULT (GETDATE()) NOT NULL,
    [Rol]            VARCHAR (20)  DEFAULT ('cliente') NOT NULL,
    CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_Usuarios_Email] UNIQUE ([Email] ASC)
);

-- Crear tabla de Productos
CREATE TABLE [dbo].[Productos] (
    [Id]              INT             IDENTITY (1, 1) NOT NULL,
    [Nombre]          VARCHAR (150)   NOT NULL,
    [Descripcion]     TEXT            NULL,
    [Precio]          DECIMAL (10, 2) NOT NULL,
    [Precio_Original] DECIMAL (10, 2) NULL,
    [Rating]          DECIMAL (3, 1)  DEFAULT (0.0) NULL,
    [Imagen_Url]      VARCHAR (255)   NULL,
    [Stock]           INT             DEFAULT (0) NULL,
    CONSTRAINT [PK_Productos] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Crear tabla de Carrito
CREATE TABLE [dbo].[Carrito] (
    [Id]          INT IDENTITY (1, 1) NOT NULL,
    [Usuario_Id]  INT NOT NULL,
    [Producto_Id] INT NOT NULL,
    [Cantidad]    INT DEFAULT (1) NOT NULL,
    CONSTRAINT [PK_Carrito] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Carrito_Usuarios] FOREIGN KEY ([Usuario_Id]) REFERENCES [dbo].[Usuarios] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Carrito_Productos] FOREIGN KEY ([Producto_Id]) REFERENCES [dbo].[Productos] ([Id]) ON DELETE CASCADE
);

-- Crear tabla de Favoritos
CREATE TABLE [dbo].[Favoritos] (
    [Usuario_Id]  INT NOT NULL,
    [Producto_Id] INT NOT NULL,
    CONSTRAINT [PK_Favoritos] PRIMARY KEY CLUSTERED ([Usuario_Id] ASC, [Producto_Id] ASC),
    CONSTRAINT [FK_Favoritos_Usuarios] FOREIGN KEY ([Usuario_Id]) REFERENCES [dbo].[Usuarios] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Favoritos_Productos] FOREIGN KEY ([Producto_Id]) REFERENCES [dbo].[Productos] ([Id]) ON DELETE CASCADE
);

-- Crear tabla de Reseñas
CREATE TABLE [dbo].[Reseñas] (
    [Id]          INT IDENTITY (1, 1) NOT NULL,
    [Producto_Id] INT NOT NULL,
    [Usuario_Id]  INT NOT NULL,
    [Calificacion] INT NOT NULL CHECK ([Calificacion] >= 1 AND [Calificacion] <= 5),
    [Comentario]   TEXT NULL,
    [Fecha]       DATETIME DEFAULT (GETDATE()) NOT NULL,
    CONSTRAINT [PK_Reseñas] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Reseñas_Productos] FOREIGN KEY ([Producto_Id]) REFERENCES [dbo].[Productos] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reseñas_Usuarios] FOREIGN KEY ([Usuario_Id]) REFERENCES [dbo].[Usuarios] ([Id]) ON DELETE CASCADE
);