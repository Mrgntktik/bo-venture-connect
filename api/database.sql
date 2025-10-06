-- Crear base de datos
CREATE DATABASE IF NOT EXISTS blvgames CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blvgames;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('creator', 'admin') NOT NULL DEFAULT 'creator',
    business_name VARCHAR(255),
    logo TEXT,
    cover_photo TEXT,
    description TEXT,
    phone VARCHAR(50),
    address TEXT,
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    twitter VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de juegos
CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    category VARCHAR(100),
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de imágenes de juegos
CREATE TABLE IF NOT EXISTS game_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    INDEX idx_game_id (game_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de analytics de WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_clicked_at (clicked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario administrador por defecto
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@blvgames.bo', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE name=name;

-- Insertar datos de ejemplo
INSERT INTO users (name, email, password, role, business_name, logo, description, phone, address, facebook, instagram) VALUES
('Carlos Mendoza', 'carlos@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Pixel Dreams Studio', 'https://api.dicebear.com/7.x/initials/svg?seed=PD', 'Desarrolladores independientes de juegos retro y pixel art', '+591 70123456', 'La Paz, Bolivia', 'pixeldreamsstudio', '@pixeldreams'),
('María Rodríguez', 'maria@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Andean Games', 'https://api.dicebear.com/7.x/initials/svg?seed=AG', 'Juegos inspirados en la cultura andina y folklore boliviano', '+591 71234567', 'Cochabamba, Bolivia', NULL, '@andeangames'),
('Jorge Torrez', 'jorge@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Altitude Interactive', 'https://api.dicebear.com/7.x/initials/svg?seed=AI', 'Creadores de experiencias de juego únicas en alta definición', '+591 72345678', 'Santa Cruz, Bolivia', 'altitudeinteractive', NULL),
('Ana Gutiérrez', 'ana@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Chakana Studios', 'https://api.dicebear.com/7.x/initials/svg?seed=CS', 'Juegos educativos y culturales para toda la familia', '+591 73456789', 'El Alto, Bolivia', 'chakanastudios', '@chakanastudios')
ON DUPLICATE KEY UPDATE name=name;
