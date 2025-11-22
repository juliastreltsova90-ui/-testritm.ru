// Данные оборудования
const equipmentData = [
    {
        id: 1,
        name: "Сцена металлическая 6x4м",
        category: "stages",
        price: 25000,
        image: "🎪",
        description: "Профессиональная мобильная сцена с навесом"
    },
    {
        id: 2,
        name: "Стейджбокс Mids DL 16",
        category: "sound",
        price: 2000,
        image:"https://foralltune.ru/upload/iblock/ac8/ac8260ad842d7155b8ed51b936a284a7.jpg",
        description: "Мощная акустика для мероприятий на открытом воздухе"
    },
    {
        id: 3,
        name: "LANZHEE H180-BEAM вращающаяся голова, BEAM 180Вт",
        category: "light",
        price: 8000,
        image: "💡",
        description: "Яркий LED прожектор с RGB подсветкой"
    },
    {
        id: 4,
        name: "LED видеоэкран P4",
        category: "special",
        price: 8000,
        image: "📺",
        description: "Высококачественный LED экран для мероприятий"
    },
    {
        id: 5,
        name: "Микшер Yamaha MGP32X",
        category: "sound",
        price: 20000,
        image: "🎛️",
        description: "32-канальный цифровой микшер"
    },
    {
        id: 6,
        name: "Anzhee PRO PAR SIRIUS 12 прожектор PAR, 144Вт",
        category: "light",
        price: 4000,
        image: "✨",
        description: "Профессиональная лазерная система"
    },
    {
        id: 7,
        name: "МОДУЛЬ ПОДИУМА 2Х0,5 МЕТРА",
        category: "stages",
        price: 8000,
        image: "🏗️",
        description: "Дополнение к основной сцене"
    },
    {
        id: 8,
        name: "LEDWALL 104-01 для помещений",
        category: "special",
        price: 3000,
        image: "💨",
        description: "Секция экрана"
    }
];

// Корзина
let cart = [];
let cartCount = 0;

// DOM элементы
const catalogGrid = document.getElementById('catalogGrid');
const cartIcon = document.getElementById('cartIcon');
const cartCountElement = document.querySelector('.cart-count');
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена, инициализируем приложение...');
    initApp();
});

// Основная функция инициализации
function initApp() {
    console.log('Инициализация приложения...');
    
    // Создаем модальное окно корзины
    const cartModal = createCartModal();
    
    renderCatalog();
    updateCart();
    setupEventListeners(cartModal);
}

// Настройка обработчиков событий
function setupEventListeners(cartModal) {
    console.log('Настройка обработчиков событий...');
    
    // Обработчики навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по навигации:', this.getAttribute('data-page'));
            
            const pageId = this.getAttribute('data-page');
            const category = this.getAttribute('data-category');
            
            showPage(pageId);
            
            if (category && pageId === 'catalog') {
                setTimeout(() => filterByCategory(category), 100);
            }
        });
    });
    
    // Обработчики фильтров каталога
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log('Фильтр по категории:', category);
            filterByCategory(category);
        });
    });
    
    // Обработчик формы контактов
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Отправка формы контактов');
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
            contactForm.reset();
        });
    }
    
    // Обработчики корзины
    cartIcon.addEventListener('click', function() {
        console.log('Открытие корзины');
        openCartModal(cartModal);
    });
    
    // Обработчики модального окна корзины
    cartModal.querySelector('.close-modal').addEventListener('click', function() {
        closeCartModal(cartModal);
    });
    
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal(cartModal);
        }
    });
    
    // Обработчики действий в корзине
    document.getElementById('clearCart').addEventListener('click', function() {
        console.log('Очистка корзины');
        clearCart();
    });
    
    document.getElementById('checkout').addEventListener('click', function() {
        console.log('Оформление заказа');
        checkout();
    });
}

// Показать страницу
function showPage(pageId) {
    console.log('Переход на страницу:', pageId);
    
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Прокрутка вверх при смене страницы
    window.scrollTo(0, 0);
}

// Фильтрация по категории
function filterByCategory(category) {
    console.log('Фильтрация категории:', category);
    
    // Обновляем активную кнопку фильтра
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // Фильтруем товары
    let filteredEquipment = equipmentData;
    
    if (category !== 'all') {
        filteredEquipment = equipmentData.filter(item => item.category === category);
    }
    
    renderCatalog(filteredEquipment);
}

