// ===== VARIABLES GLOBALES =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isMenuOpen = false;

// ===== PRODUCTOS DATA =====
const products = [
    {
        id: 'jabon-lavanda',
        name: 'Jabón de Lavanda',
        description: 'Jabón artesanal con aceite esencial de lavanda',
        price: 15000,
        image: 'images/productos/jabon-lavanda.jpg',
        category: 'jabones',
        ingredients: ['Aceite de coco', 'Aceite de oliva', 'Aceite esencial de lavanda', 'Manteca de karité'],
        inStock: true
    },
    {
        id: 'crema-facial',
        name: 'Crema Facial Natural',
        description: 'Hidratante facial con aloe vera y aceite de jojoba',
        price: 32000,
        image: 'images/productos/crema-facial.jpg',
        category: 'cremas',
        ingredients: ['Aloe vera', 'Aceite de jojoba', 'Vitamina E', 'Agua de rosas'],
        inStock: true
    },
    {
        id: 'aceite-corporal',
        name: 'Aceite Corporal',
        description: 'Aceite nutritivo con almendras y vitamina E',
        price: 28000,
        image: 'images/productos/aceite-corporal.jpg',
        category: 'aceites',
        ingredients: ['Aceite de almendras', 'Vitamina E', 'Aceite de rosa mosqueta'],
        inStock: true
    },
    {
        id: 'champu-solido',
        name: 'Champú Sólido',
        description: 'Champú ecológico para cabello graso',
        price: 22000,
        image: 'images/productos/champu-solido.jpg',
        category: 'cabellos',
        ingredients: ['Aceite de coco', 'Arcilla verde', 'Aceite de árbol de té'],
        inStock: true
    },
    {
        id: 'exfoliante-cafe',
        name: 'Exfoliante de Café',
        description: 'Exfoliante corporal con café y aceite de coco',
        price: 18000,
        image: 'images/productos/exfoliante-cafe.jpg',
        category: 'exfoliantes',
        ingredients: ['Café molido', 'Aceite de coco', 'Azúcar morena'],
        inStock: true
    },
    {
        id: 'balsamo-labial',
        name: 'Bálsamo Labial',
        description: 'Bálsamo hidratante con cera de abeja y manteca de cacao',
        price: 8000,
        image: 'images/productos/balsamo-labial.jpg',
        category: 'labiales',
        ingredients: ['Cera de abeja', 'Manteca de cacao', 'Aceite de coco'],
        inStock: true
    }
];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Inicializar componentes
    initializeNavigation();
    initializeScrollEffects();
    initializeCart();
    initializeContactForm();
    initializeProductGrid();
    initializeAnimations();
    
    // Actualizar contador del carrito
    updateCartCount();
    
    console.log('✅ Aplicación inicializada correctamente');
}

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu móvil
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Smooth scroll para navegación interna
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    isMenuOpen = !isMenuOpen;
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        // Efecto header transparente
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });

    // Observador de intersección para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .about-text, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== CARRITO DE COMPRAS =====
function initializeCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const modal = document.getElementById('cart-modal');
    const closeModal = modal.querySelector('.close');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout');

    // Abrir modal del carrito
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
    });

    // Cerrar modal
    closeModal.addEventListener('click', closeCartModal);
    
    // Cerrar modal al hacer click fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCartModal();
        }
    });

    // Vaciar carrito
    clearCartBtn.addEventListener('click', clearCart);

    // Checkout
    checkoutBtn.addEventListener('click', proceedToCheckout);

    // Inicializar botones de agregar al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

function handleAddToCart(e) {
    const productId = e.target.getAttribute('data-product');
    const product = products.find(p => p.id === productId);
    
    if (product) {
        addToCart(product);
        showNotification(`${product.name} agregado al carrito`, 'success');
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Carrito vacío', 'info');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #eee;">
            <div>
                <h4 style="margin: 0 0 0.5rem 0;">${item.name}</h4>
                <p style="margin: 0; color: var(--medium-gray);">$${item.price.toLocaleString()}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" style="background: var(--light-gray); border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">-</button>
                <span style="padding: 0 0.5rem;">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" style="background: var(--light-gray); border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">+</button>
                <button onclick="removeFromCart('${item.id}')" style="background: #dc3545; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; margin-left: 0.5rem;">×</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString();
}

function openCartModal() {
    const modal = document.getElementById('cart-modal');
    updateCartDisplay();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }
    
    // Aquí puedes integrar con una pasarela de pago real
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `¡Hola! Me interesa comprar los siguientes productos:\n\n${cart.map(item => `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString()}`).join('\n')}\n\nTotal: $${total.toLocaleString()}`;
    
    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    showNotification('Redirigiendo a WhatsApp...', 'success');
}

// ===== FORMULARIO DE CONTACTO =====
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validar formulario
    if (!validateContactForm(data)) {
        return;
    }
    
    // Simular envío (aquí puedes integrar con un servicio real)
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        showNotification('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
        e.target.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function validateContactForm(data) {
    let isValid = true;
    
    // Validar nombre
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('email', 'Ingresa un email válido');
        isValid = false;
    }
    
    // Validar mensaje
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(e);
    
    switch (field.name) {
        case 'name':
            if (value.length < 2) {
                showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showFieldError('email', 'Ingresa un email válido');
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
            }
            break;
    }
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const existingError = field.parentNode.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    field.style.borderColor = '#dc3545';
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
        field.style.borderColor = '#e0e0e0';
    }
}

// ===== GRID DE PRODUCTOS =====
function initializeProductGrid() {
    // Los productos ya están en el HTML, pero aquí puedes agregar funcionalidad adicional
    addProductHoverEffects();
}

function addProductHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== ANIMACIONES =====
function initializeAnimations() {
    // Contador animado para estadísticas
    const stats = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = stat.textContent.replace(/[\d,]+/, target.toLocaleString());
                    clearInterval(timer);
                } else {
                    stat.textContent = stat.textContent.replace(/[\d,]+/, Math.floor(current).toLocaleString());
                }
            }, 40);
        });
    };

    // Observador para las estadísticas
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const aboutSection = document.querySelector('.about-stats');
    if (aboutSection) {
        statsObserver.observe(aboutSection);
    }
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : type === 'error' ? '#dc3545' : '#17a2b8',
        color: type === 'warning' ? '#000' : '#fff',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
        zIndex: '9999',
        fontSize: '0.9rem',
        fontWeight: '500',
        maxWidth: '300px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
    };
    
    Object.assign(notification.style, styles);
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar y remover notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== NEWSLETTER =====
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Simular suscripción
                showNotification('¡Gracias por suscribirte a nuestro newsletter!', 'success');
                this.reset();
            }
        });
    }
});

// ===== UTILIDADES =====
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== PERFORMANCE =====
// Lazy loading para imágenes (cuando se agreguen imágenes reales)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ACCESIBILIDAD =====
// Navegación por teclado
document.addEventListener('keydown', function(e) {
    // Escape para cerrar modales
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            closeCartModal();
        }
        
        if (isMenuOpen) {
            toggleMobileMenu();
        }
    }
});

// ===== EVENTOS GLOBALES =====
window.addEventListener('load', function() {
    // Ocultar loader si existe
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
});

// ===== FUNCIONES GLOBALES PARA HTML =====
// Estas funciones están disponibles globalmente para ser llamadas desde el HTML
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.toggleMobileMenu = toggleMobileMenu;

console.log('🚀 JavaScript de Alhua cargado correctamente');