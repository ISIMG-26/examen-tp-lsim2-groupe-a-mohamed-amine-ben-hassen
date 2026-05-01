
#  Smart Education

**Mini-projet LSIM 2 — Examen TP Technologies & Programmation Web 2025-2026**

---

##  Membres du groupe

Realisée par Mohamed Amine Ben Hassen LSIM2 groupe A

---

##  Description du projet

**Smart Education** est une plateforme web d'apprentissage en ligne destinée aux élèves du primaire. Elle permet aux utilisateurs de :

- **S'inscrire et se connecter** (authentification sécurisée avec hashage des mots de passe)
- **Consulter des matières** (Mathématiques, Français, Sciences)
- **Visionner des cours** avec vidéos intégrées
- **Suivre sa progression** avec notes et statut des cours terminés
- **Discuter avec un assistant pédagogique** (chatbot intégré)

Le projet démontre l'utilisation complète du stack **HTML/CSS/JavaScript/PHP/MySQL** avec communication AJAX.
|

---

## 🏗️Structure du projet
/project-root
├── index.php              # Point d'entrée
├── README.md              # Ce fichier
├── html/                  # Pages HTML
│   ├── accueil.html
│   ├── connexion.html
│   ├── inscription.html
│   ├── matieres.html
│   ├── cours.html
│   └── progression.html
├── css/                   # Feuilles de style
│   ├── style.css
│   └── chatbot.css
├── js/                    # Scripts JavaScript
│   ├── connexion.js
│   ├── inscription.js
│   ├── matieres.js
│   ├── cours.js
│   ├── progression.js
│   └── chatbot.js
├── back/                  # Scripts PHP (API)
│   ├── connecter.php
│   ├── inscrire.php
│   ├── deconnecter.php
│   ├── verifier_session.php
│   ├── lister_matieres.php
│   ├── lister_cours.php
│   ├── lister_progression.php
│   ├── sauver_progression.php
│   ├── supprimer_progression.php
│   └── chatbot_api.php
├── database/              # Base de données
│   └── script.sql