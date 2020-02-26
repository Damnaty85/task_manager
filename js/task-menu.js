class TaskMenu {
    constructor () {
        const element = this.element = document.createElement('span');

        element.classList.add('task__menu');

        element.innerHTML =
            // '<span class="detail__task">Посмотреть</span>\n' +
            // '<span class="edit__task">Редактировать</span>\n' +
            '<span class="remove__task">Удалить задачу</span>\n' +
            '</span>';

        // const detailTask = element.querySelector('.detail__task');
        // const editTask = element.querySelector('.edit__task');
        const removeTask = element.querySelector('.remove__task');

        // detailTask.addEventListener('click', this.openDetailTask.bind(this));
        // editTask.addEventListener('click', this.editedTask.bind(this));
        removeTask.addEventListener('click', this.removedTask.bind(this));
    }

    // openDetailTask () {
    //     console.log('detail task');
    // }
    //
    // editedTask () {
    //     console.log('edit task');
    // }

    removedTask () {
        this.element.closest('.task-manager__note-wrap').remove();
        App.save();
    }
}