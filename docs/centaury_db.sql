-- ================================================
-- CENTAURY S.A.S — Base de Datos
-- MySQL 8.0 | Versión: 1.0
-- ================================================

CREATE DATABASE IF NOT EXISTS centaury_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE centaury_db;

-- ROLES
CREATE TABLE IF NOT EXISTS roles (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  nombre      VARCHAR(20) NOT NULL UNIQUE,   -- admin | empleado | cliente | publico
  descripcion VARCHAR(200)
);

-- USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  nombre         VARCHAR(100) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  rol_id         INT NOT NULL,
  activo         TINYINT(1) DEFAULT 1,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- PROYECTOS
CREATE TABLE IF NOT EXISTS proyectos (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  nombre         VARCHAR(150) NOT NULL,
  descripcion    TEXT,
  estado         ENUM('planificacion','ejecucion','finalizado','suspendido') DEFAULT 'planificacion',
  presupuesto    DECIMAL(18,2),
  avance_pct     TINYINT DEFAULT 0,
  fecha_inicio   DATE,
  fecha_fin      DATE,
  responsable_id INT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (responsable_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- PROYECTOS_USUARIOS (Empleados asignados a proyectos)
CREATE TABLE IF NOT EXISTS proyectos_usuarios (
  proyecto_id INT NOT NULL,
  usuario_id  INT NOT NULL,
  PRIMARY KEY (proyecto_id, usuario_id),
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE CASCADE
);

-- MENSAJES DE CONTACTO
CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  nombre     VARCHAR(100) NOT NULL,
  empresa    VARCHAR(100),
  email      VARCHAR(150) NOT NULL,
  telefono   VARCHAR(20),
  servicio   VARCHAR(100),
  mensaje    TEXT NOT NULL,
  leido      TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SERVICIOS CORPORATIVOS
CREATE TABLE IF NOT EXISTS servicios (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  nombre      VARCHAR(100) NOT NULL,
  descripcion TEXT,
  activo      TINYINT(1) DEFAULT 1
);

-- AVANCES DE OBRA
CREATE TABLE IF NOT EXISTS avances_obra (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  proyecto_id INT NOT NULL,
  usuario_id  INT NOT NULL,
  descripcion TEXT NOT NULL,
  porcentaje  TINYINT NOT NULL,
  fecha       DATE NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE CASCADE
);

-- ══════════════════════════════════════
-- DATOS INICIALES
-- ══════════════════════════════════════

INSERT INTO roles (nombre, descripcion) VALUES
  ('admin',    'Acceso total al sistema'),
  ('empleado', 'Gestión de proyectos asignados'),
  ('cliente',  'Consulta de sus proyectos'),
  ('publico',  'Solo acceso a la página pública');

-- Contraseñas hasheadas con bcrypt (10 rounds)
-- admin123 | empleado123 | cliente123
INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES
  ('Administrador Centaury', 'admin@centaury.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq', 1),
  ('Empleado Demo',          'empleado@centaury.com', '$2a$10$aLYELBPFXt5B8V3jJJnwruYkFv69xW2I6cHCJNsPTmSHZH19RQC3y', 2),
  ('Cliente Demo',           'cliente@centaury.com',  '$2a$10$TwQm8l1YRdG4VxCJjGNGVuAKOFPVZxHi9C5VGVbGzYmXB0X4LSi.i', 3);

INSERT INTO servicios (nombre, descripcion) VALUES
  ('Ejecución de Obras',     'Construcción y ejecución técnica con control de calidad'),
  ('Diseño y Planificación', 'Diseños estructurales con visión operativa'),
  ('Gerencia de Proyectos',  'Gestión integral de proyectos inmobiliarios'),
  ('Interventoría Técnica',  'Supervisión y control técnico independiente'),
  ('Presupuesto y Costos',   'APU y presupuestos con inteligencia financiera'),
  ('Mantenimiento',          'Programas preventivos y correctivos');

INSERT INTO proyectos (nombre, descripcion, estado, presupuesto, avance_pct, fecha_inicio, fecha_fin, responsable_id) VALUES
  ('Torre Empresarial Norte',         'Edificio de oficinas 12 pisos',     'ejecucion',    2400000000, 68, '2026-03-01', '2026-09-30', 1),
  ('Conjunto Residencial El Pino',    'Conjunto de 80 apartamentos',       'planificacion', 4800000000, 15, '2026-06-15', '2027-03-15', 1),
  ('Bodega Industrial Zona Franca',   'Bodega 5000m² con oficinas',        'ejecucion',    1200000000, 82, '2026-01-15', '2026-08-15', 1),
  ('Centro Comercial Las Palmas',     'Centro comercial 3 niveles',        'suspendido',   8500000000, 34, '2025-09-01', '2027-06-01', 1);
