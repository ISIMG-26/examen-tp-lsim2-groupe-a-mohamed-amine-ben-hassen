<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["error" => "Non authentifié"]);
    http_response_code(401);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$question = trim($input['question'] ?? '');

if (empty($question)) {
    echo json_encode(["error" => "Question vide"]);
    http_response_code(400);
    exit;
}

$apiKey = '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';

$data = [
    'model' => 'llama-3.1-8b-instant',
    'messages' => [
        ['role' => 'system', 'content' => 'Tu es un assistant pédagogique. Réponds simplement.'],
        ['role' => 'user', 'content' => $question]
    ],
    'temperature' => 0.7,
    'max_tokens' => 300
];

$ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

$log = "=== " . date('Y-m-d H:i:s') . " ===\n";
$log .= "HTTP CODE: " . $httpCode . "\n";
$log .= "RAW RESPONSE:\n" . $response . "\n";
$log .= "DECODED:\n" . print_r($result, true) . "\n\n";
file_put_contents('chatbot_debug.log', $log, FILE_APPEND);

if ($httpCode === 200 && isset($result['choices'][0]['message']['content'])) {
    echo json_encode(["success" => true, "answer" => $result['choices'][0]['message']['content']]);
} else {
    echo json_encode([
        "success" => false,
        "answer" => "Erreur API (HTTP " . $httpCode . "). Vérifie chatbot_debug.log",
        "error_detail" => $result['error']['message'] ?? 'Unknown error'
    ]);
}
?>