'use strict';

document.addEventListener('DOMContentLoaded', ()=>{

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent(){
        tabsContent.forEach(item =>{
            item.classList.add('hide');
            item.classList.remove('show');
        });
        tabs.forEach(item =>{
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0){
        tabsContent[i].classList.add('show');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click',(event) =>{
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) =>{
                if (target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    ///timer

    const deadline ='2020-06-10';

    function getTimeRemaining(endtime){
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t/(1000 * 60 * 60 * 24)),
            hours = Math.floor((t/(1000 * 60 * 60) % 24)),
            minutes = Math.floor((t/(1000 * 60 ) % 60)),
            seconds = Math.floor((t/(1000)) % 60);

        return{
            'total': t,
            'days':days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    function addZero(num){
        if(num >= 0 && num < 10){
          return `0${num}`;
        } else {
            return num;
        }

    }

    function setClock(selector, endtime){
        const timer = document.querySelector('.timer'),
            days = document.querySelector('#days'),
            hours = document.querySelector('#hours'),
            minutes = document.querySelector('#minutes'),
            seconds = document.querySelector('#seconds'),
            timeInterval = setInterval(updateClock , 1000);

            updateClock();

        function updateClock(){
            const t = getTimeRemaining(endtime);
            days.innerHTML = addZero(t.days);
            hours.innerHTML = addZero(t.hours);
            minutes.innerHTML = addZero(t.minutes);
            seconds.innerHTML = addZero(t.seconds);

            if(t.total <= 0) {
                clearInterval(timeInterval);
            }
            
        }
    }

    setClock('.timer', deadline);
    getTimeRemaining(deadline);


    //modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    console.log(modalTrigger, modal);

    function showModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalTrigger.forEach((item) => {
        item.addEventListener('click', showModal);
    });



    modal.addEventListener('click', (e) => {
        //using || for all modals (ty message)
        if(e.target === modal || e.target.getAttribute('data-close') == ''){
            closeModal();
        }
        });

    document.addEventListener('keydown', (e) =>{
        if(e.code === "Escape" && modal.classList.contains === 'show'){
            closeModal();
        }
    });

    const modalTimerId = setTimeout(showModal, 300000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

///card

class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.classes = classes; //array
        this.parentSelector = document.querySelector(parentSelector);
        this.transfer = 27;
        this.changeToUAH();
    }
    changeToUAH() {
        this.price = this.price * this.transfer;
    }
    render() {
        let element = document.createElement('div');

        console.log(this.classes);
        console.log(this.classes.length);
        if(this.classes.length === 0){
            console.log("1");
            element.classList.add('menu__item');
        } else {
        this.classes.forEach(className => element.classList.add(className));
        }
        element.innerHTML = `<img src="${this.src}" alt="${this.alt}">
        <h3 class="menu__item-subtitle">Меню "${this.title}"</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>`;
    this.parentSelector.append(element);
    }
}

const getResource = async (url) => {
    const res = await fetch(url);
    if(!res.ok ){
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
}

getResource('http://localhost:3000/menu')
.then(data =>{
    data.forEach(({img, altimg, title, descr, price}) =>{
        new MenuCard(img, altimg, title, descr, price,".menu .container").render();
    });
});


   //not dynamic object \\
// new MenuCard(
//     "img/tabs/post.jpg",
//     "post",
//     "ПОСТНОЕ",
//     "test",
//     12,
//     ".menu .container",
//     "menu__item",
//     "large"
// ).render();


// new MenuCard(
//     "img/tabs/elite.jpg",
//     "elite",
//     "elite",
//     "test",
//     16,
//     ".menu .container",
// ).render();

// new MenuCard(
//     "img/tabs/vegy.jpg",
//     "vegy",
//     "vegy",
//     "test",
//     19,
//     ".menu .container"
// ).render();
 

//Forms

const forms = document.querySelectorAll('form');
const message = {
    loading: 'img/forms/spinner.svg',
    success: 'Спасибо, скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так'
};

forms.forEach(item =>{
    bindPostData(item);
});

const postData = async (url, data) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: data
    });

    return await res.json();
};

function bindPostData(form) {
    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        
        const statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `display: block;
        margin: 0 auto;`;
        form.insertAdjacentElement('afterend', statusMessage);

        const formData = new FormData(form);

        const json = JSON.stringify(Object.fromEntries(formData.entries()))

        postData('http://localhost:3000/requests', json)
        .then(data => {
            console.log(data);
            showModalTy(message.success);
            statusMessage.remove();
        })
        .catch(() =>{
            showModalTy(message.failure);
        })
        .finally(()=>{
            form.reset();
        });

    });
}
function showModalTy(message){
    const prevModal = document.querySelector('.modal__dialog');

    prevModal.classList.add('hide');
    showModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `<div class="modal__content">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
        </div>`;

document.querySelector('.modal').append(thanksModal);

setTimeout(()=>{
    thanksModal.remove();
    prevModal.classList.remove('hide');
    prevModal.classList.add('show');
    closeModal();
},4000);
}

//slider

const slides = document.querySelectorAll('.offer__slide'),
      slider = document.querySelector('.offer__slider'),
      prevSlide = document.querySelector('.offer__slider-prev'),
      nextSlide = document.querySelector('.offer__slider-next'),
      total = document.querySelector('#total'),
      current = document.querySelector('#current'),
      slidesWrapper = document.querySelector('.offer__slider-wrapper'),
      slidesField = document.querySelector('.offer__slider-inner'),
      width = window.getComputedStyle(slidesWrapper).width;

let slideIndex = 1,
    offset = 0;

slidesField.style.width = 100 * slides.length + '%';
slidesField.style.display = 'flex' ; 
slidesField.style.transition = '.5s all' ;

slidesWrapper.style.overflow = 'hidden';

if(slides.length < 10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    }else{
        total.textContent = slides.length+1;
        current.textContent = slideIndex;
    }

slides.forEach(item =>{
    item.style.width = width;
})

function showCurrent(){
    if(slides.length < 10){
        current.textContent = `0${slideIndex}`;
    } else {
        current.textContent = slideIndex;
    }
}

//adding dots on slider 

slider.style.position = 'relative' ;

const indicators = document.createElement('ol'),
      dots = [];
indicators.classList.add('carousel-indicators');
indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
    `;

slider.append(indicators);

for(let i = 0; i < slides.length ; i++){
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.style.cssText = `
    box-sizing: content-box;
    flex: 0 1 auto;
    width: 30px;
    height: 6px;
    margin-right: 3px;
    margin-left: 3px;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: .5;
    transition: opacity .6s ease;
    `;
    if (i == slideIndex - 1){
        dot.style.opacity = '1';
    }
    indicators.append(dot);
    dots.push(dot);
};

function showDot(){
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex-1].style.opacity = '1';
};

function removeNotDigits(str){
    return +str.replace(/\D/g, '');
};

dots.forEach(dot =>{
    dot.addEventListener('click', (e) =>{
        const slideTo = e.target.getAttribute('data-slide-to');

        slideIndex = slideTo;

        offset = +width.slice(0, width.length - 2) * (slideTo - 1);
        slidesField.style.transform = `translateX(-${offset}px)`;

        showCurrent();

        showDot();
    });
})

// dots end

console.log(removeNotDigits(width) * (slides.length - 1));

nextSlide.addEventListener('click', () => {
    if (offset == removeNotDigits(width) * (slides.length - 1)){
        offset = 0;
    } else {
        offset += removeNotDigits(width) ; 
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if(slideIndex == slides.length){
        slideIndex = 1;
    }else {
        slideIndex++;
    }

    showCurrent();

    showDot();
});

prevSlide.addEventListener('click', () => {
    if (offset == 0){
        offset = removeNotDigits(width) * (slides.length - 1);
    } else {
        offset -= removeNotDigits(width) ; 
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if(slideIndex == 1){
        slideIndex = slides.length;
    }else {
        slideIndex--;
    }

    showCurrent();

    showDot();
});

//calc

// total = static + dynamic 

const result = document.querySelector('.calculating__total span');
let gender, height, weight, age, ratio;

if(localStorage.getItem('gender')){
    gender = localStorage.getItem('gender');
} else {
    gender = 'female';
    localStorage.setItem('gender', 'female'); //default
}

if(localStorage.getItem('ratio')){
    ratio = localStorage.getItem('ratio');
} else {
    ratio = 1.375;
    localStorage.setItem('ratio', 1.375); //default
}

function initLocalSettings(selector, activeClass){
    const elements = document.querySelectorAll(selector);

    elements.forEach(elem =>{
        elem.classList.remove(activeClass);
        if(elem.getAttribute('id') === localStorage.getItem('gender')){
            elem.classList.add(activeClass);
        }
        if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
            elem.classList.add(activeClass);
        }
    });
}

function calcTotal(){
    if(!gender || !height || !weight || !age || !ratio){
        result.textContent = '_ _ _';
        return;
    }

    if(gender === 'female'){
        result.textContent = Math.round(ratio * (447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)));
    } else {
        result.textContent = Math.round(ratio * (88.36 + (13.4 * weight ) + (4.8 * height) - (5.7 * age)));
    }
}

function getStaticInfo(parentSelector, activeClass) {
    const elements = document.querySelectorAll(`${parentSelector} div`);

    console.log(elements);

    elements.forEach(elem => {
        elem.addEventListener('click', (event) => {
            if (event.target.getAttribute('data-ratio')) {
                ratio = +event.target.getAttribute('data-ratio');
                localStorage.setItem('ratio', +event.target.getAttribute('data-ratio')); 
            } else {
                gender = event.target.getAttribute('id');
                localStorage.setItem('gender', event.target.getAttribute('id'));
            }

            elements.forEach(elem => {
                elem.classList.remove(activeClass);
            });

            event.target.classList.add(activeClass);

            calcTotal(); //click on buttons => dynamic result
        });
    });
}

function getDynamicInfo(selector) {
    const input = document.querySelector(selector);

    input.addEventListener('input', () => {

        if (input.value.match(/\D/g)) { //if not digits
            input.style.border = '1px solid red';
        } else {
            input.style.border = 'none';
        }
        switch (input.getAttribute('id')) {
            case 'height':
                height = +input.value;
                break;

            case 'weight':
                weight = +input.value;
                break;

            case 'age':
                age = +input.value;
                break;
        };

        calcTotal(); // changing inputs => changing total
    });
}

initLocalSettings('#gender div', 'calculating__choose-item_active');
initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

calcTotal();

getStaticInfo('#gender', 'calculating__choose-item_active');
getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

getDynamicInfo('#height');
getDynamicInfo('#weight');
getDynamicInfo('#age');


});
