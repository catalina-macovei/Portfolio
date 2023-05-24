function showContactModal() {
    const sectionContainer = document.querySelector('section.container');
    
    const newModal = generateNewModalElement();

    sectionContainer.appendChild(newModal);
     
    document.getElementById('contactBtn').classList.add('hide');
}

function generateNewModalElement() {
    const contactModal = document.createElement('div');
    contactModal.setAttribute('id', 'contactModal');

    //modal header
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modalHeader');

    const modalControls = document.createElement('div');
    modalControls.classList.add('modalControls');
    const closeBtn = createControlBtn('closeBtn', 'controlBtnHover', closeClickHandler);
    const minimiseBtn = createControlBtn('minimiseBtn', 'controlBtnHover', minimiseClickHandler);
    const fullScreenBtn = createControlBtn('fullScreenBtn', 'controlBtnHover', fullScreenClickHandler);
    const fBtn = createControlBtn('fBtn', 'controlBtnHover', fullScreenClickHandler);

    modalControls.append(closeBtn, minimiseBtn, fullScreenBtn, fBtn)
    modalHeader.append(modalControls);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modalBody');

    const modalBodyTitle = document.createElement('h3');
    modalBodyTitle.textContent = 'Contact me';
    modalBody.append(modalBodyTitle);

    const contactForm = createContactForm();
    modalBody.append(contactForm);

    contactModal.append(modalHeader);
    contactModal.append(modalBody);

    modalBody.style.backgroundColor = "rgb(161, 204, 254)";
    modalBody.style.fontFamily = "serif";
    modalBody.style.color = "whitesmoke";
    modalBody.style.fontWeight = "lighter";
    return contactModal;
}

//this function generates custom modal control buttons
function createControlBtn(btnClass, hoverEffect, action) {
    // create new control btn
    const controlBtn = document.createElement('span');
    controlBtn.classList.add('controlBtn', btnClass);
    //add hover effect (mouse over)
    controlBtn.addEventListener('mouseover',  () => {     // callback function on mouse hover
        controlBtn.classList.add(hoverEffect);
    });
    
    //remove hover effect (mouse out)
    controlBtn.addEventListener('mouseout',  () => {     // callback function on mouse hover
        controlBtn.classList.remove(hoverEffect);
    });

    //if action provided 
    if (action) {
         // execut action on btn click
         controlBtn.addEventListener('click',  action);
    }
   
    return controlBtn;
}

const closeClickHandler = (clearLocalStorage = true) => {     // callback function on btn click for close control btn
    const sectionContainer = document.querySelector('section.container');
    sectionContainer.removeChild(document.getElementById('contactModal'));
    document.getElementById('contactBtn').classList.remove('hide');
    if (clearLocalStorage) {
        localStorage.removeItem('contactForm');
    }
}

const minimiseClickHandler = () => {     // callback function on btn click for minimise control btn
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        closeClickHandler(false);
        return;
    }
    
    const inputs = contactForm.querySelectorAll('input');
    const formInputs = {};
    inputs.forEach(input => {
        if (input.name) {
            formInputs[input.name] = input.value;
        }
    });

    localStorage.setItem('contactForm', JSON.stringify(formInputs));
    closeClickHandler(false);
}


const fullScreenClickHandler = () => {     // callback function on btn click for full screen control btn
    const contactModal = document.getElementById('contactModal');
    const modalBody = document.querySelector('.modalBody');

    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        modalBody.style.height = '100%';

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } else {
        modalBody.style.height = '95%';
        if (contactModal.requestFullscreen) {
            contactModal.requestFullscreen();
        } else {
            // Fallback for unsupported browsers
            if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        }
    }
};
    

function createContactForm() {
    const contactForm = document.createElement('form');
    contactForm.setAttribute('id', 'contactForm');

    contactForm.addEventListener('submit', formSubmitHandler);

    const inputName = createInput('text', 'name', 'Name');
    const inputEmail = createInput('email', 'email', 'Email'); 
    const inputPhoneNumber = createInput('tel', 'phone', 'Phone');

    contactForm.append(inputName, inputEmail);   // Add inputEmail to the form

    contactForm.append(inputPhoneNumber);        // Add inputPhone to the form

    const submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.setAttribute('value', 'Submit');

    contactForm.append(submitBtn);
    return contactForm;
}

