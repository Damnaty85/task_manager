class EditPanel {
    constructor () {
        const element = this.element = document.createElement('div');

        element.classList.add('text_editor-panel');

        element.innerHTML =
            '<button class="bold"><i class="material-icons">format_bold</i></button>\n' +
            '<button class="italic"><i class="material-icons">format_italic</i></button>\n' +
            '<button class="list"><i class="material-icons">format_list_bulleted</i></button>\n' +
            '<button class="number_list"><i class="material-icons">format_list_numbered</i></button>\n' +
            '<button class="justifyCenter"><i class="material-icons">format_align_center</i></button>\n' +
            '<button class="justifyFull"><i class="material-icons">format_align_justify</i></button>\n' +
            '<button class="justifyLeft"><i class="material-icons">format_align_left</i></button>\n' +
            '<button class="justifyRight"><i class="material-icons">format_align_right</i></button>';

        const boldButton = element.querySelector('.bold');
        const italicButton = element.querySelector('.italic');
        const listButton = element.querySelector('.list');
        const listNumberButton = element.querySelector('.number_list');
        const justifyCenter = element.querySelector('.justifyCenter');
        const justifyFull = element.querySelector('.justifyFull');
        const justifyLeft = element.querySelector('.justifyLeft');
        const justifyRight = element.querySelector('.justifyRight');

        boldButton.addEventListener('click', this.editingBold.bind(this));
        italicButton.addEventListener('click', this.editingItalic.bind(this));
        listButton.addEventListener('click', this.editingList.bind(this));
        listNumberButton.addEventListener('click', this.editingNumericList.bind(this));
        justifyCenter.addEventListener('click', this.editingjustifyCenter.bind(this));
        justifyFull.addEventListener('click', this.editingjustifyFull.bind(this));
        justifyLeft.addEventListener('click', this.editingjustifyLeft.bind(this));
        justifyRight.addEventListener('click', this.editingjustifyRight.bind(this));
    }

    editingBold (evt) {
        evt.preventDefault();
        document.execCommand('Bold');
    }

    editingItalic (evt) {
        evt.preventDefault();
        document.execCommand('Italic');
    }

    editingList (evt) {
        evt.preventDefault();
        document.execCommand('insertUnorderedList');
    }

    editingNumericList (evt) {
        evt.preventDefault();
        document.execCommand('insertOrderedList');
    }

    editingjustifyCenter (evt) {
        evt.preventDefault();
        document.execCommand('justifyCenter');
    }

    editingjustifyFull (evt) {
        evt.preventDefault();
        document.execCommand('justifyFull');
    }

    editingjustifyLeft (evt) {
        evt.preventDefault();
        document.execCommand('justifyLeft');
    }

    editingjustifyRight (evt) {
        evt.preventDefault();
        document.execCommand('justifyRight');
    }

}