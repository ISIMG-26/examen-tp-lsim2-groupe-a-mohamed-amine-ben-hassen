<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["logged_in" => false]);
    exit;
}

$user_id = $_SESSION['user_id'];
$conn = new mysqli("localhost", "root", "", "smart_education");

$sql = "SELECT p.id, p.note, p.date_completion, c.titre as titre_cours, m.nom as nom_matiere
        FROM progressions p
        JOIN cours c ON p.cours_id = c.id
        JOIN matieres m ON c.matiere_id = m.id
        WHERE p.user_id = ?
        ORDER BY p.date_completion DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$progressions = [];
while ($row = $result->fetch_assoc()) {
    $progressions[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(["logged_in" => true, "progressions" => $progressions]);
?>