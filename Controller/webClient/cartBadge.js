const CART_STORAGE_KEY = "cyberphone_cart";

function getCartItems() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error("Không thể đọc giỏ hàng:", error);
        return [];
    }
}

function updateCartBadge() {
    const badge = document.querySelector("#cart-count");
    if (!badge) return;

    const totalQuantity = getCartItems().reduce((sum, item) => {
        return sum + Number(item.quantity || 0);
    }, 0);

    badge.textContent = String(totalQuantity);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
window.addEventListener("storage", updateCartBadge);
document.addEventListener("cartUpdated", updateCartBadge);

window.updateCartBadge = updateCartBadge;
