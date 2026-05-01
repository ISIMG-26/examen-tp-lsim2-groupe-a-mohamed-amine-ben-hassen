<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$response = ["success" => false, "message" => ""];

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    $response["message"] = "Non connecté";
    echo json_encode($response);
    exit;
}

$user_id = $_SESSION['user_id'];

$id = intval($_GET['id'] ?? 0);
$cours_id = intval($_GET['cours_id'] ?? 0);

$conn = new mysqli("localhost", "root", "", "smart_education");

if ($id > 0) {
    $stmt = $conn->prepare("DELETE FROM progressions WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $user_id);
} else if ($cours_id > 0) {
    $stmt = $conn->prepare("DELETE FROM progressions WHERE cours_id = ? AND user_id = ?");
    $stmt->bind_param("ii", $cours_id, $user_id);
} else {
    $response["message"] = "ID invalide";
    echo json_encode($response);
    exit;
}

$success = $stmt->execute();
$stmt->close();
$conn->close();

$response["success"] = $success;
$response["message"] = $success ? "Supprimé" : "Erreur";

echo json_encode($response);
?>