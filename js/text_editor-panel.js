class Text_editorPanel {
    constructor () {
        const element = this.element = document.createElement('div');

        element.classList.add('text_editor-panel');

        element.innerHTML =
            '<button class="panel__bold">B</button>\n' +
            '<button class="panel__italic">I</button>\n' +
            '<button class="panel__list">Ul</button>';

        const bold = element.querySelector('.panel__bold');
        const italic = element.querySelector('.panel__italic');

        bold.addEventListener('click', () => {
            this.execCommandOnElement('Bold').bind(this);

        });

        italic.addEventListener('click', () => {
            this.execCommandOnElement('Italic').bind(this);

        });
    }

    execCommandOnElement(commandName, value) {
        this.editableArea = document.querySelector('.note__description');

        if (typeof value == "undefined") {
            value = null;
        }

        if (typeof window.getSelection != "undefined") {
            // Non-IE case
            let sel = window.getSelection();
            // Save the current selection
            let savedRanges = [];
            for (let i = 0, len = sel.rangeCount; i < len; ++i) {
                savedRanges[i] = sel.getRangeAt(i).cloneRange();
            }
            // Temporarily enable designMode so that
            // document.execCommand() will work
            document.designMode = "on";

            // Select the element content
            sel = window.getSelection();
            let range = document.createRange();
            range.selectNodeContents(this.editableArea);
            sel.removeAllRanges();
            sel.addRange(range);

            // Execute the command
            document.execCommand(commandName, false, value);

            // Disable designMode
            document.designMode = "off";

            // Restore the previous selection
            sel = window.getSelection();
            sel.removeAllRanges();
            for (let i = 0, len = savedRanges.length; i < len; ++i) {
                sel.addRange(savedRanges[i]);
            }
        } else if (typeof document.body.createTextRange != "undefined") {
            // IE case
            let textRange = document.body.createTextRange();
            console.log(textRange);
            textRange.moveToElementText(this.editableArea);
            textRange.execCommand(commandName, false, value);
        }
    }
}