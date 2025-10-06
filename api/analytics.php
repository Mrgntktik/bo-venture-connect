<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getConnection();

try {
    switch ($method) {
        case 'POST':
            // Registrar click de WhatsApp
            $data = json_decode(file_get_contents('php://input'), true);
            
            $error = validateRequired($data, ['user_id']);
            if ($error) {
                sendResponse(['error' => $error], 400);
            }
            
            $stmt = $conn->prepare("
                INSERT INTO whatsapp_analytics (user_id, game_id)
                VALUES (?, ?)
            ");
            $stmt->execute([
                $data['user_id'],
                $data['game_id'] ?? null
            ]);
            
            sendResponse(['success' => true, 'message' => 'Click registrado'], 201);
            break;
            
        case 'GET':
            // Obtener estadísticas
            $userId = $_GET['user_id'] ?? null;
            
            if ($userId) {
                // Estadísticas por usuario
                $stmt = $conn->prepare("
                    SELECT 
                        COUNT(*) as total_clicks,
                        DATE(clicked_at) as date,
                        COUNT(DISTINCT game_id) as games_clicked
                    FROM whatsapp_analytics
                    WHERE user_id = ?
                    GROUP BY DATE(clicked_at)
                    ORDER BY date DESC
                    LIMIT 30
                ");
                $stmt->execute([$userId]);
                $stats = $stmt->fetchAll();
                
                sendResponse(['stats' => $stats]);
            } else {
                // Estadísticas generales
                $stmt = $conn->query("
                    SELECT 
                        COUNT(*) as total_clicks,
                        COUNT(DISTINCT user_id) as total_users,
                        DATE(clicked_at) as date
                    FROM whatsapp_analytics
                    GROUP BY DATE(clicked_at)
                    ORDER BY date DESC
                    LIMIT 30
                ");
                $stats = $stmt->fetchAll();
                
                sendResponse(['stats' => $stats]);
            }
            break;
            
        default:
            sendResponse(['error' => 'Método no permitido'], 405);
    }
} catch (Exception $e) {
    sendResponse(['error' => 'Error del servidor: ' . $e->getMessage()], 500);
}
?>