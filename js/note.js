class Note {
    constructor(id = null, title = '', content = '') {

        const element = this.element = document.createElement('div');

        element.classList.add('task-manager__note-wrap');
        element.setAttribute('draggable', 'true');

        element.innerHTML =
            '<span class="note__background" contenteditable="false"><img src="image/background_03.png" alt=""></span>\n' +
            '<div class="note-title__wrap">\n' +
            '<div class="note__title"></div>\n' +
            '<div class="title__width-calculate"></div>\n' +
            '<span class="material-icons _edit--note-title">more_vert</span>\n' +
            '</div>\n' +
            '<span contenteditable="false">Описание задачи:</span>\n' +
            '<div class="description__collapse collapse"><span>Свернуть описание</span><i class="material-icons">expand_less</i></div>\n' +
            '<div class="editable__wrap">\n' +
            '<span class="material-icons _edit--note-description">more_vert</span>\n' +
            '<div class="note__description"></div>\n' +
            '</div>\n' +
            '<span class="burger__wrap"></span>';

        const elementTitle = element.querySelector('.note__title');
        const elementTitleHidden = element.querySelector('.title__width-calculate');
        const elementDescription = element.querySelector('.note__description');

        const enableEditTitleButton = element.querySelector('._edit--note-title');
        const enableEditDescriptionButton = element.querySelector('._edit--note-description');
        const editContentTitle = element.querySelector('.note-title__wrap');
        const editContentDescription = element.querySelector('.editable__wrap');

        const descriptionCollapse = element.querySelector('.description__collapse');

        elementTitle.textContent = title;
        elementDescription.innerHTML = content;

        const editPanel = new EditPanel;

        // const calendar = new Calendar;
        // element.append(calendar.element);

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

        document.addEventListener("DOMContentLoaded", () => {
            this.activateCollapseLine (elementDescription, descriptionCollapse, 0.04);
        });

        //создаем экземпляр наблюдателя

        // let observer = new MutationObserver((mutations) => {
        //     console.log(mutations);
        //     for (let mutation of mutations) {
        //         if (mutation.type == 'childList') {
        //             console.log('Было изминение или удаление потомка из DOM')
        //         } else if (mutation.type == 'attributeFilter') {
        //             console.log('Произошло добавление стилей потомкам DOM')
        //         }
        //     }
        // });
        //
        // const config = {
        //     childList: true,
        //     attributeFilter: ['style'],
        //     subtree: true
        // };
        //
        // observer.observe(elementDescription, config);

        elementDescription.addEventListener('DOMSubtreeModified', () => {
            this.activateCollapseLine (elementDescription, descriptionCollapse, 0.04);
        });

        // elementDescription.addEventListener('keydown', (evt) => {
        //     if (evt.keyCode == 13) {
        //         document.execCommand("defaultParagraphSeparator", false, "p");
        //     }
        // });

        //редактирование заголовка карточки
        editContentTitle.addEventListener('mouseenter', () => {
            enableEditTitleButton.style.opacity = '1';
        });

        enableEditTitleButton.addEventListener('click', () => {
            elementTitle.setAttribute('contenteditable', 'true');
            element.closest('.task-manager__column').removeAttribute('draggable');
            elementTitle.focus();
            element.removeAttribute('draggable');

            editContentTitle.style = 'margin-top: 50px;margin-bottom: 70px;transition: 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);';

            //создаем кнопку сохранить изминения в заголвоке
            const buttonSaveEditTitle = document.createElement('div');
            buttonSaveEditTitle.classList.add('button-save__title');
            buttonSaveEditTitle.innerHTML = '<i class="material-icons">save</i><span>Сохранить изменения</span>';
            editContentTitle.append(buttonSaveEditTitle);

            setTimeout(() => {
                buttonSaveEditTitle.style.opacity = '1';
            }, 500);

            //прячем карандашик, если поле редактируется
            if (elementTitle.hasAttribute('contenteditable')) {
                enableEditTitleButton.style.display = 'none';
            }

            //странная валидация, но я так хочу
            elementTitle.addEventListener('input', () => {

                let elementTitleContent = elementTitle.textContent;

                elementTitleHidden.textContent = elementTitleContent;

                //50 корректирующее значение
                let elementTitleHiddenWidthSize = elementTitleHidden.getBoundingClientRect().width + 50;
                let elementTitleWidthSize = elementTitle.getBoundingClientRect().width;

                //Условие проверяет длинну скрытого поля и сравниет с полем заголовка и запрещает ввод
                if (elementTitleHiddenWidthSize > elementTitleWidthSize) {
                    buttonSaveEditTitle.style.pointerEvents = 'none';
                    elementTitle.addEventListener('keydown', this.removingPreventKeyBoard);

                    elementTitle.addEventListener('keydown', (evt) => {
                        if (evt.keyCode == 8 || evt.keyCode == 37){
                            elementTitle.removeEventListener('keydown', this.removingPreventKeyBoard);
                        }
                        elementTitle.removeEventListener('input', this.createErrorMessage);
                    });

                    //вызываем функцию с ошибкой
                    this.createErrorMessage (elementTitle)

                } else {
                    //если заголовок удовлетворяет условиям разрешаем сохранить изменения
                    buttonSaveEditTitle.style.pointerEvents = null;
                    elementTitle.removeEventListener('keydown', this.removingPreventKeyBoard);
                }
            });

            //событие приминения изминений и сохранение в local Storage
            buttonSaveEditTitle.addEventListener('click', () => {
                elementTitle.removeAttribute('contenteditable');
                elementTitle.blur();
                this.checkForEmptiness(elementTitle, element);
                buttonSaveEditTitle.style.opacity = '0';
                setTimeout(() =>{
                    editContentTitle.style = 'margin-top: 80px;margin-bottom: 40px;transition: 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);';
                },150);
                setTimeout(() => {
                    buttonSaveEditTitle.remove();
                }, 200);
                enableEditTitleButton.style.opacity = '0';
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
            elementDescription.style = 'padding-top: 60px; padding-bottom: 60px;';

            element.querySelector('.description__collapse').style.pointerEvents = 'none';

            editContentDescription.insertBefore(editPanel.element, elementDescription);
            setTimeout(() => {editPanel.element.style.opacity = '1';}, 200);

            elementDescription.setAttribute('contenteditable', 'true');
            element.removeAttribute('draggable');
            element.closest('.task-manager__column').removeAttribute('draggable');
            elementDescription.focus();

            const buttonSaveEditDescription = document.createElement('div');
            buttonSaveEditDescription.classList.add('button-save__description');
            buttonSaveEditDescription.innerHTML = '<i class="material-icons">save</i><span>Сохранить изменения</span>';
            editContentDescription.append(buttonSaveEditDescription);
            setTimeout(() => {
                buttonSaveEditDescription.style.opacity = '1';
            }, 200);

            if (elementDescription.hasAttribute('contenteditable')) {
                enableEditDescriptionButton.style.display = 'none';
            }

            buttonSaveEditDescription.addEventListener('click', () => {
                setTimeout(() => {
                    elementDescription.style.paddingTop = null;
                    elementDescription.style.paddingBottom = null
                }, 200);

                element.querySelector('.description__collapse').style.pointerEvents = null;

                editPanel.element.style.opacity = '0';
                setTimeout(() => {editPanel.element.remove()},200);
                elementDescription.removeAttribute('contenteditable');
                elementDescription.blur();
                buttonSaveEditDescription.style.opacity = '0';
                setTimeout(() => {
                    buttonSaveEditDescription.remove();
                }, 200);
                enableEditDescriptionButton.style.opacity = '0';
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
    }

    activateCollapseLine (descriptionElement, buttonCollapse, animationSpeed) {
        let childArray = [];
        let childrenElement = descriptionElement.querySelectorAll('*');

        let countArray;

        let totalHeight;

        childrenElement.forEach((item) => {
            let childrenElementHeight = item.getBoundingClientRect().height;
            childArray.push(childrenElementHeight);
            totalHeight = childArray.reduce(function(a, b) {
                return a + b;
            });

            if (totalHeight > 200){
                buttonCollapse.style = 'display: flex;';
                setTimeout(() => {
                    buttonCollapse.style = 'display: flex;opacity: 1; transition: 0.3s;';
                }, 200);
            } else {
                buttonCollapse.style = 'opacity: 0;transition: 0.3s;';
                setTimeout(() => {
                    buttonCollapse.style = 'display: none;';
                }, 200);
            }
        });

        buttonCollapse.addEventListener('click', () => {
            if (buttonCollapse.classList.contains('collapse')) {
                this.element.querySelector('._edit--note-description').style.display = 'none';

                buttonCollapse.classList.add('extend');
                buttonCollapse.classList.remove('collapse');
                buttonCollapse.innerHTML = '<span>Развернуть описание</span><i class="material-icons">expand_more</i>';

                for (let i = 0; i < childrenElement.length; ++i) {
                    countArray = childrenElement.length;
                    childrenElement[i].style = 'opacity: 0; transition:' + animationSpeed * (countArray - i) + 's; transition-delay:' + animationSpeed * (countArray - i) + 's;';
                }

            } else if (buttonCollapse.classList.contains('extend')) {
                this.element.querySelector('._edit--note-description').style.display = null;

                buttonCollapse.classList.add('collapse');
                buttonCollapse.classList.remove('extend');
                buttonCollapse.innerHTML = '<span>Свернуть описание</span><i class="material-icons">expand_less</i>';

                for (let i = 0; i < childrenElement.length; ++i) {
                    childrenElement[i].style = 'opacity: 1; transition:' + animationSpeed * i + 's;transition-delay:' + animationSpeed * i + 's;';
                }
            }
        });
    }

    extendCollapseDescription (descriptionElement, buttonCollapse, animationSpeed) {
        let childrenElement = descriptionElement.querySelectorAll('*');
    }

    createErrorMessage (titleSelector) {
        //считаем кол-во символов в строке
        let charsCount = titleSelector.textContent.length;
        //создаем сообщение об ошибке и анимацию
        const errorMessage = document.createElement('span');
        errorMessage.classList.add('error__message');
        errorMessage.textContent = 'Достигнута максимальная длинна зоголовка ( Всего символов ' + charsCount + ')';
        titleSelector.insertAdjacentElement('afterend', errorMessage);

        //отрисовыеем сообщение об ошибке
        setTimeout(() => {
            errorMessage.style.opacity = '1';
            //задержка показа сообщения об ошибке
            setTimeout(() => {
                errorMessage.style.opacity = null;
                //задержка перед удалением ссобщения из DOM чтобы все плавненько
                setTimeout(() => {
                    errorMessage.remove();
                },3200);
            }, 3000);
        }, 200);
    }

    removingPreventKeyBoard (evt) {
        evt.preventDefault();
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