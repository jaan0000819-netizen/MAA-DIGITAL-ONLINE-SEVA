<?php
// MAA DIGITAL - Wallet API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

$data = json_decode(file_get_contents('php://input'), true);
$action = isset($data['action']) ? $data['action'] : (isset($_GET['action']) ? $_GET['action'] : '');

// TODO: DB connection
// $conn = new mysqli('localhost', 'db_user', 'db_pass', 'maa_digital');

switch ($action) {
    case 'recharge':
        $memberId = $data['member_id'] ?? '';
        $amount   = floatval($data['amount'] ?? 0);
        $method   = $data['method'] ?? 'Cash';
        if (empty($memberId) || $amount < 10) {
            echo json_encode(['success' => false, 'message' => 'Invalid request. Min ₹10 recharge.']);
            exit;
        }
        // TODO: DB update
        // $stmt = $conn->prepare("UPDATE users SET wallet = wallet + ? WHERE member_id = ?");
        // $stmt->bind_param("ds", $amount, $memberId);
        // $stmt->execute();
        echo json_encode(['success' => true, 'message' => "₹{$amount} recharge request received. 24hr mein add hoga."]);
        break;

    case 'balance':
        $memberId = $_GET['member_id'] ?? '';
        // TODO: DB fetch
        echo json_encode(['success' => true, 'balance' => '0.00']);
        break;

    case 'deduct':
        $memberId = $data['member_id'] ?? '';
        $amount   = floatval($data['amount'] ?? 0);
        $reason   = $data['reason'] ?? '';
        // TODO: Admin only - DB update
        echo json_encode(['success' => true, 'message' => "₹{$amount} deducted successfully."]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
