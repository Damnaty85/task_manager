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
            '<i class="material-icons _column--delete" title="Удалить список">delete</i>\n' +
            '<div class="column__header--wrap">\n' +
            '<span class="column__header"></span>\n' +
            '<span class="material-icons _edit--column-title">more_vert</span>\n' +
            '</div>\n' +
            '<div class="column__body"></div>\n' +
            '<p class="column__footer">\n' +
            '<span data-action-addNote class="action"><i class="material-icons">add</i> Создать задачу</span>\n' +
            '</p>';

        element.querySelector('.column__header').textContent = title;

        const spanActionAddNote = element.querySelector('[data-action-addNote]');

        const columnHeaderWrap = element.querySelector('.column__header--wrap');
        const enableEditTitleColumnButton = element.querySelector('._edit--column-title');
        const headerElement = element.querySelector('.column__header');

        spanActionAddNote.addEventListener('click', (evt) => {
            const note = new Note;
            instance.add(note);

            //имитация клика по кнопке редактирвоания поля заголовка
            note.element.querySelector('.fa-edit._note-title').click();

            const noteTitle = note.element.querySelector('.note__title');

            noteTitle.style.opacity = '1';
            noteTitle.setAttribute('contenteditable', 'true');
            noteTitle.focus();
        });

        const deleteColumn = element.querySelector('._column--delete');

        deleteColumn.addEventListener('click',() => {
            if (this.notes.length >= 2){
                const warningWindow = document.createElement('div');
                warningWindow.classList.add('warning__container');
                document.querySelector('.task-manager').append(warningWindow);
                warningWindow.innerHTML =
                    '<div class="warning__wrap">\n' +
                    '    <div class="warning__title">\n' +
                    '        <p>Вы действительно хотите удалить список?</p>\n' +
                    '        <p>Все задачи в списке будут удалены</p>\n' +
                    '    </div>\n' +
                    '    <div class="warning__variant">\n' +
                    '        <span class="warning__yes">Да</span>\n' +
                    '        <span class="warning__no">Нет</span>\n' +
                    '    </div>\n' +
                    '</div>';

                document.querySelector('.warning__yes').addEventListener('click', () => {
                    warningWindow.remove();
                    element.classList.add('delete-column');
                    setTimeout( () => {
                        element.remove();
                        App.save();
                    }, 500);
                });

                document.querySelector('.warning__no').addEventListener('click', () => {
                    warningWindow.remove();
                });
            } else {
                element.classList.add('delete-column');
                setTimeout( () => {
                    element.remove();
                    App.save();
                }, 500);
            }

        });

        //показываем кнопку редактирования при наведении
        columnHeaderWrap.addEventListener('mouseenter', () => {
            enableEditTitleColumnButton.style.opacity = '1';
        });

        //редактирование заголовка списка задач
        enableEditTitleColumnButton.addEventListener('click', () => {
            headerElement.setAttribute('contenteditable', 'true');
            element.removeAttribute('draggable');
            headerElement.focus();

            columnHeaderWrap.style ='margin-bottom:70px;margin-top:20px;transition: 0.5s all cubic-bezier(0.18, 0.89, 0.32, 1.28);';

            //создаем кнопку сохранения результата
            const buttonSaveEditTitleColumn = document.createElement('div');
            buttonSaveEditTitleColumn.classList.add('button-save__column');
            buttonSaveEditTitleColumn.innerHTML = '<i class="material-icons">save</i><span>Сохранить изменения</span>';
            columnHeaderWrap.append(buttonSaveEditTitleColumn);

            setTimeout(() => {
                buttonSaveEditTitleColumn.style.opacity = '1';
            }, 200);

            if (headerElement.hasAttribute('contenteditable')) {
                enableEditTitleColumnButton.style.display = 'none';
            }

            //событие кнопки сохранения результата
            buttonSaveEditTitleColumn.addEventListener('click', () => {
                buttonSaveEditTitleColumn.style.opacity = '0';
                setTimeout(() => {
                    buttonSaveEditTitleColumn.remove();
                }, 200);
                setTimeout(() => {
                    columnHeaderWrap.style ='margin-top:20px;margin-bottom:40px;transition: 0.5s all cubic-bezier(0.18, 0.89, 0.32, 1.28);';
                },150);
                headerElement.removeAttribute('contenteditable');

                enableEditTitleColumnButton.style.opacity = '0';
                enableEditTitleColumnButton.style.display = 'block';

                if (!headerElement.textContent.trim().length) {
                    element.remove();
                }
                element.setAttribute('draggable', 'true');
                App.save();
            });
        });

        //убираем кнопку редактирования при потере наведении
        columnHeaderWrap.addEventListener('mouseleave', () => {
            enableEditTitleColumnButton.style.opacity = '0';
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