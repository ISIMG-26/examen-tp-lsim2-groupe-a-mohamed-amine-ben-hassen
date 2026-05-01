
document.getElementById('formInscription').addEventListener('submit', function(e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const msgDiv = document.getElementById('message');

    if (!fullname || !email || !password) {
        afficherMessage('Tous les champs sont obligatoires', 'erreur');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        afficherMessage('Email invalide', 'erreur');
        return;
    }

    if (password.length < 8) {
        afficherMessage('Mot de passe trop court (min 8)', 'erreur');
        return;
    }

    fetch('../back/inscrire.php', {
        method: 'POST',
        body: new FormData(this)
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            afficherMessage(data.message, 'succes');
            setTimeout(() => window.location.href = 'connexion.html', 1500);
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
