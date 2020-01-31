class Note {
    constructor(id = null, title = '', content = '') {

        const element = this.element = document.createElement('div');

        element.classList.add('note');
        element.setAttribute('draggable', 'true');

        //создаем календарь из модуля calendar.js
        const date = new Calendar;
        element.append(date.element);
        //создаем структуру карточки задачи
        const elementTitle = document.createElement('div');
        elementTitle.classList.add('note__title');
        elementTitle.textContent = title;
        element.append(elementTitle);
        const descriptionSpan = document.createElement('span');
        descriptionSpan.textContent = 'Описание:';
        descriptionSpan.setAttribute('contenteditable', 'false');
        element.append(descriptionSpan);
        const elementDescription = document.createElement('div');
        elementDescription.classList.add('note__description');
        element.append(elementDescription);
        elementDescription.textContent = content;
        //создаем таймер из модуля timer.js
        const timer = new Timer;
        element.append(timer.element);

        if (id) {
            element.setAttribute('data-note-id', id);
        } else {
            element.setAttribute('data-note-id', Note.IdCounter);
            Note.IdCounter++;
        }

        element.addEventListener('dblclick', (evt) => {
            elementTitle.setAttribute('contenteditable', 'true');
            elementDescription.setAttribute('contenteditable', 'true');
            element.removeAttribute('draggable');
            element.closest('.task-manager__column').removeAttribute('draggable');
            element.focus();
        });


        element.addEventListener('contextmenu', (evt) => {
            evt.preventDefault();

            if (document.querySelector('.right-menu')) {
                document.querySelector('.right-menu').remove();
            }

            const rightMenu = document.createElement('div');
            rightMenu.classList.add('right-menu');
            element.append(rightMenu);
            const detailSpanMenu = document.createElement('span');
            detailSpanMenu.textContent = 'Просмотреть';
            rightMenu.append(detailSpanMenu);
            const editSpanMenu = document.createElement('span');
            editSpanMenu.textContent = 'Редактировать';
            rightMenu.append(editSpanMenu);
            const deleteSpanMenu = document.createElement('span');
            deleteSpanMenu.textContent = 'Удалить';
            rightMenu.append(deleteSpanMenu);
            rightMenu.style = 'top:' + evt.pageY + 'px; left:' + evt.pageX + 'px;';

            editSpanMenu.addEventListener('click', () => {
                elementTitle.setAttribute('contenteditable', 'true');
                elementDescription.setAttribute('contenteditable', 'true');
                element.removeAttribute('draggable');
                element.closest('.task-manager__column').removeAttribute('draggable');
                elementTitle.focus();
                rightMenu.remove();
                App.save()
            });

            deleteSpanMenu.addEventListener('click', () => {
                element.remove();
                App.save()
            });

            document.addEventListener('click', () => {
                rightMenu.remove();
            });
        });

        elementTitle.addEventListener('blur', () => {
            elementTitle.removeAttribute('contenteditable');
            elementDescription.removeAttribute('contenteditable');

            this.checkForEmptiness(elementTitle, element);
        });

        elementDescription.addEventListener('blur', () => {
            elementTitle.removeAttribute('contenteditable');
            elementDescription.removeAttribute('contenteditable');

            this.checkForEmptiness(elementDescription, element);
        });

        element.addEventListener('dragstart', this.dragstart.bind(this));
        element.addEventListener('dragend', this.dragend.bind(this));
        element.addEventListener('dragenter', this.dragenter.bind(this));
        element.addEventListener('dragover', this.dragover.bind(this));
        element.addEventListener('dragleave', this.dragleave.bind(this));
        element.addEventListener('drop', this.drop.bind(this));
    }

    checkForEmptiness (elementName, element) {
        element.setAttribute('draggable', 'true');
        element.closest('.task-manager__column').setAttribute('draggable', 'true');

        if (!elementName.textContent.trim().length) {
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