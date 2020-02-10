class Note {
    constructor(id = null, title = '', content = '') {

        const element = this.element = document.createElement('div');

        element.classList.add('task-manager__note-wrap');
        element.setAttribute('draggable', 'true');

        element.innerHTML =
            '<span contenteditable="false" style="color: #EEEEEE;">Заголовок задачи:</span>\n' +
            '<div class="note__title"></div>\n' +
            '<span contenteditable="false">Описание задачи:</span>\n' +
            '<div class="editable__wrap">\n' +
            '<div class="text_editor-panel">\n' +
            '<button class="panel__bold">B</button>\n' +
            '<button class="panel__italic">I</button>\n' +
            '<button class="panel__list">Ul</button>\n' +
            '</div>\n' +
            '<div class="note__description"></div>\n' +
            '</div>\n' +
            '<span class="burger__wrap"></span>';

        const elementTitle = element.querySelector('.note__title');
        const elementDescription = element.querySelector('.note__description');

        const editableWrap = document.querySelector('.editable__wrap');

        const boldButton = element.querySelector('.panel__bold');
        const italicButton = element.querySelector('.panel__italic');
        const listButton = element.querySelector('.panel__list');

        elementTitle.textContent = title;
        elementDescription.innerHTML = content;

        const calendar = new Calendar;
        element.append(calendar.element);

        const timer = new Timer;
        element.append(timer.element);

        const menu = new TaskMenu;

        const menuTask = element.querySelector('.burger__wrap');

        menuTask.addEventListener('click', () => {
            menuTask.append(menu.element);
            const taskMenu = document.querySelector('.task__menu');
            menuTask.classList.toggle('_opened');

            setTimeout(() => {
                taskMenu.classList.toggle('_active');

                setTimeout(() => {
                    if (!taskMenu.classList.contains('_active')) {
                        taskMenu.remove();
                    }
                }, 200)

                }, 100);
        });

        if (id) {
            element.setAttribute('data-note-id', id);
        } else {
            element.setAttribute('data-note-id', Note.IdCounter);
            Note.IdCounter++;
        }

        elementTitle.addEventListener('dblclick', (evt) => {
            elementTitle.setAttribute('contenteditable', 'true');
            element.removeAttribute('draggable');
            element.closest('.task-manager__column').removeAttribute('draggable');
            elementTitle.focus();
        });

        elementDescription.addEventListener('dblclick', (evt) => {
            elementDescription.setAttribute('contenteditable', 'true');
            element.removeAttribute('draggable');
            element.closest('.task-manager__column').removeAttribute('draggable');
            elementDescription.focus();
        });

        elementTitle.addEventListener('blur', () => {
            elementTitle.removeAttribute('contenteditable');
            elementDescription.removeAttribute('contenteditable');

            this.checkForEmptiness(elementTitle, element);
        });

        // elementDescription.addEventListener('blur', () => {
        //     elementTitle.removeAttribute('contenteditable');
        //     elementDescription.removeAttribute('contenteditable');
        //
        //     this.checkForEmptiness(elementDescription, element);
        // });

        element.addEventListener('dragstart', this.dragstart.bind(this));
        element.addEventListener('dragend', this.dragend.bind(this));
        element.addEventListener('dragenter', this.dragenter.bind(this));
        element.addEventListener('dragover', this.dragover.bind(this));
        element.addEventListener('dragleave', this.dragleave.bind(this));
        element.addEventListener('drop', this.drop.bind(this));

        boldButton.addEventListener('click', this.editingBold.bind(this));
        italicButton.addEventListener('click', this.editingItalic.bind(this));
        listButton.addEventListener('click', this.editingList.bind(this));
    }

    editingBold () {
        document.execCommand('Bold');
        App.save();
    }
    editingItalic () {
        document.execCommand('Italic');
        App.save();
    }
    editingList () {
        document.execCommand('insertUnorderedList');
        App.save();
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
        document.querySelectorAll('.task-manager__note-wrap')
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
            const note = Array.from(this.element.parentElement.querySelectorAll('.task-manager__note-wrap'));
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