CREATE DATABASE IF NOT EXISTS smart_education;
USE smart_education;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE matieres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    description TEXT,
    icone VARCHAR(10)
);

CREATE TABLE cours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matiere_id INT,
    titre VARCHAR(200),
    contenu TEXT,
    video_url VARCHAR(500)
);

CREATE TABLE progressions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    cours_id INT,
    note INT,
    statut VARCHAR(20),
    date_completion TIMESTAMP
);