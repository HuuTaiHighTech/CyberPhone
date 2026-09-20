const CART_STORAGE_KEY = "cyberphone_cart";

const readCartItems = () => {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error("Không thể đọc giỏ hàng:", error);
        return [];
    }
};

const saveCartItems = (items) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartBadge();
};

const updateCartBadge = () => {
    const cartItems = readCartItems();
    const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const badge = document.querySelector("#cart-count");

    if (badge) {
        badge.textContent = String(totalQuantity);
    }
};

const formatCurrency = (value) => {
    const number = Number(value) || 0;

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(number);
};

const getCartTotal = (items) => items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 0);
}, 0);

const renderCartList = (items) => {
    const listContainer = document.querySelector("#cartItems");

    if (!listContainer) return;

    if (!items.length) {
        listContainer.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">
                    <i class="bi bi-bag-heart"></i>
                </div>
                <h3>Chưa có sản phẩm nào trong giỏ hàng</h3>
                <p>Nhấn vào trái tim trên sản phẩm để thêm vào giỏ hàng.</p>
                <a class="btn btn-primary-cart" href="../../view/webClient/products.html">Back to products</a>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = items.map((item) => `
        <div class="cart-product-card" data-id="${item.id}">
            <div class="cart-product-image-wrap">
                <img src="${item.img || "../../assets/images/logoheaderCyberPhone.png"}" alt="${item.name || "Product"}" class="cart-product-image" />
            </div>

            <div class="cart-product-body">
                <div class="cart-product-head">
                    <div>
                        <span class="cart-product-type">${item.type || "Other"}</span>
                        <h4 class="cart-product-name">${item.name || "Unnamed product"}</h4>
                    </div>
                    <button class="cart-remove-btn" data-product-id="${item.id}" data-cart-action="remove" type="button">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="cart-product-meta">
                    <strong class="cart-product-price">${formatCurrency(item.price)}</strong>
                    <div class="cart-quantity-box" aria-label="Số lượng sản phẩm">
                        <button type="button" class="qty-btn" data-product-id="${item.id}" data-cart-action="decrease" aria-label="Giảm số lượng">-</button>
                        <span class="qty-value">${item.quantity || 1}</span>
                        <button type="button" class="qty-btn" data-product-id="${item.id}" data-cart-action="increase" aria-label="Tăng số lượng">+</button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
};

const renderCartSummary = (items) => {
    const summaryContainer = document.querySelector("#cartSummary");

    if (!summaryContainer) return;

    const total = getCartTotal(items);
    const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    summaryContainer.innerHTML = `
        <div class="cart-summary-card">
            <h3>Cart Summary</h3>
            <div class="summary-row">
                <span>Products</span>
                <strong>${itemCount}</strong>
            </div>
            <div class="summary-row">
                <span>Subtotal</span>
                <strong>${formatCurrency(total)}</strong>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <strong>${formatCurrency(total)}</strong>
            </div>

            <div class="summary-actions">
                <a href="../../view/webClient/products.html" class="btn btn-outline-cart">Back</a>
                <a href="../../view/webClient/invoice.html" class="btn btn-primary-cart">Continue</a>
            </div>
        </div>
    `;
};

const updateQuantity = (productId, delta) => {
    const items = readCartItems();
    const nextItems = items.map((item) => {
        if (String(item.id) !== String(productId)) return item;

        const quantity = Number(item.quantity || 1) + delta;
        return { ...item, quantity: quantity > 0 ? quantity : 0 };
    }).filter((item) => Number(item.quantity || 0) > 0);

    saveCartItems(nextItems);
    renderCartPage();
};

const removeCartProduct = (productId) => {
    const items = readCartItems().filter((item) => String(item.id) !== String(productId));
    saveCartItems(items);
    renderCartPage();
};

const renderCartPage = () => {
    const items = readCartItems();
    renderCartList(items);
    renderCartSummary(items);
    updateCartBadge();
};

const attachCartEvents = () => {
    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-cart-action]");

        if (!button) return;

        const productId = button.dataset.productId;
        const action = button.dataset.cartAction;

        if (action === "increase") {
            updateQuantity(productId, 1);
        }

        if (action === "decrease") {
            updateQuantity(productId, -1);
        }

        if (action === "remove") {
            removeCartProduct(productId);
        }
    });
};

const initCartPage = () => {
    renderCartPage();
    attachCartEvents();
};

window.addEventListener("DOMContentLoaded", initCartPage);

export {
    readCartItems,
    saveCartItems,
    updateCartBadge,
    renderCartPage,
    updateQuantity,
    removeCartProduct,
};
