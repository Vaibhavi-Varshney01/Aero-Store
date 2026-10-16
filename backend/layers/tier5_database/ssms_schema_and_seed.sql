-- ============================================================================
-- AeroStore E-Commerce Database Schema & Data Seeding Script for SSMS
-- Target Engine: Microsoft SQL Server (2016 / 2019 / 2022 / Azure SQL / LocalDB)
-- Usage in SSMS: Open this file in SSMS, select your server instance, and click "Execute" (F5).
-- ============================================================================

-- 1. Create Database if it does not exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'AeroStoreDB')
BEGIN
    CREATE DATABASE AeroStoreDB;
    PRINT 'Database [AeroStoreDB] created successfully.';
END
GO

USE AeroStoreDB;
GO

-- 2. Create [users] Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[users] (
        [id] NVARCHAR(50) NOT NULL PRIMARY KEY,
        [name] NVARCHAR(100) NOT NULL,
        [email] NVARCHAR(255) NOT NULL UNIQUE,
        [password_hash] NVARCHAR(255) NOT NULL,
        [salt] NVARCHAR(255) NOT NULL,
        [role] NVARCHAR(50) NOT NULL DEFAULT 'customer',
        [is_vip] BIT NOT NULL DEFAULT 0,
        [created_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [last_login] DATETIME2 NULL
    );
    CREATE NONCLUSTERED INDEX [idx_users_email] ON [dbo].[users]([email]);
    PRINT 'Table [users] created successfully.';
END
GO

-- 3. Create [sessions] Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sessions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[sessions] (
        [token] VARCHAR(800) NOT NULL PRIMARY KEY,
        [user_id] NVARCHAR(50) NOT NULL,
        [created_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [expires_at] DATETIME2 NULL,
        CONSTRAINT [FK_sessions_users] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE
    );
    CREATE NONCLUSTERED INDEX [idx_sessions_user_id] ON [dbo].[sessions]([user_id]);
    PRINT 'Table [sessions] created successfully.';
END
GO

-- 4. Create [products] Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[products] (
        [id] NVARCHAR(50) NOT NULL PRIMARY KEY,
        [name] NVARCHAR(255) NOT NULL,
        [description] NVARCHAR(MAX) NULL,
        [price] DECIMAL(18, 2) NOT NULL,
        [stock] INT NOT NULL DEFAULT 0,
        [category] NVARCHAR(100) NOT NULL,
        [rating] FLOAT NOT NULL DEFAULT 0.0,
        [image_url] NVARCHAR(500) NULL,
        [created_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
    CREATE NONCLUSTERED INDEX [idx_products_category] ON [dbo].[products]([category]);
    PRINT 'Table [products] created successfully.';
END
GO

-- 5. Create [orders] Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[orders]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[orders] (
        [id] NVARCHAR(50) NOT NULL PRIMARY KEY,
        [user_id] NVARCHAR(50) NULL,
        [total_amount] DECIMAL(18, 2) NOT NULL,
        [status] NVARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
        [shipping_address] NVARCHAR(MAX) NULL,
        [created_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_orders_users] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL
    );
    PRINT 'Table [orders] created successfully.';
END
GO

-- 6. Create [order_items] Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[order_items]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[order_items] (
        [id] INT IDENTITY(1,1) PRIMARY KEY,
        [order_id] NVARCHAR(50) NOT NULL,
        [product_id] NVARCHAR(50) NOT NULL,
        [quantity] INT NOT NULL,
        [unit_price] DECIMAL(18, 2) NOT NULL,
        CONSTRAINT [FK_order_items_orders] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([id]) ON DELETE CASCADE,
        CONSTRAINT [FK_order_items_products] FOREIGN KEY ([product_id]) REFERENCES [dbo].[products]([id])
    );
    PRINT 'Table [order_items] created successfully.';
END
GO

-- 7. Create [coupons] Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[coupons]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[coupons] (
        [code] NVARCHAR(50) NOT NULL PRIMARY KEY,
        [discount_percent] INT NOT NULL,
        [min_order_amount] DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        [is_active] BIT NOT NULL DEFAULT 1
    );
    PRINT 'Table [coupons] created successfully.';
END
GO

-- ============================================================================
-- SEED INITIAL DATA
-- ============================================================================

-- Seed Demo Accounts for 3 Roles: Customer, Admin, Delivery Partner
IF NOT EXISTS (SELECT 1 FROM [dbo].[users] WHERE [email] = 'jane.doe@example.com')
BEGIN
    INSERT INTO [dbo].[users] ([id], [name], [email], [password_hash], [salt], [role], [is_vip], [created_at])
    VALUES ('USER-1001', 'Jane Doe', 'jane.doe@example.com', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', 'a1b2c3d4e5f607182930415263748596', 'customer', 1, SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[users] WHERE [email] = 'admin@example.com')
BEGIN
    INSERT INTO [dbo].[users] ([id], [name], [email], [password_hash], [salt], [role], [is_vip], [created_at])
    VALUES ('USER-1002', 'System Admin', 'admin@example.com', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', 'a1b2c3d4e5f607182930415263748596', 'admin', 1, SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[users] WHERE [email] = 'delivery@example.com')
BEGIN
    INSERT INTO [dbo].[users] ([id], [name], [email], [password_hash], [salt], [role], [is_vip], [created_at])
    VALUES ('USER-1003', 'Delivery Partner John', 'delivery@example.com', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', 'a1b2c3d4e5f607182930415263748596', 'delivery_partner', 0, SYSUTCDATETIME());
END
PRINT 'Demo accounts for Customer, Admin, and Delivery Partner seeded successfully.';
GO


-- Seed Product Catalog
IF NOT EXISTS (SELECT 1 FROM [dbo].[products] WHERE [id] = 'PROD-101')
BEGIN
    INSERT INTO [dbo].[products] ([id], [name], [description], [price], [stock], [category], [rating], [image_url])
    VALUES
    ('PROD-101', 'HyperSound ANC Wireless Headphones', 'Studio-grade active noise cancellation with 40-hour battery life and spatial audio.', 199.99, 15, 'Electronics', 4.9, '/static/assets/headphones.svg'),
    ('PROD-102', 'ErgoFlow RGB Mechanical Keyboard', 'Hot-swappable linear mechanical switches with customizable per-key RGB backlighting.', 129.50, 8, 'Accessories', 4.7, '/static/assets/keyboard.svg'),
    ('PROD-103', 'UltraVision 34-Inch Curved 4K OLED Monitor', 'Ultra-wide 175Hz curved display with 99% DCI-P3 color gamut and HDR1000.', 599.00, 5, 'Electronics', 4.8, '/static/assets/monitor.svg'),
    ('PROD-104', 'Titanium Smartwatch Series X', 'Aerospace titanium casing with heart rate tracking, GPS, and multi-day battery.', 249.99, 20, 'Wearables', 4.6, '/static/assets/watch.svg'),
    ('PROD-105', 'FlashSale Cyberpunk Edition Hoodie', 'Limited edition heavyweight cotton hoodie. Flash-sale inventory strictly limited.', 65.00, 1, 'Apparel', 4.9, '/static/assets/hoodie.svg'),
    ('PROD-106', 'AeroGrip Precision Wireless Mouse', 'Ergonomic ultralight 58g chassis with 26,000 DPI optical sensor and PTFE feet.', 49.99, 30, 'Accessories', 4.8, '/static/assets/mouse.svg');
    PRINT 'Product catalog seeded successfully.';
END
GO

-- Seed Demo Coupons
IF NOT EXISTS (SELECT 1 FROM [dbo].[coupons] WHERE [code] = 'SAVE10')
BEGIN
    INSERT INTO [dbo].[coupons] ([code], [discount_percent], [min_order_amount], [is_active])
    VALUES
    ('SAVE10', 10, 50.00, 1),
    ('VIP20', 20, 100.00, 1),
    ('WELCOME5', 5, 0.00, 1);
    PRINT 'Demo coupons seeded successfully.';
END
GO

PRINT '====================================================================';
PRINT ' AeroStore Database Setup Complete! Ready for backend connection.';
PRINT '====================================================================';
GO
