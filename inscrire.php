<?php
header('Content-Type: application/json; charset=utf-8');

$response = ["success" => false, "message" => ""];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response["message"] = "Méthode non autorisée";
    echo json_encode($response);
    exit;
}

$fullname = trim($_POST['fullname'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($fullname) || empty($email) || empty($password)) {
    $response["message"] = "Tous les champs sont requis";
    echo json_encode($response);
    exit;
}

if (strlen($password) < 8) {
    $response["message"] = "Mot de passe trop court (min 8 caractères)";
    echo json_encode($response);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$conn = new mysqli("localhost", "root", "", "smart_education");

if ($conn->connect_error) {
    $response["message"] = "Erreur base de données";
    echo json_encode($response);
    exit;
}


$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
if ($check->get_result()->num_rows > 0) {
    $response["message"] = "Email déjà utilisé";
    echo json_encode($response);
    exit;
}
$check->close();

$stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $fullname, $email, $hash);

if ($stmt->execute()) {
    $response = ["success" => true, "message" => "Inscription réussie !"];
} else {
    $response["message"] = "Erreur lors de l'inscription";
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>