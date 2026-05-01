<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["logged_in" => false]);
    exit;
}

$matiere_id = intval($_GET['matiere'] ?? 0);

$conn = new mysqli("localhost", "root", "", "smart_education");

// SELECT matière
$stmt = $conn->prepare("SELECT nom FROM matieres WHERE id = ?");
$stmt->bind_param("i", $matiere_id);
$stmt->execute();
$matiere = $stmt->get_result()->fetch_assoc();
$stmt->close();

// SELECT cours avec video_url
$stmt = $conn->prepare("SELECT id, titre, contenu, video_url FROM cours WHERE matiere_id = ?");
$stmt->bind_param("i", $matiere_id);
$stmt->execute();
$result = $stmt->get_result();

$cours = [];
while ($row = $result->fetch_assoc()) {
    $cours[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode([
    "logged_in" => true,
    "matiere" => $matiere['nom'] ?? 'Inconnue',
    "cours" => $cours
]);
?>