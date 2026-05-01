
fetch('../back/verifier_session.php')
.then(r => r.json())
.then(data => {
    if (!data.logged_in) {
        window.location.href = 'connexion.html';
        return;
    }
    chargerMatieres();
});

document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('../back/deconnecter.php')
    .then(() => window.location.href = 'connexion.html');
});

function chargerMatieres() {
    fetch('../back/lister_matieres.php')
    .then(r => r.json())
    .then(data => {
        const container = document.getElementById('listeMatieres');
        container.innerHTML = '';

        data.matieres.forEach(m => {
            const div = document.createElement('div');
            div.className = 'carte';
            div.innerHTML = `
                <h3 style="color: var(--bleu);">${m.icone} ${m.nom}</h3>
                <p>${m.description}</p>
                <a href="cours.html?matiere=${m.id}" class="btn" style="margin-top: 15px;">Voir les cours</a>
            `;
            container.appendChild(div);
        });
    });
}
