async function addNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    try {
        await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });
        
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        loadNotes();
    } catch (err) {
        console.error('Error adding note:', err);
    }
}

async function loadNotes() {
    try {
        const response = await fetch('/api/notes');
        const notes = await response.json();
        const container = document.getElementById('notesContainer');
        
        container.innerHTML = notes.map(note => `
            <div class="note" id="note-${note._id}">
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <small>${new Date(note.created).toLocaleString()}</small>
                <button class="delete-btn" onclick="deleteNote('${note._id}')">Delete</button>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading notes:', err);
    }
}


async function deleteNote(id) {
    try {
        await fetch(`/api/notes/${id}`, {
            method: 'DELETE'
        });
        loadNotes();
    } catch (err) {
        console.error('Error deleting note:', err);
    }
}

// Load notes when page loads
document.addEventListener('DOMContentLoaded', loadNotes);