function createInput(type, name, label) {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('inputWrapper');
    const inputLabel = document.createElement('label');
    inputLabel.textContent = label;
    inputLabel.setAttribute('for', name.toLowerCase());

    let input = null;
    if (type.toLowerCase() === 'text' || type.toLowerCase() === 'email' || type.toLowerCase() === 'tel') {
        input = document.createElement('input');
        input.setAttribute('id', name.toLowerCase());
        input.setAttribute('name', name.toLowerCase());
        input.setAttribute('type', type.toLowerCase());
        let timeoutId;
        const formInputs = JSON.parse(localStorage.getItem('contactForm'));

        if(formInputs) {
            input.value = formInputs[name];
        }
        input.addEventListener('input', (event) => {
            clearInterval(timeoutId);
            timeoutId = setInterval(() => isEmptyInput(event.target, timeoutId), 300);
        });
    }

    const inputValidationHelper = document.createElement('p');
    inputValidationHelper.setAttribute('id', name.toLowerCase() + 'helper');
    inputWrapper.append(inputLabel, input, inputValidationHelper);

    return inputWrapper;
}

const formSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const inputName = form.querySelector('input[name="name"]');
    const inputEmail = form.querySelector('input[name="email"]');
    const inputPhone = form.querySelector('input[name="phone"]');
   if(isEmptyInput(inputName) & isEmptyInput(inputEmail) & isEmptyInput(inputPhone)) {
        //api call to the server to send email
        const response = await sendToServer(inputName.value, inputEmail.value, inputPhone.value);
        //we await for the servier response because we need the message/reponse which will be
        //shown to the user
        messageSentSuccess(response);
   }
}

function sendToServer(name, email, phone) {
    // This lets asynchronous methods/functions return values like synchronous functions:
    // instead of immediately returning the final value, the asynchronous method
    // returns a promise to supply the value at some point in the future.
    
   return new Promise((resolve, reject) => {
        setTimeout(() => {          // peste o sec apeleaza func arrow -> simulating server request
            resolve(`${name}, we'll contact on ${email} or ${phone} soon!`) // asta te ajuta mult in viata
        }, 1000);
   });
}

function messageSentSuccess(message) {
    document.querySelector('.fullScreenBtn').remove();
    localStorage.removeItem('contactForm');
    const modalBody = document.querySelector('.modalBody');
    if (!modalBody){
        return;
    }
    modalBody.style.height = `${modalBody.clientHeight}px`;
    modalBody.style.display = 'flex';
    modalBody.style.textAlign = 'center';
    modalBody.style.alignItems = 'center';
    modalBody.innerHTML = `<h3> ${message} </h3>`;
}

function isEmptyInput(input, timeoutId) {  // isInputValid + regex
    if (timeoutId) {
        clearInterval(timeoutId);
    }
    let isValid = false;
    if (!input.value.length) {
        setErrorMessage(input.name);
    }
    else {
        if(input.id.toLowerCase() == 'email') {
            if (isValidEmail(input)) {
                isValid = true;
            }
        }
        else if(input.id.toLowerCase() == 'name') {
            if(isValidName(input)) {
                isValid = true;
            }
        }
        else if(input.id.toLowerCase() == 'phone') {
            if(isValidTel(input)) {
                isValid = true;
            }
        }  
        setErrorMessage(input.name, isValid); 
    }
    return isValid;
}

function setErrorMessage(name, valid = false) {
    const errorMessage = document.getElementById(name.toLowerCase() + 'helper');
    if (errorMessage) {
        errorMessage.textContent = valid ? `Input ${name} is valid` : 'Input ' + name + ' is invalid';
        errorMessage.style.color = valid ? 'green' : 'red';
    }
}

//Validation input with RegExp:

function isValidEmail(inputEmail) {     // checking if email is valid or not using RegExp:
    let isValid = false;
    const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    isValid = regex.test(inputEmail.value);
    return isValid;
}

function isValidTel(inputPhone) {      // checking if phone number is valid   
    let isValid = false;
    const regex1 = new RegExp(/^\+(?:[0-9]?){6,14}[0-9]$/);
    isValid = regex1.test(inputPhone.value);
    return isValid;
}

function isValidName(inputName) {
    let isValid = false;
    const regex = new RegExp(/^[a-zA-Z]+ [a-zA-Z]+$/);
    isValid = regex.test(inputName.value);
    return isValid;
}