// Отображение каталога
function renderCatalog(equipment = equipmentData) {
    console.log('Отрисовка каталога, товаров:', equipment.length);
    
    if (!catalogGrid) {
        console.error('Элемент catalogGrid не найден!');
        return;
    }
    
    catalogGrid.innerHTML = '';
    
    if (equipment.length === 0) {
        catalogGrid.innerHTML = `
            <div class="no-results">
                <h3>Товары не найдены</h3>
                <p>Попробуйте выбрать другую категорию</p>
            </div>
        `;
        return;
    }
    
    equipment.forEach(item => {
        const equipmentCard = document.createElement('div');
        equipmentCard.className = 'equipment-card';
        
        // Проверяем, является ли image URL или emoji
        let imageContent;
        if (item.image.startsWith('http')) {
            imageContent = `<img src="${item.image}" alt="${item.name}" class="equipment-image">`;
        } else {
            imageContent = `<div class="equipment-emoji">${item.image}</div>`;
        }
        
        equipmentCard.innerHTML = `
            <div class="equipment-img">${imageContent}</div>
            <div class="equipment-content">
                <h3>${item.name}</h3>
                <p class="equipment-description">${item.description}</p>
                <div class="price">${formatPrice(item.price)} руб./сутки</div>
                <button class="add-to-cart" data-id="${item.id}">Добавить в корзину</button>
            </div>
        `;
        catalogGrid.appendChild(equipmentCard);
    });
    
    // Добавление обработчиков событий для кнопок "Добавить в корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            console.log('Добавление в корзину товара ID:', itemId);
            addToCart(itemId, this);
        });
    });
}

// Форматирование цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Удаляем существующие уведомления
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ==================== ФУНКЦИИ КОРЗИНЫ ====================

// Создаем модальное окно корзины
function createCartModal() {
    const cartModal = document.createElement('div');
    cartModal.className = 'cart-modal';
    cartModal.innerHTML = `
        <div class="cart-modal-content">
            <div class="cart-modal-header">
                <h2>Корзина</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="cart-items" id="cartItems">
                <div class="empty-cart">Корзина пуста</div>
            </div>
            <div class="cart-total" id="cartTotal">
                Итого: 0 руб.
            </div>
            <div class="cart-actions">
                <button class="btn btn-secondary" id="clearCart">Очистить корзину</button>
                <button class="btn" id="checkout">Оформить заказ</button>
            </div>
        </div>
    `;
    document.body.appendChild(cartModal);
    return cartModal;
}

// Добавление товара в корзину
function addToCart(itemId, buttonElement) {
    const item = equipmentData.find(i => i.id === itemId);
    
    if (!item) {
        console.error('Товар не найден:', itemId);
        return;
    }
    
    // Проверяем, есть ли товар уже в корзине
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Анимация добавления в корзину
    if (buttonElement) {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Добавлено!';
        buttonElement.style.background = '#27ae60';
        
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.background = '';
        }, 1000);
    }
    
    // Показываем уведомление
    showNotification(`Товар "${item.name}" добавлен в корзину`);
}

// Обновление корзины
function updateCart() {
    console.log('Обновление корзины, товаров:', cart.length);
    
    // Обновляем счетчик товаров
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    
    // Обновляем содержимое корзины
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        document.getElementById('cartTotal').textContent = 'Итого: 0 руб.';
        return;
    }
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)} руб./сутки</p>
            </div>
            <div class="cart-item-controls">
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-price">${formatPrice(itemTotal)} руб.</div>
                <button class="remove-item" data-id="${item.id}">🗑️</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Обновляем общую сумму
    document.getElementById('cartTotal').textContent = `Итого: ${formatPrice(total)} руб.`;
    
    // Добавляем обработчики событий для кнопок в корзине
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            decreaseQuantity(itemId);
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            increaseQuantity(itemId);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            removeItem(itemId);
        });
    });
}

// Уменьшение количества товара
function decreaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(i => i.id !== itemId);
    }
    
    updateCart();
}

// Увеличение количества товара
function increaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    item.quantity += 1;
    updateCart();
}

// Удаление товара из корзины
function removeItem(itemId) {
    const item = cart.find(i => i.id === itemId);
    cart = cart.filter(i => i.id !== itemId);
    updateCart();
    
    showNotification(`Товар "${item.name}" удален из корзины`);
}

// Открытие модального окна корзины
function openCartModal(cartModal) {
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна корзины
function closeCartModal(cartModal) {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Очистка корзины
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        cart = [];
        updateCart();
        showNotification('Корзина очищена');
    }
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = cart.map(item => 
        `${item.name} - ${item.quantity} шт. x ${formatPrice(item.price)} руб.`
    ).join('\n');
    
    const message = `Заказ оформлен!\n\nДетали заказа:\n${orderDetails}\n\nОбщая сумма: ${formatPrice(total)} руб.\n\nСпасибо за заказ! Мы свяжемся с вами в ближайшее время.`;
    
    alert(message);
    cart = [];
    updateCart();
    
    // Закрываем модальное окно
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        closeCartModal(cartModal);
    }
    
    showNotification('Заказ успешно оформлен!');
}

console.log('JavaScript файл загружен успешно!');