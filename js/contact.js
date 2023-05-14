function showContactModal() {

    const sectionContainer = document.querySelector('section.container');
    
    const newModal = generateNewModalElement();

    sectionContainer.appendChild(newModal);
}

function generateNewModalElement() {
    const container = document.createElement('div');
    container.setAttribute('id', 'contactModal');
    const p = document.createElement('p');
    p.textContent = 'Catalina este cea mai smechera';

    const closeBtn = document.createElement('span');
    closeBtn.classList.add('closeBtn');

    closeBtn.addEventListener('mouseover', () => {
        closeBtn.classList('')
    })

    container.append(p, closeBtn);
    return container;
}