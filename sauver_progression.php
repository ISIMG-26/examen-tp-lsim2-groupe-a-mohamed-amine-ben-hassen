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
$cours_id = intval($_POST['cours_id'] ?? 0);
$note = intval($_POST['note'] ?? 0);

$conn = new mysqli("localhost", "root", "", "smart_education");

$check = $conn->prepare("SELECT id FROM progressions WHERE user_id = ? AND cours_id = ?");
$check->bind_param("ii", $user_id, $cours_id);
$check->execute();

if ($check->get_result()->num_rows > 0) {
    $update = $conn->prepare("UPDATE progressions SET note = ?, statut = 'termine', date_completion = NOW() WHERE user_id = ? AND cours_id = ?");
    $update->bind_param("iii", $note, $user_id, $cours_id);
    $success = $update->execute();
    $update->close();
    $response["action"] = "update";
} else {
    $insert = $conn->prepare("INSERT INTO progressions (user_id, cours_id, note, statut) VALUES (?, ?, ?, 'termine')");
    $insert->bind_param("iii", $user_id, $cours_id, $note);
    $success = $insert->execute();
    $insert->close();
    $response["action"] = "insert";
}

$check->close();
$conn->close();

$response["success"] = $success;
$response["message"] = $success ? "Progression sauvegardée" : "Erreur";

echo json_encode($response);
?>