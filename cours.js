
fetch('../back/verifier_session.php')
.then(r => r.json())
.then(data => {
    if (!data.logged_in) {
        window.location.href = 'connexion.html';
        return;
    }
    chargerCours();
});

// Déconnexion
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('../back/deconnecter.php')
    .then(() => window.location.href = 'connexion.html');
});

const params = new URLSearchParams(window.location.search);
const matiereId = params.get('matiere');

function chargerCours() {
    fetch('../back/lister_cours.php?matiere=' + matiereId)
    .then(r => r.json())
    .then(data => {
        document.getElementById('titreMatiere').textContent = data.matiere;

        const container = document.getElementById('listeCours');
        container.innerHTML = '';

        data.cours.forEach(c => {
            const div = document.createElement('div');
            div.className = 'carte';
            div.id = 'carte-' + c.id;

            const videoBloc = c.video_url
                ? `<div style="margin: 15px 0; border-radius: 10px; overflow: hidden;">
                       <iframe
                           width="100%"
                           height="280"
                           src="${c.video_url}"
                           frameborder="0"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                           allowfullscreen
                           style="display: block; border-radius: 10px;">
                       </iframe>
                   </div>`
                : '';

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <h4 style="font-size: 1.1rem; color: var(--texte);">${c.titre}</h4>
                    <button class="btn btn-vert" style="white-space: nowrap; margin-left: 15px;"
                        onclick="terminerCours(this, ${c.id}, '${c.titre.replace(/'/g, "\\'")}')">
                        Terminer
                    </button>
                </div>
                <p style="color: var(--gris); margin-bottom: 5px;">${c.contenu}</p>
                ${videoBloc}
            `;

            container.appendChild(div);
        });
    });
}

function terminerCours(btn, coursId, titre) {
    const formData = new FormData();
    formData.append('cours_id', coursId);
    formData.append('note', 15);

    fetch('../back/sauver_progression.php', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            // Désactiver bouton
            btn.textContent = 'Fait';
            btn.disabled = true;
            btn.style.background = '#6b7280';

            const carte = document.getElementById('carte-' + coursId);
            carte.style.opacity = '0.6';

            // CRÉER élément dans "Cours terminés"
            const liste = document.getElementById('coursTermines');

            // Supprimer message "Aucun cours"
            if (liste.children[0] && liste.children[0].textContent.includes('Aucun')) {
                liste.removeChild(liste.children[0]);
            }

            const li = document.createElement('li');
            li.style.cssText = 'padding: 10px; background: #d1fae5; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;';
            li.innerHTML = `
                <span>✅ ${titre}</span>
                <button onclick="supprimerCours(this, ${coursId})" class="btn btn-rouge" style="padding: 5px 12px; font-size: 0.85rem;">🗑 Supprimer</button>
            `;
            liste.appendChild(li);
        }
    });
}

function supprimerCours(btn, coursId) {
    fetch('../back/supprimer_progression.php?cours_id=' + coursId)
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            // Réactiver la carte
            const carte = document.getElementById('carte-' + coursId);
            if (carte) {
                carte.style.opacity = '1';
                const btnTerminer = carte.querySelector('.btn-vert');
                if (btnTerminer) {
                    btnTerminer.textContent = 'Terminer';
                    btnTerminer.disabled = false;
                    btnTerminer.style.background = '';
                }
            }

            const li = btn.parentElement;
            li.style.transition = '0.3s';
            li.style.opacity = '0';
            li.style.transform = 'translateX(20px)';
            setTimeout(() => {
                li.remove();
                const liste = document.getElementById('coursTermines');
                if (liste.children.length === 0) {
                    liste.innerHTML = '<li style="color: var(--gris);">Aucun cours terminé pour l\'instant.</li>';
                }
            }, 300);
        }
    });
}