class Column {
    constructor (id = null, title = '') {
        const instance = this;
        this.notes = [];

        const element = this.element = document.createElement('div');
        element.classList.add('column');
        element.setAttribute('draggable', 'true');

        if (id) {
            element.setAttribute('data-column-id', id);
        } else {
            element.setAttribute('data-column-id', Column.IdCounter);
            Column.IdCounter++;
        }

        const deleteElement = document.createElement('span');
        deleteElement.classList.add('column-close');
        deleteElement.textContent = '+';
        element.append(deleteElement);
        const columnHeader = document.createElement('p');
        columnHeader.classList.add('column-header');
        element.append(columnHeader);
        const noteWrap = document.createElement('div');
        noteWrap.classList.add('note-wrap');
        element.append(noteWrap);
        const columnFooter = document.createElement('p');
        columnFooter.classList.add('column-footer');
        element.append(columnFooter);
        columnFooter.innerHTML = '<span data-action-addNote class="action"> + Создать задачу</span>';


        element.querySelector('.column-header').textContent = title;

        const spanActionAddNote = element.querySelector('[data-action-addNote]');

        spanActionAddNote.addEventListener('click', (evt) => {
            const note = new Note;
            instance.add(note);

            const noteTitle = note.element.querySelector('.note__title');

            noteTitle.setAttribute('contenteditable', 'true');
            noteTitle.focus();

        });

        const deleteColumn = element.querySelector('.column-close');

        deleteColumn.addEventListener('click',() => {
            element.classList.add('delete-column');
            setTimeout( () => {
                element.remove();
                App.save();
            }, 500);
        });

        const headerElement = element.querySelector('.column-header');

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

                this.element.querySelector('.note-wrap').append(note.element);
            }
        }
    }

    dragstart(evt) {
        evt.stopPropagation();
        Column.dragged = this.element;
        Column.dragged.classList.add('dragged');

        document.querySelectorAll('.note')
            .forEach(noteElement => noteElement
                .removeAttribute('draggable'));
    }

    dragend(evt) {
        evt.stopPropagation();
        Column.dragged.classList.remove('dragged');
        Column.dragged = null;

        document.querySelectorAll('.note')
            .forEach(noteElement => noteElement
                .setAttribute('draggable', 'true'));

        App.save();
    }

    dragenter(evt) {
        evt.stopPropagation();
        if (!Column.dragged || Column.dragged === this.element) {
            return
        }
        this.element.classList.add('under');
    }

    dragleave(evt) {
        evt.stopPropagation();
        if (!Column.dragged || Column.dragged === this.element) {
            return
        }
        this.element.classList.remove('under');
    }

    dragover(evt) {
        evt.preventDefault();
        if (!Column.dragged || Column.dragged === this.element) {
            return
        }
    }

    drop (evt) {
        evt.stopPropagation();

        if (Note.dragged) {
            return this.element.querySelector('.note-wrap').append(Note.dragged);
        } else if (Column.dragged) {
            const children = Array.from(document.querySelector('.columns').children);
            const indexThis = children.indexOf(this.element);
            const indexDragged = children.indexOf(Column.dragged);

            if (indexThis < indexDragged) {
                document.querySelector('.columns')
                    .insertBefore(Column.dragged, this.element);
            } else {
                document.querySelector('.columns')
                    .insertBefore(Column.dragged, this.element.nextElementSibling);
            }
        }
        this.element.classList.remove('under');
    }
}

Column.IdCounter = 1;
Column.dragged = null;