-- Write your own SQL object definition here, and it'll be included in your package.
USE [Arte_Diseño];
GO

-- 1. Tabla de Usuarios (Para authController.js)
CREATE TABLE [dbo].[Usuarios] (
    [Id]       INT IDENTITY (1, 1) NOT NULL,
    [Nombre]   VARCHAR (255) NOT NULL,
    [Email]    VARCHAR (255) NOT NULL UNIQUE,
    [Password] VARCHAR (255) NOT NULL,
    CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- 2. Tabla de Productos (Para cartController.js y visualización)
CREATE TABLE [dbo].[Productos] (
    [Id]              INT IDENTITY (1, 1) NOT NULL,
    [Nombre]          VARCHAR (255)   NOT NULL,
    [Precio]          DECIMAL (10, 2) NOT NULL,
    [Precio_Original] DECIMAL (10, 2) NULL,
    [Rating]          DECIMAL (3, 1)  DEFAULT (0.0) NULL,
    [Imagen_Url]      VARCHAR (255)   NULL,
    [Descripcion]     TEXT            NULL,
    [Stock]           INT             DEFAULT (0) NOT NULL,
    [Artisan]         VARCHAR (255)   NULL,
    [Created_at]      DATETIME        DEFAULT (GETDATE()) NOT NULL,
    CONSTRAINT [PK_Productos] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- 3. Tabla de Carrito (Para cartController.js)
CREATE TABLE [dbo].[Carrito] (
    [Id]          INT IDENTITY (1, 1) NOT NULL,
    [Usuario_Id]  INT NOT NULL,
    [Producto_Id] INT NOT NULL,
    [Cantidad]    INT DEFAULT (1) NOT NULL,
    CONSTRAINT [PK_Carrito] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Carrito_Usuarios] FOREIGN KEY ([Usuario_Id]) REFERENCES [dbo].[Usuarios] ([Id]),
    CONSTRAINT [FK_Carrito_Productos] FOREIGN KEY ([Producto_Id]) REFERENCES [dbo].[Productos] ([Id])
);
