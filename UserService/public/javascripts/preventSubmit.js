const form = document.querySelector('form');
const submitButton = document.querySelector('save');

form.addEventListener(
    'submit',
    function () {
        // Disable the submit button
        submitButton.setAttribute('disabled', 'disabled');

        // Change the "Submit" text
        submitButton.value = 'Please wait...';
    },
    false
);
