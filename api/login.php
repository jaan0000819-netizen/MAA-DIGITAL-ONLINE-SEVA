<?php
// MAA DIGITAL - Login API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$mobile = isset($data['mobile']) ? trim($data['mobile']) : '';
$password = isset($data['password']) ? trim($data['password']) : '';
$role = isset($data['role']) ? $data['role'] : 'member';

// Validate
if (empty($mobile) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Mobile aur Password required hai']);
    exit;
}

if (strlen($mobile) !== 10 || !is_numeric($mobile)) {
    echo json_encode(['success' => false, 'message' => 'Valid 10 digit mobile number daalen']);
    exit;
}

// TODO: Database se user fetch karein
// Example DB connection:
// $conn = new mysqli('localhost', 'db_user', 'db_pass', 'maa_digital');
// $stmt = $conn->prepare("SELECT * FROM users WHERE mobile=? AND role=?");
// $stmt->bind_param("ss", $mobile, $role);
// $stmt->execute();
// $user = $stmt->get_result()->fetch_assoc();

// Demo response (replace with DB logic)
if ($mobile === '9898072313' && $password === 'admin123' && $role === 'admin') {
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => 'MD00001',
            'name' => 'Admin Ji',
            'mobile' => $mobile,
            'role' => 'admin',
            'wallet' => '0.00'
        ]
    ]);
} elseif (!empty($mobile) && !empty($password)) {
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => 'MD' . substr($mobile, -5),
            'name' => 'Member Ji',
            'mobile' => $mobile,
            'role' => 'member',
            'wallet' => '0.00'
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}
