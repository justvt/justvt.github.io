// MENU
const menuBtn = document.querySelector('.header__burger');
const menu = document.querySelector('.header-menu');
const body = document.querySelector('body');

menuBtn.addEventListener("click", function (e) {
    e.preventDefault();
    this.classList.toggle('is-active')
    menu.classList.toggle('is-opened');
    body.classList.toggle('is-locked')
});

// TABS
document.querySelectorAll(".tabs__nav-item").forEach((item) =>
    item.addEventListener("click", function (e) {
        e.preventDefault();

        const id = e.target.getAttribute("href").replace("#", "");
        const targetTabContent = document.getElementById(id);
        const tabs = document.querySelectorAll(".tabs__nav-item");
        const content = document.querySelectorAll(".tabs__content-item");

        tabs.forEach((child) => child.classList.remove("is-active"));
        content.forEach((child) =>
            child.classList.remove("is-active")
        );

        item.classList.add("is-active");
        targetTabContent.classList.add("is-active");
    })
);

// SLIDER
let sliders = document.querySelectorAll('._swiper');

if (sliders) {
    for (let i = 0; i < sliders.length; i++) {
        let slider = sliders[i];

        if (!slider.classList.contains('swiper-bild')) {
            let sliderItems = slider.children;

            if (sliderItems) {
                for (let i = 0; i < sliderItems.length; i++) {
                    let sliderElem = sliderItems[i];

                    sliderElem.classList.add('swiper-slide');
                }
            }

            let sliderContent = slider.innerHTML;
            let sliderWrapper = document.createElement('div');

            sliderWrapper.classList.add('swiper-wrapper');

            sliderWrapper.innerHTML = sliderContent;

            slider.innerHTML = '';

            slider.appendChild(sliderWrapper);

            slider.classList.add('swiper-bild');
        }
    }
}
document.querySelectorAll('.container').forEach(n => {

    if (document.querySelectorAll('.our-team__slider').length > 0) {
        let teamSlider = new Swiper(n.querySelector('.our-team__slider'), {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 60,
            speed: 400,
            loop: false,
            navigation: {
                prevEl: n.querySelector('.swiper-arrow--prev'),
                nextEl: n.querySelector('.swiper-arrow--next'),
            },
            breakpoints: {
                320: {
                    spaceBetween: 0,
                    slidesPerView: 1,
                },
                991: {
                    spaceBetween: 25,
                    slidesPerView: 1,
                }
            }
        });
    }
});

// DYNAMIC-ADAPTIVE
(function () {
    let originalPositions = [];
    let daElements = document.querySelectorAll('[data-da]');
    let daElementsArray = [];
    let daMatchMedia = [];
    if (daElements.length > 0) {
        let number = 0;
        for (let index = 0; index < daElements.length; index++) {
            const daElement = daElements[index];
            const daMove = daElement.getAttribute('data-da');
            if (daMove != '') {
                const daArray = daMove.split(',');
                const daPlace = daArray[1] ? daArray[1].trim() : 'last';
                const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
                const daDestination = document.querySelector('.' + daArray[0].trim())
                if (daArray.length > 0 && daDestination) {
                    daElement.setAttribute('data-da-index', number);
                    //Заполняем массив первоначальных позиций
                    originalPositions[number] = {
                        "parent": daElement.parentNode,
                        "index": indexInParent(daElement)
                    };
                    //Заполняем массив элементов
                    daElementsArray[number] = {
                        "element": daElement,
                        "destination": document.querySelector('.' + daArray[0].trim()),
                        "place": daPlace,
                        "breakpoint": daBreakpoint
                    }
                    number++;
                }
            }
        }
        dynamicAdaptSort(daElementsArray);

        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daBreakpoint = el.breakpoint;
            const daType = "max";

            daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
            daMatchMedia[index].addListener(dynamicAdapt);
        }
    }
    function dynamicAdapt(e) {
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daElement = el.element;
            const daDestination = el.destination;
            const daPlace = el.place;
            const daBreakpoint = el.breakpoint;
            const daClassname = "_dynamic_adapt_" + daBreakpoint;

            if (daMatchMedia[index].matches) {
                if (!daElement.classList.contains(daClassname)) {
                    let actualIndex = indexOfElements(daDestination)[daPlace];
                    if (daPlace === 'first') {
                        actualIndex = indexOfElements(daDestination)[0];
                    } else if (daPlace === 'last') {
                        actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
                    }
                    daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
                    daElement.classList.add(daClassname);
                }
            } else {
                //Возвращаем на место
                if (daElement.classList.contains(daClassname)) {
                    dynamicAdaptBack(daElement);
                    daElement.classList.remove(daClassname);
                }
            }
        }
        customAdapt();
    }

    dynamicAdapt();

    function dynamicAdaptBack(el) {
        const daIndex = el.getAttribute('data-da-index');
        const originalPlace = originalPositions[daIndex];
        const parentPlace = originalPlace['parent'];
        const indexPlace = originalPlace['index'];
        const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
        parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
    }
    function indexInParent(el) {
        var children = Array.prototype.slice.call(el.parentNode.children);
        return children.indexOf(el);
    }
    function indexOfElements(parent, back) {
        const children = parent.children;
        const childrenArray = [];
        for (let i = 0; i < children.length; i++) {
            const childrenElement = children[i];
            if (back) {
                childrenArray.push(i);
            } else {
                if (childrenElement.getAttribute('data-da') == null) {
                    childrenArray.push(i);
                }
            }
        }
        return childrenArray;
    }
    function dynamicAdaptSort(arr) {
        arr.sort(function (a, b) {
            if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 } //Для MobileFirst поменять
        });
        arr.sort(function (a, b) {
            if (a.place > b.place) { return 1 } else { return -1 }
        });
    }
    function customAdapt() {
        const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
}());

// ANIMATION ON SCROLL
const animItems = document.querySelectorAll('._anim-item');

if (animItems.length > 0) {
    window.addEventListener('scroll', animOnScroll);
    function animOnScroll() {
        for (let i = 0; i < animItems.length; i++) {
            const animItem = animItems[i];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = offset(animItem).top;
            const animStart = 4;

            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }

            if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                animItem.classList.add('_active');
            }
            else {
                // animItem.classList.remove('_active')
            }
        }
    }
}

function offset(el) {
    const rest = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
        top: rest.top + scrollTop, left: rest.left + scrollLeft
    }
}

setTimeout(() => {
    animOnScroll()
}, 300)