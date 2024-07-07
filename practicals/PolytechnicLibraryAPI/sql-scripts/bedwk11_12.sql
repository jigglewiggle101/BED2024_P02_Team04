USE master;
GO

-- Create a new login
CREATE LOGIN poly123
WITH PASSWORD = 'GPA4PLS';
GO

-- Drop existing database connections
IF DB_ID('polyLibApi') IS NOT NULL
BEGIN
    ALTER DATABASE polyLibApi SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE polyLibApi;
END
GO

-- Create a new database
CREATE DATABASE polyLibApi;
GO

USE polyLibApi;
GO

-- Create a new database user for the login
CREATE USER polyapi
FOR LOGIN poly123;
GO

-- Grant permissions to the user
ALTER ROLE db_owner ADD MEMBER polyapi;
GO

-- Create Users table
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('member', 'librarian')) NOT NULL
);
GO

-- Create Books table
CREATE TABLE Books (
    book_id INT PRIMARY KEY IDENTITY(1,1),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    availability CHAR(1) CHECK (availability IN ('Y', 'N')) NOT NULL
);
GO