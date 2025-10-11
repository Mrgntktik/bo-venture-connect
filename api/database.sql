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

-- Insertar datos de ejemplo de usuarios creadores
INSERT INTO users (name, email, password, role, business_name, logo, description, phone, address, facebook, instagram, twitter) VALUES
('Carlos Mendoza', 'carlos@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Pixel Dreams Studio', 'https://api.dicebear.com/7.x/initials/svg?seed=PD', 'Desarrolladores independientes de juegos retro y pixel art con más de 5 años de experiencia. Especializados en juegos de plataformas y aventuras clásicas.', '+591 70123456', 'Av. Arce 2345, La Paz, Bolivia', 'pixeldreamsstudio', '@pixeldreams', '@pixeldreamsstudio'),
('María Rodríguez', 'maria@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Andean Games', 'https://api.dicebear.com/7.x/initials/svg?seed=AG', 'Juegos inspirados en la cultura andina y folklore boliviano. Comprometidos con preservar nuestras tradiciones a través del entretenimiento digital.', '+591 71234567', 'Calle Heroínas 156, Cochabamba, Bolivia', 'andeangames', '@andeangames', NULL),
('Jorge Torrez', 'jorge@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Altitude Interactive', 'https://api.dicebear.com/7.x/initials/svg?seed=AI', 'Creadores de experiencias de juego únicas en alta definición. Especialistas en juegos de estrategia y simulación con gráficos de última generación.', '+591 72345678', 'Av. Monseñor Rivero 3456, Santa Cruz, Bolivia', 'altitudeinteractive', '@altitudeint', '@altitude_int'),
('Ana Gutiérrez', 'ana@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Chakana Studios', 'https://api.dicebear.com/7.x/initials/svg?seed=CS', 'Juegos educativos y culturales para toda la familia. Desarrollamos contenido interactivo que enseña mientras divierte.', '+591 73456789', 'Calle 1 de Mayo 789, El Alto, Bolivia', 'chakanastudios', '@chakanastudios', NULL),
('Roberto Silva', 'roberto@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Neon Labs', 'https://api.dicebear.com/7.x/initials/svg?seed=NL', 'Estudio indie especializado en juegos de acción y aventura con estética cyberpunk. Creando mundos futuristas y experiencias inmersivas.', '+591 74567890', 'Zona Sur, La Paz, Bolivia', 'neonlabsgames', '@neonlabs', '@neonlabs_bo'),
('Patricia Flores', 'patricia@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Mountain Peak Games', 'https://api.dicebear.com/7.x/initials/svg?seed=MPG', 'Juegos de aventura y exploración inspirados en la geografía boliviana. Cada juego es un viaje por nuestras montañas y valles.', '+591 75678901', 'Av. América 4567, Cochabamba, Bolivia', NULL, '@mountainpeakgames', NULL),
('Luis Mamani', 'luis@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Wara Games', 'https://api.dicebear.com/7.x/initials/svg?seed=WG', 'Desarrolladores de juegos móviles casuales con temática boliviana. Juegos simples pero adictivos para todas las edades.', '+591 76789012', 'Calle Ballivián 890, Santa Cruz, Bolivia', 'waragames', '@waragames_bo', '@wara_games'),
('Sofia Vargas', 'sofia@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'creator', 'Quantum Studios', 'https://api.dicebear.com/7.x/initials/svg?seed=QS', 'Pioneros en realidad virtual y experiencias inmersivas. Llevando el gaming boliviano al siguiente nivel tecnológico.', '+591 77890123', 'Av. 6 de Agosto 1234, La Paz, Bolivia', 'quantumstudiosbo', '@quantumstudios', '@quantum_bo')
ON DUPLICATE KEY UPDATE name=name;

-- Insertar juegos de ejemplo (variedad de categorías y estados)
INSERT INTO games (user_id, name, description, price, category, status) VALUES
-- Juegos de Pixel Dreams Studio (user_id: 2)
(2, 'Pixel Quest: La Aventura', 'Un emocionante juego de plataformas retro con gráficos pixel art. Explora mazmorras, derrota enemigos y encuentra tesoros escondidos en un mundo de 8 bits lleno de secretos.', 25.00, 'Aventura', 'approved'),
(2, 'Retro Racer Championship', 'Carreras arcade al estilo clásico con pistas inspiradas en las carreteras bolivianas. Compite contra otros jugadores en este nostálgico juego de carreras.', 30.00, 'Carreras', 'approved'),
(2, 'Dungeon Explorer Deluxe', 'Explora calabozos generados proceduralmente en este roguelike pixel art. Cada partida es única con enemigos, trampas y tesoros aleatorios.', 20.00, 'RPG', 'pending'),

-- Juegos de Andean Games (user_id: 3)
(3, 'Leyendas del Illimani', 'Un RPG narrativo basado en las leyendas y mitos de los pueblos andinos. Vive una historia épica llena de magia, aventura y tradición.', 35.00, 'RPG', 'approved'),
(3, 'Festival Folklorico', 'Juego de ritmo y música con melodías tradicionales bolivianas. Aprende sobre nuestras danzas mientras disfrutas de este divertido juego musical.', 15.00, 'Música', 'approved'),
(3, 'Guardianes de la Pachamama', 'Aventura educativa sobre conservación ambiental y respeto a la naturaleza. Ayuda a proteger los ecosistemas andinos en este juego de aventura y puzles.', 18.00, 'Aventura', 'approved'),

-- Juegos de Altitude Interactive (user_id: 4)
(4, 'Empire Builder: Bolivia', 'Juego de estrategia donde construyes y gestionas ciudades bolivianas. Desarrolla infraestructura, gestiona recursos y haz crecer tu imperio.', 45.00, 'Estrategia', 'approved'),
(4, 'Sky Commander', 'Simulador de vuelo con misiones sobre el territorio boliviano. Pilota aviones comerciales y de combate en misiones realistas.', 40.00, 'Simulación', 'approved'),
(4, 'Trading Empire', 'Simula el comercio y la economía en un entorno virtual detallado. Conviértete en un magnate de los negocios en este juego de gestión empresarial.', 35.00, 'Simulación', 'pending'),

-- Juegos de Chakana Studios (user_id: 5)
(5, 'Aprende Matemáticas Jugando', 'Juego educativo que hace divertido aprender matemáticas. Resuelve problemas mientras avanzas en una aventura llena de desafíos numéricos.', 12.00, 'Educativo', 'approved'),
(5, 'Historia de Bolivia Interactive', 'Explora la historia boliviana de forma interactiva. Viaja en el tiempo y vive los momentos más importantes de nuestra nación.', 15.00, 'Educativo', 'approved'),
(5, 'Ciencia Divertida', 'Experimentos científicos virtuales para niños. Aprende física, química y biología de manera práctica y entretenida.', 10.00, 'Educativo', 'approved'),

-- Juegos de Neon Labs (user_id: 6)
(6, 'Cyberpunk Runner 2087', 'Juego de acción futurista en un mundo cyberpunk. Corre, salta y combate en una ciudad neon llena de peligros y secretos.', 28.00, 'Acción', 'approved'),
(6, 'Neon Blade Chronicles', 'Hack and slash con estética cyberpunk y combate frenético. Domina diferentes armas y habilidades en batallas espectaculares.', 32.00, 'Acción', 'approved'),
(6, 'Digital Uprising', 'Shooter táctico ambientado en un futuro distópico. Únete a la resistencia y lucha por la libertad en intensos combates urbanos.', 38.00, 'Acción', 'pending'),

-- Juegos de Mountain Peak Games (user_id: 7)
(7, 'Trekking en los Andes', 'Simulador de senderismo por las montañas bolivianas. Disfruta de paisajes impresionantes mientras superas desafíos de la naturaleza.', 22.00, 'Aventura', 'approved'),
(7, 'Expedición Amazónica', 'Aventura de supervivencia en la selva amazónica boliviana. Explora, caza, construye refugios y descubre secretos de la naturaleza.', 26.00, 'Aventura', 'approved'),
(7, 'Mountain Climber Pro', 'Simulador realista de escalada en montaña. Conquista las cimas más altas de Bolivia con mecánicas de escalada auténticas.', 30.00, 'Deportes', 'rejected'),

-- Juegos de Wara Games (user_id: 8)
(8, 'Salta y Gana', 'Juego casual de plataformas simple pero adictivo. Perfecto para jugar en cualquier momento con controles intuitivos.', 5.00, 'Casual', 'approved'),
(8, 'Puzzle Boliviano', 'Rompecabezas con imágenes de paisajes y cultura boliviana. Relájate mientras armas hermosas imágenes de nuestro país.', 8.00, 'Puzzle', 'approved'),
(8, 'Match Colors Fiesta', 'Juego de combinar colores inspirado en nuestras fiestas tradicionales. Colorido, divertido y perfecto para todas las edades.', 6.00, 'Casual', 'approved'),

-- Juegos de Quantum Studios (user_id: 9)
(9, 'VR Bolivia Experience', 'Experiencia de realidad virtual que te transporta a los lugares más emblemáticos de Bolivia. Tecnología de punta para un viaje virtual inolvidable.', 50.00, 'Simulación', 'approved'),
(9, 'Quantum Warfare', 'Shooter VR con combates tácticos futuristas. Sumérgete en batallas inmersivas con tecnología de realidad virtual de última generación.', 55.00, 'Acción', 'pending'),
(9, 'Space Explorer VR', 'Exploración espacial en realidad virtual. Viaja por el universo, descubre planetas y vive la experiencia de ser un astronauta.', 48.00, 'Aventura', 'approved')
ON DUPLICATE KEY UPDATE name=name;

-- Insertar imágenes para los juegos
INSERT INTO game_images (game_id, image_url, display_order) VALUES
-- Imágenes para Pixel Quest
(1, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', 1),
(1, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', 2),

-- Imágenes para Retro Racer
(2, 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800', 1),
(2, 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800', 2),

-- Imágenes para Dungeon Explorer
(3, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800', 1),

-- Imágenes para Leyendas del Illimani
(4, 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800', 1),
(4, 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800', 2),

-- Imágenes para Festival Folklorico
(5, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800', 1),

-- Imágenes para Guardianes de la Pachamama
(6, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', 1),
(6, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 2),

-- Imágenes para Empire Builder
(7, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 1),
(7, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 2),

-- Imágenes para Sky Commander
(8, 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800', 1),

-- Imágenes para Trading Empire
(9, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 1),

-- Imágenes para Aprende Matemáticas
(10, 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800', 1),

-- Imágenes para Historia de Bolivia
(11, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800', 1),

-- Imágenes para Ciencia Divertida
(12, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', 1),

-- Imágenes para Cyberpunk Runner
(13, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', 1),
(13, 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800', 2),

-- Imágenes para Neon Blade
(14, 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800', 1),

-- Imágenes para Digital Uprising
(15, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', 1),

-- Imágenes para Trekking en los Andes
(16, 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800', 1),
(16, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 2),

-- Imágenes para Expedición Amazónica
(17, 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800', 1),

-- Imágenes para Mountain Climber
(18, 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800', 1),

-- Imágenes para Salta y Gana
(19, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', 1),

-- Imágenes para Puzzle Boliviano
(20, 'https://images.unsplash.com/photo-1453736619101-79a3cdc5c0fe?w=800', 1),

-- Imágenes para Match Colors
(21, 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800', 1),

-- Imágenes para VR Bolivia
(22, 'https://images.unsplash.com/photo-1617802690658-1173a812650d?w=800', 1),
(22, 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800', 2),

-- Imágenes para Quantum Warfare
(23, 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800', 1),

-- Imágenes para Space Explorer VR
(24, 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800', 1),
(24, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800', 2)
ON DUPLICATE KEY UPDATE game_id=game_id;

-- Insertar datos de analytics de WhatsApp (simulando clics de diferentes usuarios en diferentes juegos)
INSERT INTO whatsapp_analytics (user_id, game_id, clicked_at) VALUES
(2, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 2, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 4, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 5, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 6, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(3, 4, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, 7, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 8, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 10, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 11, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 12, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(6, 13, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 14, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(7, 16, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(7, 17, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(8, 19, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(8, 20, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(8, 21, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(9, 22, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(9, 24, DATE_SUB(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE user_id=user_id;
