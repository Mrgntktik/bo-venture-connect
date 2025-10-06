<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getConnection();

try {
    switch ($method) {
        case 'GET':
            $id = $_GET['id'] ?? null;
            $userId = $_GET['user_id'] ?? null;
            $status = $_GET['status'] ?? null;
            
            if ($id) {
                // Obtener un juego específico con sus imágenes
                $stmt = $conn->prepare("
                    SELECT g.*, 
                           GROUP_CONCAT(gi.image_url ORDER BY gi.display_order) as images
                    FROM games g
                    LEFT JOIN game_images gi ON g.id = gi.game_id
                    WHERE g.id = ?
                    GROUP BY g.id
                ");
                $stmt->execute([$id]);
                $game = $stmt->fetch();
                
                if ($game) {
                    $game['images'] = $game['images'] ? explode(',', $game['images']) : [];
                    sendResponse(['game' => $game]);
                } else {
                    sendResponse(['error' => 'Juego no encontrado'], 404);
                }
            } else {
                // Obtener todos los juegos con filtros
                $sql = "
                    SELECT g.*, 
                           GROUP_CONCAT(gi.image_url ORDER BY gi.display_order) as images
                    FROM games g
                    LEFT JOIN game_images gi ON g.id = gi.game_id
                ";
                
                $conditions = [];
                $params = [];
                
                if ($userId) {
                    $conditions[] = "g.user_id = ?";
                    $params[] = $userId;
                }
                
                if ($status) {
                    $conditions[] = "g.status = ?";
                    $params[] = $status;
                }
                
                if (!empty($conditions)) {
                    $sql .= " WHERE " . implode(' AND ', $conditions);
                }
                
                $sql .= " GROUP BY g.id ORDER BY g.created_at DESC";
                
                $stmt = $conn->prepare($sql);
                $stmt->execute($params);
                $games = $stmt->fetchAll();
                
                foreach ($games as &$game) {
                    $game['images'] = $game['images'] ? explode(',', $game['images']) : [];
                }
                
                sendResponse(['games' => $games]);
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            $error = validateRequired($data, ['user_id', 'name', 'description', 'price', 'category']);
            if ($error) {
                sendResponse(['error' => $error], 400);
            }
            
            $stmt = $conn->prepare("
                INSERT INTO games (user_id, name, description, price, category, status)
                VALUES (?, ?, ?, ?, ?, 'pending')
            ");
            $stmt->execute([
                $data['user_id'],
                $data['name'],
                $data['description'],
                $data['price'],
                $data['category']
            ]);
            
            $gameId = $conn->lastInsertId();
            
            // Insertar imágenes
            if (isset($data['images']) && is_array($data['images'])) {
                $stmt = $conn->prepare("
                    INSERT INTO game_images (game_id, image_url, display_order)
                    VALUES (?, ?, ?)
                ");
                
                foreach ($data['images'] as $index => $imageUrl) {
                    $stmt->execute([$gameId, $imageUrl, $index]);
                }
            }
            
            sendResponse(['success' => true, 'game_id' => $gameId], 201);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                sendResponse(['error' => 'ID de juego requerido'], 400);
            }
            
            $fields = [];
            $values = [];
            
            $allowedFields = ['name', 'description', 'price', 'category', 'status'];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $fields[] = "$field = ?";
                    $values[] = $data[$field];
                }
            }
            
            if (!empty($fields)) {
                $values[] = $id;
                $sql = "UPDATE games SET " . implode(', ', $fields) . " WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->execute($values);
            }
            
            // Actualizar imágenes si se proporcionan
            if (isset($data['images']) && is_array($data['images'])) {
                // Eliminar imágenes existentes
                $stmt = $conn->prepare("DELETE FROM game_images WHERE game_id = ?");
                $stmt->execute([$id]);
                
                // Insertar nuevas imágenes
                $stmt = $conn->prepare("
                    INSERT INTO game_images (game_id, image_url, display_order)
                    VALUES (?, ?, ?)
                ");
                
                foreach ($data['images'] as $index => $imageUrl) {
                    $stmt->execute([$id, $imageUrl, $index]);
                }
            }
            
            sendResponse(['success' => true, 'message' => 'Juego actualizado']);
            break;
            
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                sendResponse(['error' => 'ID de juego requerido'], 400);
            }
            
            $stmt = $conn->prepare("DELETE FROM games WHERE id = ?");
            $stmt->execute([$id]);
            
            sendResponse(['success' => true, 'message' => 'Juego eliminado']);
            break;
            
        default:
            sendResponse(['error' => 'Método no permitido'], 405);
    }
} catch (Exception $e) {
    sendResponse(['error' => 'Error del servidor: ' . $e->getMessage()], 500);
}
?>