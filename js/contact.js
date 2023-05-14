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


const closeClickHandler = () => {     // callback function on btn click for close control btn
    const sectionContainer = document.querySelector('section.container');
    sectionContainer.removeChild(document.getElementById('contactModal'));
    document.getElementById('contactBtn').classList.remove('hide');
}

const minimiseClickHandler = () => {     // callback function on btn click for minimise control btn
    const sectionContainer = document.querySelector('section.container');
    sectionContainer.removeChild(document.getElementById('contactModal'));
}

const fullScreenClickHandler = () => {     // callback function on btn click for full screen control btn
    const sectionContainer = document.querySelector('section.container');
    sectionContainer.removeChild(document.getElementById('contactModal'));
}

function createContactForm() {
    const contactForm = document.createElement('form');
    contactForm.setAttribute('id', 'contactForm');
    
    contactForm.addEventListener('submit', formSubmitHandler);

    const inputName = createInput('text', 'name');
    contactForm.append(inputName);

    const submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.setAttribute('value', 'Submit');

    contactForm.append(submitBtn);
    return contactForm;
}

function createInput(type, name) {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('inputWrapper');

    const inputLabel = document.createElement('label');
    inputLabel.textContent = 'Name';
    inputLabel.setAttribute('for', name.toLowerCase());

    let input = null;
    if (type.toLowerCase() === 'text') {
        input = document.createElement('input');
        input.setAttribute('id', name.toLowerCase());
        input.setAttribute('name', name.toLowerCase());
        input.setAttribute('type', type.toLowerCase());
    }

    const inputValidationHelper = document.createElement('p');
    inputValidationHelper.setAttribute('id', name.toLowerCase() + 'helper');
    inputWrapper.append(inputLabel, input, inputValidationHelper);
    return inputWrapper;
}

const formSubmitHandler = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[name="name"]');
    if (!name.length) {
        const errorMessage = document.getElementById(name.id.toLowerCase() + 'helper');
        errorMessage.classList.add('errorMessage');
        errorMessage.textContent = 'Invalid input';
        errorMessage.classList.add('invalidInput');
    }
    alert(name.value);
}