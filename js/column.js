class Column {
    constructor (id = null, title = '') {
        const instance = this;
        this.notes = [];

        const element = this.element = document.createElement('div');
        element.classList.add('task-manager__column');
        element.setAttribute('draggable', 'true');

        if (id) {
            element.setAttribute('data-column-id', id);
        } else {
            element.setAttribute('data-column-id', Column.IdCounter);
            Column.IdCounter++;
        }

        element.innerHTML =
            '<span class="column__close" title="Удалить список">+</span>\n' +
            '<p class="column__header"></p>\n' +
            '<div class="column__body"></div>\n' +
            '<p class="column__footer">\n' +
            '<span data-action-addNote class="action"> + Создать задачу</span>\n' +
            '</p>';

        element.querySelector('.column__header').textContent = title;

        const spanActionAddNote = element.querySelector('[data-action-addNote]');

        spanActionAddNote.addEventListener('click', (evt) => {
            const note = new Note;
            instance.add(note);

            const noteTitle = note.element.querySelector('.note__title');

            noteTitle.setAttribute('contenteditable', 'true');
            noteTitle.focus();

        });

        const deleteColumn = element.querySelector('.column__close');

        deleteColumn.addEventListener('click',() => {
            element.classList.add('delete-column');
            setTimeout( () => {
                element.remove();
                App.save();
            }, 500);
        });

        const headerElement = element.querySelector('.column__header');

        headerElement.addEventListener('dblclick', (evt) => {
            headerElement.setAttribute('contenteditable', 'true');
            headerElement.focus();
            App.save();
        });

        headerElement.addEventListener('blur', (evt) => {
            headerElement.removeAttribute('contenteditable');

            if (!headerElement.textContent.trim().length) {
                element.remove();
            }

            App.save();
        });

        element.addEventListener('dragstart', this.dragstart.bind(this));
        element.addEventListener('dragend', this.dragend.bind(this));
        element.addEventListener('dragenter', this.dragenter.bind(this));
        element.addEventListener('dragleave', this.dragleave.bind(this));
        element.addEventListener('dragover', this.dragover.bind(this));
        element.addEventListener('drop', this.drop.bind(this))
    }

    add (...notes) {
        for (const note of notes) {
            if (!this.notes.includes(note)) {
                this.notes.push(note);

                this.element.querySelector('.column__body').append(note.element);
            }
        }
    }

    dragstart(evt) {
        evt.stopPropagation();
        Column.dragged = this.element;
        Column.dragged.classList.add('dragged');

        document.querySelectorAll('.task-manager__note-wrap')
            .forEach(noteElement => noteElement
                .removeAttribute('draggable'));
    }

    dragend(evt) {
        evt.stopPropagation();
        Column.dragged.classList.remove('dragged');
        Column.dragged = null;

        document.querySelectorAll('.task-manager__note-wrap')
            .forEach(noteElement => noteElement
                .setAttribute('draggable', 'true'));

        App.save();
    }

    dragenter(evt) {
        evt.stopPropagation();
        if (!Column.dragged || Column.dragged === this.element) {
            return false;
        }
        this.element.classList.add('_under');
    }

    dragleave(evt) {
        evt.stopPropagation();
        if (!Column.dragged || Column.dragged === this.element) {
            return false;
        }
        this.element.classList.remove('_under');
    }

    dragover(evt) {
        evt.preventDefault();
        if (!Column.dragged || Column.dragged === this.element) {
            return false;
        }
    }

    drop (evt) {
        evt.stopPropagation();

        if (Note.dragged) {
            return this.element.querySelector('.column__body').append(Note.dragged);
        } else if (Column.dragged) {
            const children = Array.from(document.querySelector('.task-manager__list').children);
            const indexThis = children.indexOf(this.element);
            const indexDragged = children.indexOf(Column.dragged);

            if (indexThis < indexDragged) {
                document.querySelector('.task-manager__list')
                    .insertBefore(Column.dragged, this.element);
            } else {
                document.querySelector('.task-manager__list')
                    .insertBefore(Column.dragged, this.element.nextElementSibling);
            }
        }
        this.element.classList.remove('_under');
    }
}

Column.IdCounter = 1;
Column.dragged = null;