import { getProductById } from "./productController.js";
import { renderProductDetail } from "./productDetailView.js";

const productId = new URLSearchParams(window.location.search).get("id");

if (productId) {
    getProductById(productId)
        .then((result) => renderProductDetail(result.data))
        .catch(() => renderProductDetail(null));
} else {
    renderProductDetail(null);
}