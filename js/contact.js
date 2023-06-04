function showContactModal() {
    const sectionContainer = document.querySelector('section.container');
    
    const newModal = generateNewModalElement();     // fct care imi genereaza forma

    sectionContainer.appendChild(newModal);      // o atasez la containerul principal
     
    document.getElementById('contactBtn').classList.add('hide');
}

function generateNewModalElement() {
    const contactModal = document.createElement('div');     // creez un div care va fi insasi forma
    contactModal.setAttribute('id', 'contactModal');        

    //modal header
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modalHeader');               // modalHeader e header cu cele 3 butoane

    const modalControls = document.createElement('div');    // contine cele 3 butoane
    modalControls.classList.add('modalControls');      
    
    // AICI SUNT BUTOANELE DE MANIPULARE A FORMEI:
    const closeBtn = createControlBtn('closeBtn', 'controlBtnHover', closeClickHandler);
    const minimiseBtn = createControlBtn('minimiseBtn', 'controlBtnHover', minimiseClickHandler);
    const fullScreenBtn = createControlBtn('fullScreenBtn', 'controlBtnHover', fullScreenClickHandler);

    modalControls.append(closeBtn, minimiseBtn, fullScreenBtn)
    modalHeader.append(modalControls);

    const modalBody = document.createElement('div');    // corpul formei modal Body
    modalBody.classList.add('modalBody');

    const modalBodyTitle = document.createElement('h3');    //  Titlul formei (scopul)
    modalBodyTitle.textContent = 'Contact me';
    modalBody.append(modalBodyTitle);

    const contactForm = createContactForm();  // la body Modal atasez Contact Form, createContactForm() o creeaza 
    modalBody.append(contactForm);

    contactModal.append(modalHeader);
    contactModal.append(modalBody);

    modalBody.style.backgroundColor = "rgb(161, 204, 254)";
    modalBody.style.fontFamily = "serif";
    modalBody.style.color = "whitesmoke";
    modalBody.style.fontWeight = "lighter";

    return contactModal;        // functia imi returneaza forma creata, contactModal         
}


// functia care imi genereaza butoanele de control (fullscreen, hide, close)
// ia trei parametri: clasa, hover effect, actiunea - adica o functie care se apeleaza pe ea insasi (callback)

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


// butonul de inchidere a ferestrei: 
const closeClickHandler = (clearLocalStorage = true) => {     // callback function on btn click for close control btn
    const sectionContainer = document.querySelector('section.container');
    sectionContainer.removeChild(document.getElementById('contactModal'));
    document.getElementById('contactBtn').classList.remove('hide');

    if (clearLocalStorage) {                    // sterge din localStorage
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
    const formInputs = {};      // un obiect care imi retine datele input introduse
    inputs.forEach(input => {
        if (input.name) {
            formInputs[input.name] = input.value;
        }
    });

    // salvez in localStorage la click minimise, adica cand dau hide la forma, 
    // folosesc JSON sa transform datele in json string 
    localStorage.setItem('contactForm', JSON.stringify(formInputs));  
    closeClickHandler(false);
}


// Butonul pentru fullScreen:
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
    

// Functia care im creeaza forma:
function createContactForm() {
    const contactForm = document.createElement('form');
    contactForm.setAttribute('id', 'contactForm');

    // voi avea si un buton Submit care salveaza datele
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

    return contactForm;     // returneaza forma creata cu cele 3 input-uri
}


// Functia care imi creeaza inputurile , ia 3 param: tipul, numele, label (textContent) 
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
        // parcurge string-ul json din localStorage, construieste obiectul/valoarea
        const formInputs = JSON.parse(localStorage.getItem('contactForm')); 

        if(formInputs) {
            input.value = formInputs[name];
        }

        // folosesc interval ca atunci cand scriu in 3s de tapare sa evalueze input-ul
        input.addEventListener('input', (event) => {   // in loc de keydown.
            clearInterval(timeoutId);
            timeoutId = setInterval(() => isEmptyInput(event.target, timeoutId), 300);
        });
    }

    // mesajul afisat din evaluarea input
    const inputValidationHelper = document.createElement('p');
    inputValidationHelper.setAttribute('id', name.toLowerCase() + 'helper');    
    inputWrapper.append(inputLabel, input, inputValidationHelper);

    return inputWrapper;
}



const formSubmitHandler = async (event) => {    // BTN Submit
    event.preventDefault();     // input-ul invalid nu va fi Submitted

    const form = event.target;   // target - referinta catre obiectul caruia evenimentul e destinat

    const inputName = form.querySelector('input[name="name"]');
    const inputEmail = form.querySelector('input[name="email"]');
    const inputPhone = form.querySelector('input[name="phone"]');

   if(isEmptyInput(inputName) & isEmptyInput(inputEmail) & isEmptyInput(inputPhone)) {
        //api call to the server to send email  -> as fi simulat un API ca sa trimit un email
        const response = await sendToServer(inputName.value, inputEmail.value, inputPhone.value);
        // await for the servier response - pentru ca am nevoie de mesajul care il afisez utilizatorului

        messageSentSuccess(response);   // o fct simpla care imi adiseaza mesajul ca a fost trimis email-ul
   }
}

function sendToServer(name, email, phone) {

   // returns a promise to supply the value at some point in the future.
   // comunicare asincrona, metoda returneaza un Promise 

   return new Promise((resolve, reject) => {
        setTimeout(() => {          // peste o sec apeleaza func arrow -> simulating server request
            resolve(`${name}, we'll contact on ${email} or ${phone} soon!`) // asta te ajuta mult in viata
        }, 1000);
   });
}



function messageSentSuccess(message) {
    document.querySelector('.fullScreenBtn').remove();
    localStorage.removeItem('contactForm');             // sterg label-urile ca sa afisez mesajul

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
        clearInterval(timeoutId);         // clearInterval dupa ce am introdus datele
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