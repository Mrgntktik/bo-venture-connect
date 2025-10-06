<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getConnection();

try {
    switch ($method) {
        case 'GET':
            $id = $_GET['id'] ?? null;
            
            if ($id) {
                // Obtener un usuario específico
                $stmt = $conn->prepare("
                    SELECT id, name, email, role, business_name, logo, cover_photo,
                           description, phone, address, facebook, instagram, twitter
                    FROM users 
                    WHERE id = ?
                ");
                $stmt->execute([$id]);
                $user = $stmt->fetch();
                
                if ($user) {
                    sendResponse(['user' => $user]);
                } else {
                    sendResponse(['error' => 'Usuario no encontrado'], 404);
                }
            } else {
                // Obtener todos los usuarios (creadores)
                $role = $_GET['role'] ?? 'creator';
                $stmt = $conn->prepare("
                    SELECT id, name, email, role, business_name, logo, cover_photo,
                           description, phone, address, facebook, instagram, twitter
                    FROM users 
                    WHERE role = ?
                    ORDER BY created_at DESC
                ");
                $stmt->execute([$role]);
                $users = $stmt->fetchAll();
                
                sendResponse(['users' => $users]);
            }
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                sendResponse(['error' => 'ID de usuario requerido'], 400);
            }
            
            $fields = [];
            $values = [];
            
            $allowedFields = ['name', 'business_name', 'description', 'phone', 'address', 
                            'facebook', 'instagram', 'twitter', 'logo', 'cover_photo'];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $fields[] = "$field = ?";
                    $values[] = $data[$field];
                }
            }
            
            if (empty($fields)) {
                sendResponse(['error' => 'No hay campos para actualizar'], 400);
            }
            
            $values[] = $id;
            $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute($values);
            
            sendResponse(['success' => true, 'message' => 'Usuario actualizado']);
            break;
            
        default:
            sendResponse(['error' => 'Método no permitido'], 405);
    }
} catch (Exception $e) {
    sendResponse(['error' => 'Error del servidor: ' . $e->getMessage()], 500);
}
?>