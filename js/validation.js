class Validation {
    constructor(selector, symbolCount, topPos) {

        selector.addEventListener('input', function (evt) {
            let target = evt.target;
            if (target.textContent.length >= symbolCount) {

                createErrorMessage(target);

                target.removeAttribute('contenteditable');

            }
        });

        function createErrorMessage (selectorTarget) {
            let errorMessage;
            errorMessage = document.createElement('span');
            errorMessage.classList.add('error__message');
            errorMessage.textContent = 'Максимальная длина заголовка ' + symbolCount + ' символов';
            selectorTarget.insertAdjacentElement('afterend', errorMessage);
            errorMessage.classList.add('_show--message');
            errorMessage.style.top = topPos + 'px';

            setTimeout(() => {
                errorMessage.classList.remove('_show--message');
                setTimeout(() => {
                    errorMessage.remove();
                }, 1000);
            }, 2000);
        }
    }
}