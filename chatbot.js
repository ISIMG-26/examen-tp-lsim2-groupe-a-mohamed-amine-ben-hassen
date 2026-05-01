// ══════════════════════════════════════
// CHATBOT - Smart Education
// ══════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('chatToggle');
    const closeBtn  = document.getElementById('chatClose');
    const windowEl  = document.getElementById('chatWindow');
    const input     = document.getElementById('chatInput');
    const sendBtn   = document.getElementById('chatSend');
    const messages  = document.getElementById('chatMessages');

    // Ouvrir/fermer le chat
    toggleBtn.addEventListener('click', () => {
        windowEl.classList.toggle('chat-open');
        if (windowEl.classList.contains('chat-open')) {
            input.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('chat-open');
    });

    // Envoyer message (clic ou Entrée)
    sendBtn.addEventListener('click', envoyerMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') envoyerMessage();
    });

    function envoyerMessage() {
        const question = input.value.trim();
        if (!question) return;

        // Afficher message utilisateur
        ajouterMessage('user', question);
        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        // Afficher indicateur de chargement
        const loadingId = ajouterMessage('loading', '...');

        // Appeler l'API
        fetch('../back/chatbot_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        })
        .then(r => r.json())
        .then(data => {
            // Supprimer le loading
            document.getElementById(loadingId)?.remove();
            
            if (data.success) {
                ajouterMessage('bot', data.answer);
            } else {
                ajouterMessage('bot', '❌ Désolé, une erreur est survenue. Réessaie plus tard.');
            }
        })
        .catch(err => {
            document.getElementById(loadingId)?.remove();
            ajouterMessage('bot', '❌ Erreur de connexion. Vérifie ta connexion internet.');
            console.error(err);
        })
        .finally(() => {
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        });
    }

    function ajouterMessage(type, texte) {
        const id = 'msg-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = type === 'loading' ? 'msg-loading' : `msg-${type}`;

        if (type === 'user') {
            div.innerHTML = `
                <div class="msg-bubble">${escapeHtml(texte)}</div>
                <div class="msg-avatar">👤</div>
            `;
        } else if (type === 'bot') {
            div.innerHTML = `
                <div class="msg-avatar">🤖</div>
                <div class="msg-bubble">${escapeHtml(texte)}</div>
            `;
        } else {
            div.innerHTML = `<div class="msg-bubble"><span class="typing">...</span></div>`;
        }

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return id;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});