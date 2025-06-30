document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    let isProcessing = false; // Флаг для предотвращения множественных срабатываний
    
    // Инициализация аккордеона
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const inner = item.querySelector('.accordion-content-inner');
        
        header.addEventListener('click', function(e) {
            if (isProcessing) return;
            isProcessing = true;
            
            toggleAccordion(item, false); // Всегда обрабатываем клик
            
            setTimeout(() => {
                isProcessing = false;
            }, 300);
        });
        
        // Инициализация открытых элементов
        if (item.classList.contains('active')) {
            content.style.height = inner.offsetHeight + 'px';
        }
    });
    
    // Функция переключения аккордеона
    function toggleAccordion(item, shouldCenter = false) {
        const content = item.querySelector('.accordion-content');
        const inner = item.querySelector('.accordion-content-inner');
        
        if (content.style.height === '0px' || !content.style.height) {
            // Закрываем другие открытые элементы
            document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    const activeContent = activeItem.querySelector('.accordion-content');
                    activeContent.style.height = '0';
                    activeItem.classList.remove('active');
                }
            });
            
            // Открываем текущий
            content.style.height = inner.offsetHeight + 'px';
            item.classList.add('active');
            
            // Центрируем на экране, если нужно
            if (shouldCenter) {
                centerAccordionItem(item);
            }
        } else {
            // Закрываем текущий
            content.style.height = '0';
            item.classList.remove('active');
        }
    }
    
    // Функция центрирования элемента
    function centerAccordionItem(item) {
        setTimeout(() => {
            const itemRect = item.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const scrollPosition = window.pageYOffset + itemRect.top - (viewportHeight / 2) + (itemRect.height / 2) - headerHeight;
            
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }, 100);
    }
    
    // Обработка кликов по карточкам
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') return;
            
            const targetId = this.getAttribute('href');
            const targetItem = document.querySelector(targetId);
            
            if (targetItem) {
                if (!targetItem.classList.contains('active')) {
                    toggleAccordion(targetItem, true); // Открываем с центрированием
                } else {
                    centerAccordionItem(targetItem); // Если уже открыт, просто центрируем
                }
                
                // Обновляем URL без триггера hashchange
                history.replaceState(null, null, targetId);
            }
        });
    });
    
    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        document.querySelectorAll('.accordion-item.active').forEach(item => {
            const content = item.querySelector('.accordion-content');
            const inner = item.querySelector('.accordion-content-inner');
            content.style.height = inner.offsetHeight + 'px';
        });
    });
    
    // Обработка якорных ссылок при загрузке
    function handleAnchorLinks() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetItem = document.getElementById(hash);
            if (targetItem && !targetItem.classList.contains('active')) {
                toggleAccordion(targetItem, true);
            }
        }
    }
    
    // Инициализация при загрузке
    setTimeout(handleAnchorLinks, 300);
});

// Слайдер

document.addEventListener('DOMContentLoaded', function() {
            const slider = document.querySelector('.slider');
            const slides = document.querySelectorAll('.slide');
            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');
            const dotsContainer = document.querySelector('.slider-dots');
            
            let currentSlide = 0;
            const slideCount = slides.length;
            
            // Создаем точки навигации
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            
            const dots = document.querySelectorAll('.dot');
            
            // Функция перехода к слайду
            function goToSlide(slideIndex) {
                slider.style.transform = `translateX(-${slideIndex * 100}%)`;
                currentSlide = slideIndex;
                
                // Обновляем активную точку
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
            
            // Следующий слайд
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slideCount;
                goToSlide(currentSlide);
            }
            
            // Предыдущий слайд
            function prevSlide() {
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                goToSlide(currentSlide);
            }
            
            // Обработчики кнопок
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
            
            // Автоматическое перелистывание
            let slideInterval = setInterval(nextSlide, 5000);
            
            // Пауза при наведении
            const sliderContainer = document.querySelector('.slider-container');
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
            
            // Свайпы для мобильных устройств
            let touchStartX = 0;
            let touchEndX = 0;
            
            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(slideInterval);
            }, {passive: true});
            
            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                slideInterval = setInterval(nextSlide, 5000);
            }, {passive: true});
            
            function handleSwipe() {
                if (touchEndX < touchStartX - 50) {
                    nextSlide();
                }
                
                if (touchEndX > touchStartX + 50) {
                    prevSlide();
                }
            }
            
            // Инициализация
            goToSlide(0);
        });

       