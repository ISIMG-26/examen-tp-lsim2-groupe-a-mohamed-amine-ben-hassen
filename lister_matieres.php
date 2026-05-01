<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["logged_in" => false]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "smart_education");

$result = $conn->query("SELECT id, nom, description, icone FROM matieres");
$matieres = [];

while ($row = $result->fetch_assoc()) {
    $matieres[] = $row;
}

$conn->close();

echo json_encode(["logged_in" => true, "matieres" => $matieres]);
?>