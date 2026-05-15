<?php
// MAA DIGITAL - Register API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$name     = isset($data['name']) ? trim($data['name']) : '';
$mobile   = isset($data['mobile']) ? trim($data['mobile']) : '';
$password = isset($data['password']) ? $data['password'] : '';
$state    = isset($data['state']) ? $data['state'] : '';
$district = isset($data['district']) ? $data['district'] : '';
$address  = isset($data['address']) ? $data['address'] : '';
$pincode  = isset($data['pincode']) ? $data['pincode'] : '';
$referral = isset($data['referral']) ? $data['referral'] : '';

// Validations
if (empty($name) || empty($mobile) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Name, Mobile aur Password required hai']);
    exit;
}
if (strlen($mobile) !== 10 || !is_numeric($mobile)) {
    echo json_encode(['success' => false, 'message' => 'Valid 10 digit mobile number daalen']);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password min 6 characters hona chahiye']);
    exit;
}

// TODO: DB mein save karein
// $conn = new mysqli('localhost', 'db_user', 'db_pass', 'maa_digital');
// $hashedPass = password_hash($password, PASSWORD_DEFAULT);
// $memberId = 'MD' . time();
// $stmt = $conn->prepare("INSERT INTO users (member_id, name, mobile, password, state, district, address, pincode, referral, role, wallet, created_at) VALUES (?,?,?,?,?,?,?,?,?,'member','0.00',NOW())");
// $stmt->bind_param("sssssssss", $memberId, $name, $mobile, $hashedPass, $state, $district, $address, $pincode, $referral);
// $stmt->execute();

$memberId = 'MD' . substr(time(), -5);

echo json_encode([
    'success' => true,
    'message' => 'Registration successful! Login karein.',
    'member_id' => $memberId
]);
