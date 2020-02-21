class Note {
    constructor(id = null, title = '', content = '') {

        const element = this.element = document.createElement('div');

        element.classList.add('task-manager__note-wrap');
        element.setAttribute('draggable', 'true');

        element.innerHTML =
            '<span class="note__background" contenteditable="false"><img src="image/background_03.png" alt=""></span>\n' +
            '<div class="note-title__wrap">\n' +
            '<div class="note__title"></div>\n' +
            '<span class="far fa-edit _note-title"></span>\n' +
            '</div>\n' +
            '<span contenteditable="false">Описание задачи:</span>\n' +
            '<div class="editable__wrap">\n' +
            '<div class="text_editor-panel">\n' +
            '<button class="bold"><i class="fas fa-bold"></i></button>\n' +
            '<button class="italic"><i class="fas fa-italic"></i></button>\n' +
            '<button class="list"><i class="fas fa-list-ul"></i></button>\n' +
            '<button class="justifyCenter"><i class="fas fa-align-center"></i></button>\n' +
            '<button class="justifyFull"><i class="fas fa-align-justify"></i></button>\n' +
            '<button class="justifyLeft"><i class="fas fa-align-left"></i></button>\n' +
            '<button class="justifyRight"><i class="fas fa-align-right"></i></button>\n' +
            '<span class="far fa-edit _note-description"></span>\n' +
            '</div>\n' +
            '<div class="note__description"></div>\n' +
            '</div>\n' +
            '<span class="burger__wrap"></span>';

        const elementTitle = element.querySelector('.note__title');
        const elementDescription = element.querySelector('.note__description');

        const enableEditTitleButton = element.querySelector('.fa-edit._note-title');
        const enableEditDescriptionButton = element.querySelector('.fa-edit._note-description');
        const editContentTitle = element.querySelector('.note-title__wrap');
        const editContentDescription = element.querySelector('.editable__wrap');

        const boldButton = element.querySelector('.bold');
        const italicButton = element.querySelector('.italic');
        const listButton = element.querySelector('.list');
        const justifyCenter = element.querySelector('.justifyCenter');
        const justifyFull = element.querySelector('.justifyFull');
        const justifyLeft = element.querySelector('.justifyLeft');
        const justifyRight = element.querySelector('.justifyRight');

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
            Note.IdCounter++;
        } else {
            element.setAttribute('data-note-id', Note.IdCounter);
            Note.IdCounter++;
        }

        //редактирование заголовка карточки
        editContentTitle.addEventListener('mouseenter', () => {
            enableEditTitleButton.style.opacity = '1';
        });

        enableEditTitleButton.addEventListener('click', () => {
            enableEditTitleButton.style.opacity = '0';
            elementTitle.setAttribute('contenteditable', 'true');
            element.closest('.task-manager__column').removeAttribute('draggable');
            elementTitle.focus();
            element.removeAttribute('draggable');
            const editTitleSucces = document.createElement('div');
            editTitleSucces.classList.add('button-edit__title');
            editTitleSucces.textContent = 'Сохранить изминения';
            editContentTitle.append(editTitleSucces);

            if (elementTitle.hasAttribute('contenteditable')) {
                enableEditTitleButton.style.display = 'none';
            }

            editTitleSucces.addEventListener('click', () => {
                elementTitle.removeAttribute('contenteditable');
                elementTitle.blur();
                this.checkForEmptiness(elementTitle, element);
                editTitleSucces.remove();
                enableEditTitleButton.style.display = 'block';
            });
        });

        editContentTitle.addEventListener('mouseleave', () => {
            enableEditTitleButton.style.opacity = '0';
        });

        //редактирование описания карточки
        editContentDescription.addEventListener('mouseenter', () => {
            enableEditDescriptionButton.style.opacity = '1';
        });

        enableEditDescriptionButton.addEventListener('click', () => {
            enableEditDescriptionButton.style.opacity = '0';
            elementDescription.setAttribute('contenteditable', 'true');
            element.removeAttribute('draggable');
            element.closest('.task-manager__column').removeAttribute('draggable');
            elementDescription.focus();

            const editDescriptionSucces = document.createElement('div');
            editDescriptionSucces.classList.add('button-edit__description');
            editDescriptionSucces.textContent = 'Сохранить изминения';
            editContentDescription.append(editDescriptionSucces);

            if (elementDescription.hasAttribute('contenteditable')) {
                enableEditDescriptionButton.style.display = 'none';
            }

            editDescriptionSucces.addEventListener('click', () => {
                elementDescription.removeAttribute('contenteditable');
                elementDescription.blur();
                this.checkForEmptiness(elementDescription, element);
                editDescriptionSucces.remove();
                enableEditDescriptionButton.style.display = 'block';
            });
        });

        editContentDescription.addEventListener('mouseleave', () => {
            enableEditDescriptionButton.style.opacity = '0';
        });

        element.addEventListener('dragstart', this.dragstart.bind(this));
        element.addEventListener('dragend', this.dragend.bind(this));
        element.addEventListener('dragenter', this.dragenter.bind(this));
        element.addEventListener('dragover', this.dragover.bind(this));
        element.addEventListener('dragleave', this.dragleave.bind(this));
        element.addEventListener('drop', this.drop.bind(this));

        boldButton.addEventListener('click', this.editingBold.bind(this));
        italicButton.addEventListener('click', this.editingItalic.bind(this));
        listButton.addEventListener('click', this.editingList.bind(this));
        justifyCenter.addEventListener('click', this.editingjustifyCenter.bind(this));
        justifyFull.addEventListener('click', this.editingjustifyFull.bind(this));
        justifyLeft.addEventListener('click', this.editingjustifyLeft.bind(this));
        justifyRight.addEventListener('click', this.editingjustifyRight.bind(this));
    }

    editingBold (evt) {
        evt.preventDefault();
        document.execCommand('Bold');
        App.save();
    }

    editingItalic (evt) {
        evt.preventDefault();
        document.execCommand('Italic');
        App.save();
    }

    editingList (evt) {
        evt.preventDefault();
        document.execCommand('insertUnorderedList');
        App.save();
    }

    editingjustifyCenter (evt) {
        evt.preventDefault();
        document.execCommand('justifyCenter');
        App.save();
    }

    editingjustifyFull (evt) {
        evt.preventDefault();
        document.execCommand('justifyFull');
        App.save();
    }

    editingjustifyLeft (evt) {
        evt.preventDefault();
        document.execCommand('justifyLeft');
        App.save();
    }

    editingjustifyRight (evt) {
        evt.preventDefault();
        document.execCommand('justifyRight');
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
        console.log('add class')
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
        console.log('remove class');
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