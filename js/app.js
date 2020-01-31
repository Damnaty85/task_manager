const App = {
    save () {
        const object = {
            columns: {
                idCounter: Column.IdCounter,
                items: []
            },
            notes: {
                idCounter: Note.IdCounter,
                items: []
            }
        };

        document.querySelectorAll('.task-manager__column')
            .forEach(columnElement => {
                const column = {
                    id: parseInt(columnElement.getAttribute('data-column-id')),
                    title: columnElement.querySelector('.column__header').textContent,
                    noteIds: []
                };
                columnElement.querySelectorAll('.note')
                    .forEach(noteElement => {
                        column.noteIds.push(parseInt(noteElement.getAttribute('data-note-id')))
                    });

                object.columns.items.push(column);
        });

        document.querySelectorAll('.note')
            .forEach(noteElement => {
               const note = {
                   id: parseInt(noteElement.getAttribute('data-note-id')),
                   title: noteElement.querySelector('.note__title').textContent,
                   content: noteElement.querySelector('.note__description').textContent
               };

                object.notes.items.push(note)
            });

        const json = JSON.stringify(object);

        localStorage.setItem('Task Manager', json);
    },

    load () {
        if (!localStorage.getItem('Task Manager')) {
            return;
        }
        const clearColumn = document.querySelector('.task-manager__list');
        clearColumn.innerHTML = '';

        const object = JSON.parse(localStorage.getItem('Task Manager'));
        const getNoteById = id => object.notes.items.find(note => note.id === id);

        for (const {id, title, noteIds} of object.columns.items) {
            const column = new Column(id, title);

            clearColumn.append(column.element);

            for (const noteId of noteIds) {
                const {id, title, content} = getNoteById(noteId);
                const note = new Note(id, title, content);
                column.add(note);
            }
        }
    }
};