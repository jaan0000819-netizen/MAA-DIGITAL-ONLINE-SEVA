<?php
// MAA DIGITAL - Orders API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

$data   = json_decode(file_get_contents('php://input'), true);
$action = isset($data['action']) ? $data['action'] : (isset($_GET['action']) ? $_GET['action'] : 'list');

// TODO: DB connection
// $conn = new mysqli('localhost', 'db_user', 'db_pass', 'maa_digital');

switch ($action) {
    case 'create':
        $memberId = $data['member_id'] ?? '';
        $service  = $data['service'] ?? '';
        $details  = $data['details'] ?? '';
        $amount   = floatval($data['amount'] ?? 0);
        if (empty($memberId) || empty($service)) {
            echo json_encode(['success' => false, 'message' => 'Member ID aur Service required hai']);
            exit;
        }
        $orderId = 'ORD' . time();
        // TODO: DB insert
        // $stmt = $conn->prepare("INSERT INTO orders (order_id, member_id, service, details, amount, status, created_at) VALUES (?,?,?,?,?,'pending',NOW())");
        echo json_encode(['success' => true, 'order_id' => $orderId, 'message' => 'Order placed! Processing shuru ho jayega.']);
        break;

    case 'list':
        $memberId = $_GET['member_id'] ?? '';
        // TODO: DB fetch
        echo json_encode(['success' => true, 'orders' => []]);
        break;

    case 'status':
        $orderId = $_GET['order_id'] ?? '';
        // TODO: DB fetch
        echo json_encode(['success' => true, 'status' => 'pending', 'message' => 'Processing mein hai']);
        break;

    case 'update':
        // Admin only
        $orderId = $data['order_id'] ?? '';
        $status  = $data['status'] ?? '';
        // TODO: DB update
        echo json_encode(['success' => true, 'message' => 'Order status updated']);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
