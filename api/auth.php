<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getConnection();

try {
    switch ($method) {
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $action = $_GET['action'] ?? '';
            
            if ($action === 'login') {
                // Login
                $error = validateRequired($data, ['email', 'password']);
                if ($error) {
                    sendResponse(['error' => $error], 400);
                }
                
                $stmt = $conn->prepare("
                    SELECT id, name, email, role, business_name, logo, cover_photo, 
                           description, phone, address, facebook, instagram, twitter
                    FROM users 
                    WHERE email = ?
                ");
                $stmt->execute([$data['email']]);
                $user = $stmt->fetch();
                
                if ($user && password_verify($data['password'], $user['password'] ?? '')) {
                    unset($user['password']);
                    sendResponse(['user' => $user, 'success' => true]);
                } else {
                    sendResponse(['error' => 'Credenciales inválidas'], 401);
                }
                
            } elseif ($action === 'register') {
                // Registro
                $error = validateRequired($data, ['name', 'email', 'password', 'businessName']);
                if ($error) {
                    sendResponse(['error' => $error], 400);
                }
                
                // Verificar si el email ya existe
                $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
                $stmt->execute([$data['email']]);
                if ($stmt->fetch()) {
                    sendResponse(['error' => 'El email ya está registrado'], 400);
                }
                
                $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
                $logo = 'https://api.dicebear.com/7.x/initials/svg?seed=' . urlencode($data['businessName']);
                
                $stmt = $conn->prepare("
                    INSERT INTO users (name, email, password, role, business_name, logo)
                    VALUES (?, ?, ?, 'creator', ?, ?)
                ");
                $stmt->execute([
                    $data['name'],
                    $data['email'],
                    $hashedPassword,
                    $data['businessName'],
                    $logo
                ]);
                
                $userId = $conn->lastInsertId();
                
                $stmt = $conn->prepare("
                    SELECT id, name, email, role, business_name, logo
                    FROM users 
                    WHERE id = ?
                ");
                $stmt->execute([$userId]);
                $user = $stmt->fetch();
                
                sendResponse(['user' => $user, 'success' => true], 201);
                
            } else {
                sendResponse(['error' => 'Acción no válida'], 400);
            }
            break;
            
        default:
            sendResponse(['error' => 'Método no permitido'], 405);
    }
} catch (Exception $e) {
    sendResponse(['error' => 'Error del servidor: ' . $e->getMessage()], 500);
}
?>