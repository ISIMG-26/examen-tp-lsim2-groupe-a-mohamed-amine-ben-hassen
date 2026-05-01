<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        "logged_in" => true,
        "fullname" => $_SESSION['fullname']
    ]);
} else {
    echo json_encode(["logged_in" => false]);
}
?>