class Note {
    constructor(id = null, content = '') {

        const element = this.element = document.createElement('div');

        element.classList.add('note');
        element.setAttribute('draggable', 'true');
        element.textContent = content;

        if (id) {
            element.setAttribute('data-note-id', id);
        } else {
            element.setAttribute('data-note-id', Note.IdCounter);
            Note.IdCounter++;
        }

        element.addEventListener('dblclick', (evt) => {
            this.editNote(element);
        });


        element.addEventListener('contextmenu', (evt) => {
            evt.preventDefault();

            if (document.querySelector('.right-menu')) {
                document.querySelector('.right-menu').remove();
            }

            const rightMenu = document.createElement('div');
            rightMenu.classList.add('right-menu');
            element.append(rightMenu);
            const editSpanMenu = document.createElement('span');
            editSpanMenu.textContent = 'Редактировать';
            rightMenu.append(editSpanMenu);
            const deleteSpanMenu = document.createElement('span');
            deleteSpanMenu.textContent = 'Удалить';
            rightMenu.append(deleteSpanMenu);
            rightMenu.style = 'top:' + evt.pageY + 'px; left:' + evt.pageX + 'px;';

            editSpanMenu.addEventListener('click', () => {
                this.editNote(element);
                rightMenu.remove();
            });

            deleteSpanMenu.addEventListener('click', () => {
                element.remove();
            });

            document.addEventListener('click', () => {
                rightMenu.remove();
            });
        });

        element.addEventListener('blur', (evt) => {
            this.editCard(element);
        });

        element.addEventListener('keydown', (evt) => {
            if (evt.keyCode === 13) {
                this.editCard(element);
            }
        });

        element.addEventListener('dragstart', this.dragstart.bind(this));
        element.addEventListener('dragend', this.dragend.bind(this));
        element.addEventListener('dragenter', this.dragenter.bind(this));
        element.addEventListener('dragover', this.dragover.bind(this));
        element.addEventListener('dragleave', this.dragleave.bind(this));
        element.addEventListener('drop', this.drop.bind(this));
    }

    editNote (element) {
        element.setAttribute('contenteditable', 'true');
        element.removeAttribute('draggable');
        element.closest('.column').removeAttribute('draggable');
        element.focus();
    }

    editCard (element) {
        element.removeAttribute('contenteditable');
        element.setAttribute('draggable', 'true');
        element.closest('.column').setAttribute('draggable', 'true');
        if (!element.textContent.trim().length) {
            element.remove();
        }
        App.save();
    }

    dragstart(evt) {
        evt.stopPropagation();
        Note.dragged = this.element;
        this.element.classList.add('dragged');
    }

    dragend(evt) {
        evt.stopPropagation();
        Note.dragged = null;
        this.element.classList.remove('dragged');
        document.querySelectorAll('.note')
            .forEach(element => element.classList.remove('under'));

        App.save();
    }

    dragenter(evt) {
        if (!Note.dragged || this.element === Note.dragged) {
            return
        }
        this.element.classList.add('under');
    }

    dragover(evt) {
        evt.preventDefault();
        if (!Note.dragged || this.element === Note.dragged) {
            return;
        }
    }

    dragleave(evt) {
        if (!Note.dragged || this.element === Note.dragged) {
            return;
        }
        this.element.classList.remove('under');
    }

    drop(evt) {
        evt.stopPropagation();

        if (!Note.dragged || this.element === Note.dragged) {
            return;
        }

        if (this.element.parentElement === Note.dragged.parentElement) {
            const note = Array.from(this.element.parentElement.querySelectorAll('.note'));
            const indexThis = note.indexOf(this.element);
            const indexDragged = note.indexOf(Note.dragged);

            if (indexThis < indexDragged) {
                this.element.parentElement.insertBefore(Note.dragged, this.element);
            } else {
                this.element.parentElement.insertBefore(Note.dragged, this.element.nextElementSibling);
            }
        } else {
            this.element.parentElement.insertBefore(Note.dragged, this.element);
        }
    }
}

Note.IdCounter = 1;
Note.dragged = null;