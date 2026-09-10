-- 1. Crear la base de datos solo si no existe para evitar el error 1007
CREATE DATABASE IF NOT EXISTS centaury_db;

-- 2. Seleccionar la base de datos para trabajar en ella
USE centaury_db;

-- 3. Crear la tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    nombres VARCHAR(150),
    celular VARCHAR(20)
);

-- 4. Crear la tabla de Solicitudes (Formulario Contáctenos)
CREATE TABLE IF NOT EXISTS solicitudes_contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    empresa VARCHAR(150),
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    servicio VARCHAR(100),
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insertar datos iniciales de prueba (Usa IGNORE para no duplicar ni generar error)
INSERT IGNORE INTO usuarios (email, pass, rol, nombres, celular) VALUES 
('admin@centaury.com', 'admin123', 'admin', 'Administrador General', '3000000000'),
('empleado@centaury.com', 'emp123', 'empleado', 'Empleado Campo', '3001111111'),
('asesor@asesorcentaury.com', 'asesor123', 'asesor', 'Asesor Soporte', '3002222222');