
document.getElementById('formConnexion').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        afficherMessage('Tous les champs sont obligatoires', 'erreur');
        return;
    }

    fetch('../back/connecter.php', {
        method: 'POST',
        body: new FormData(this)
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            afficherMessage('Connexion réussie !', 'succes');
            setTimeout(() => window.location.href = 'matieres.html', 1200);
        } else {
            afficherMessage(data.message, 'erreur');
        }
    })
    .catch(err => {
        afficherMessage('Erreur serveur', 'erreur');
    });
});

function afficherMessage(texte, type) {
    const msg = document.getElementById('message');
    msg.textContent = texte;
    msg.className = 'msg msg-' + type;
    msg.style.display = 'block';
}
