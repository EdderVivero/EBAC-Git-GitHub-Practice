document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const menuIcon = document.querySelector('.header img[alt="icono-menu"]');
  const closeIcon = document.querySelector('.sidebar__close-icon');

  function openSidebar() {
    sidebar?.classList.add('sidebar--open');
  }

  function closeSidebar() {
    sidebar?.classList.remove('sidebar--open');
  }

  menuIcon?.addEventListener('click', openSidebar);
  closeIcon?.addEventListener('click', closeSidebar);

  const cart = document.getElementById('cart');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotal = document.getElementById('cartTotal');
  const cartClearBtn = document.getElementById('cartClearBtn');
  const cartBadge = document.querySelector('.header__cart-badge');
  const cartIcon = document.querySelector('.header__cart-icon');

  const CART_STORAGE_KEY = 'adidas_cart';

  let cartProducts = [];

  function loadCartFromStorage() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        cartProducts = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('No se pudo cargar el carrito guardado');
    }
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartProducts));
    } catch (e) {
      console.warn('No se pudo guardar el carrito');
    }
  }

  function formatPrice(num) {
    return '$' + Number(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function addToCart(product) {
    cartProducts.push({ ...product, id: Date.now() + Math.random() });
    renderCart();
    updateBadge();
    saveCartToStorage();
    openCart();
  }

  function removeFromCart(id) {
    cartProducts = cartProducts.filter((p) => p.id !== id);
    renderCart();
    updateBadge();
    saveCartToStorage();
  }

  function clearCart() {
    cartProducts = [];
    renderCart();
    updateBadge();
    saveCartToStorage();
  }

  function updateBadge() {
    const count = cartProducts.length;
    cartBadge.textContent = count;
    if (count === 0) {
      cartBadge.classList.add('header__cart-badge--hidden');
    } else {
      cartBadge.classList.remove('header__cart-badge--hidden');
    }
  }

  function renderCart() {
    cartItems.innerHTML = '';

    if (cartProducts.length === 0) {
      cartEmpty.classList.add('cart__empty--visible');
      cartFooter.classList.remove('cart__footer--visible');
    } else {
      cartEmpty.classList.remove('cart__empty--visible');
      cartFooter.classList.add('cart__footer--visible');

      const total = cartProducts.reduce((sum, p) => sum + parseFloat(p.price), 0);
      cartTotal.textContent = formatPrice(total);

      cartProducts.forEach((product) => {
        const div = document.createElement('div');
        div.className = 'cart__div';
        div.dataset.id = product.id;
        div.innerHTML = `
          <img src="${product.img}" alt="${product.name}" class="cart__img">
          <div class="cart__info">
            <p class="cart__product">${product.name}</p>
            <p class="cart__price">${formatPrice(product.price)}</p>
          </div>
          <button type="button" class="cart__icon cart__remove-btn" aria-label="Quitar del carrito" data-id="${product.id}">
            <img src="img/trash_icon-icons.com_48207.png" alt="icono-quitar" class="cart__delete-icon">
          </button>
        `;

        div.querySelector('.cart__remove-btn').addEventListener('click', () => {
          removeFromCart(product.id);
        });

        cartItems.appendChild(div);
      });
    }
  }

  function openCart() {
    cart?.classList.add('cart--open');
    cartOverlay?.classList.add('cart-overlay--visible');
  }

  function closeCart() {
    cart?.classList.remove('cart--open');
    cartOverlay?.classList.remove('cart-overlay--visible');
  }

  cartIcon?.addEventListener('click', () => {
    if (cart?.classList.contains('cart--open')) {
      closeCart();
    } else {
      openCart();
    }
  });

  cartOverlay?.addEventListener('click', closeCart);

  cartClearBtn?.addEventListener('click', clearCart);

  document.querySelectorAll('.products__add-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.products__item');
      const product = {
        name: item.dataset.product,
        price: item.dataset.price,
        img: item.dataset.img,
      };
      addToCart(product);
    });
  });

  loadCartFromStorage();
  renderCart();
  updateBadge();
});
