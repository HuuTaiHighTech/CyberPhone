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

const formatCurrency = (value) => {
    const number = Number(value) || 0;

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(number);
};

const getCartTotal = (items) => items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 1);
}, 0);

const updateBadge = () => {
    const badge = document.querySelector("#cart-count");
    if (!badge) return;

    const items = readCartItems();
    const total = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    badge.textContent = String(total);
};

const clearCart = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateBadge();
};

const handlePayment = () => {
    const items = readCartItems();

    if (!items.length) {
        alert("Giỏ hàng của bạn hiện đang trống.");
        return;
    }

    clearCart();
    alert("Đã thanh toán thành công. Cảm ơn bạn!");
    window.location.href = "../../index.html";
};

const renderInvoice = () => {
    const items = readCartItems();
    const invoiceContainer = document.querySelector("#invoiceTable");

    if (!invoiceContainer) return;

    if (!items.length) {
        invoiceContainer.innerHTML = `
            <div class="invoice-empty">
                <h3>Chưa có sản phẩm nào để tạo hóa đơn</h3>
                <a href="../../view/webClient/products.html" class="btn btn-primary-cart">Back to products</a>
            </div>
        `;
        return;
    }

    const total = getCartTotal(items);

    invoiceContainer.innerHTML = `
        <div class="invoice-card">
            <div class="invoice-header">
                <div>
                    <p class="invoice-label">CyberPhone</p>
                    <h2>Invoice</h2>
                </div>
                <a href="../../view/webClient/cart.html" class="btn btn-outline-cart">Back to cart</a>
            </div>

            <div class="invoice-table-wrap">
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((item) => `
                            <tr>
                                <td>
                                    <div class="invoice-product-cell">
                                        <img src="${item.img || "../../assets/images/logoheaderCyberPhone.png"}" alt="${item.name || "Product"}" />
                                        <span>${item.name || "Unnamed product"}</span>
                                    </div>
                                </td>
                                <td>${Number(item.quantity || 1)}</td>
                                <td>${formatCurrency(item.price)}</td>
                                <td>${formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3">Total</td>
                            <td>${formatCurrency(total)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="invoice-actions">
                <button type="button" class="btn btn-primary-cart" id="payNowBtn">Thanh toán</button>
            </div>
        </div>
    `;

    const payNowBtn = document.querySelector("#payNowBtn");
    if (payNowBtn) {
        payNowBtn.addEventListener("click", handlePayment);
    }
};

document.addEventListener("DOMContentLoaded", renderInvoice);
window.addEventListener("storage", renderInvoice);
