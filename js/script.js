App.load();

document.querySelector('[data-action-addColumn]').addEventListener('click',  (evt) => {
    const column = new Column;
    document.querySelector('.columns').append(column.element);

    column.element.querySelector('.column-header').setAttribute('contenteditable', 'true');
    column.element.querySelector('.column-header').focus();

    App.save();
});