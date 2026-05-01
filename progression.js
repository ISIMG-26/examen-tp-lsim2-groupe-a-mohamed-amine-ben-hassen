
fetch('../back/verifier_session.php')
.then(r => r.json())
.then(data => {
    if (!data.logged_in) {
        window.location.href = 'connexion.html';
        return;
    }
    chargerProgression();
});

document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('../back/deconnecter.php')
    .then(() => window.location.href = 'connexion.html');
});

function chargerProgression() {
    fetch('../back/lister_progression.php')
    .then(r => r.json())
    .then(data => {
        const container = document.getElementById('tableauProgression');

        if (data.progressions.length === 0) {
            container.innerHTML = '<p style="color: var(--gris);">Aucun cours terminé. Va dans Matières pour commencer !</p>';
            return;
        }

        let html = '<table><thead><tr><th>Cours</th><th>Matière</th><th>Note</th><th>Date</th><th>Action</th></tr></thead><tbody>';

        data.progressions.forEach(p => {
            html += `
                <tr>
                    <td>${p.titre_cours}</td>
                    <td>${p.nom_matiere}</td>
                    <td>${p.note}/20</td>
                    <td>${p.date_completion}</td>
                    <td><button onclick="supprimerProgression(${p.id}, this)" class="btn btn-rouge" style="padding: 5px 12px;">Supprimer</button></td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    });
}

function supprimerProgression(id, btn) {
    fetch('../back/supprimer_progression.php?id=' + id)
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            const row = btn.parentElement.parentElement;
            row.style.transition = '0.3s';
            row.style.background = '#fee2e2';
            setTimeout(() => row.remove(), 300);
        }
    });
}
