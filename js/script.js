App.load();

document.querySelector('[data-action-addColumn]').addEventListener('click',  (evt) => {
    const column = new Column;
    document.querySelector('.task-manager__list').append(column.element);

    column.element.querySelector('.column__header').setAttribute('contenteditable', 'true');
    column.element.querySelector('.column__header').focus();

    App.save();
});