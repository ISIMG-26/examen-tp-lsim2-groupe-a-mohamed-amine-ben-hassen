<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$response = ["success" => false, "message" => ""];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response["message"] = "Méthode non autorisée";
    echo json_encode($response);
    exit;
}

$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
    $response["message"] = "Tous les champs sont requis";
    echo json_encode($response);
    exit;
}

$conn = new mysqli("localhost", "root", "", "smart_education");

if ($conn->connect_error) {
    $response["message"] = "Erreur base de données";
    echo json_encode($response);
    exit;
}

$stmt = $conn->prepare("SELECT id, fullname, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $response["message"] = "Email ou mot de passe incorrect";
    echo json_encode($response);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    $response["message"] = "Email ou mot de passe incorrect";
    echo json_encode($response);
    exit;
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['fullname'] = $user['fullname'];
$_SESSION['logged_in'] = true;

$response = ["success" => true, "message" => "Connexion réussie"];

$stmt->close();
$conn->close();

echo json_encode($response);
?>