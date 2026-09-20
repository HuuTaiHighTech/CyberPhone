
const getArrowImagePath = (direction, isActive) => {
    const map = {
        left: {
            default: "../../assets/images/arrow_left.svg",
            active: "../../assets/images/arrow_left_color.svg"
        },
        right: {
            default: "../../assets/images/arrow_right.svg",
            active: "../../assets/images/arrow_right_color.svg"
        }
    };

    return map[direction][isActive ? "active" : "default"];
};

const updateArrowButtonState = (button, direction, isActive) => {
    const img = button.querySelector("img");
    if (!img) return;

    img.src = getArrowImagePath(direction, isActive);
    button.disabled = !isActive;
    button.setAttribute("aria-disabled", String(!isActive));
};

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

const updateCartBadge = () => {
    const badge = document.querySelector("#cart-count");
    if (!badge) return;

    const items = readCartItems();
    const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    badge.textContent = String(totalQuantity);
};

const saveCartItems = (items) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartBadge();
};

const syncProductCartState = (product, isActive) => {
    const items = readCartItems();

    if (isActive) {
        const existed = items.find((item) => String(item.id) === String(product.id));

        if (existed) {
            window.alert("Sản phẩm này đã được thêm vào giỏ hàng rồi.");
            return;
        }

        items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            type: product.type || "Other",
            quantity: 1
        });
    } else {
        const filtered = items.filter((item) => String(item.id) !== String(product.id));
        saveCartItems(filtered);
        return;
    }

    saveCartItems(items);
};

const bindProductSearch = (products) => {
    const searchForm = document.querySelector("#productSearchForm");
    const searchInput = document.querySelector("#productSearchInput");
    const searchSuggestions = document.querySelector("#productSearchSuggestions");

    if (!searchForm || !searchInput || !searchSuggestions) return;

    const updateSuggestions = () => {
        const keyword = searchInput.value.trim().toLowerCase();

        if (!keyword) {
            searchSuggestions.innerHTML = "";
            return;
        }

        const suggestions = products
            .filter((product) => (product.name || "").toLowerCase().includes(keyword))
            .slice(0, 8);

        searchSuggestions.innerHTML = suggestions
            .map((product) => `
                <option value="${product.name}" data-product-id="${product.id}"></option>
            `)
            .join("");
    };

    const openMatchedProduct = () => {
        const keyword = searchInput.value.trim().toLowerCase();
        if (!keyword) return;

        const exactMatch = products.find((product) => (product.name || "").toLowerCase() === keyword);
        const relatedMatch = products.find((product) => (product.name || "").toLowerCase().includes(keyword));
        const selectedOption = [...searchSuggestions.options].find((option) => {
            return (option.value || "").toLowerCase() === keyword;
        });

        const targetProduct = selectedOption
            ? products.find((product) => String(product.id) === String(selectedOption.dataset.productId))
            : exactMatch || relatedMatch;

        if (targetProduct) {
            window.location.href = `../../view/webClient/productDetail.html?id=${targetProduct.id}`;
        }
    };

    searchInput.addEventListener("input", updateSuggestions);
    searchInput.addEventListener("change", openMatchedProduct);
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        openMatchedProduct();
    });
};

let renderData = (arrProduct) => {
    const productList = document.querySelector("#product_list");
    const productCategories = document.querySelector("#productCategories");

    if (!productList || !productCategories) return;

    const activeProducts = arrProduct.filter((product) => {
        const deleted = String(product.deleted).toLowerCase();
        return deleted !== "true" && deleted !== "1";
    });
    const productTypes = [...new Set(activeProducts.map((product) => product.type || "Other"))];

    productCategories.innerHTML = `
        <button class="product-filter-button active" type="button" data-type="all" aria-pressed="true">
            See All
        </button>
        ${productTypes.map((type) => `
            <button class="product-filter-button" type="button" data-type="${type}" aria-pressed="false">
                ${type}
            </button>
        `).join("")}
    `;

    const renderProductCard = (product) => {
            const type = product.type || "Other";
            return `
                <div class="product_item">
                <div class="card" data-id="${product.id}" data-type="${type}" role="link" tabindex="0">
                <div class="icon_heart" role="button" tabindex="0" aria-label="Add to favorites">
                <i class="fa-regular fa-heart"></i>
                </div>
                    <img
                        src="${product.img}"
                        class="card_img_top"
                        alt="${product.name}"
                    >
                     <div class="card_body">
                        <h5 class="card-title">
                            ${product.name}
                        </h5>
                        <p class="card_text">
                            ${product.description}
                        </p>
                        <a class="card_detail_link" href="../../view/webClient/productDetail.html?id=${product.id}">
                        See more
                        <img src="../../assets/images/arrow-right1.svg" alt="">
                        </a>
                     </div>
                </div>
                </div>
            `;
    };

    const renderProductGroup = (type, products) => `
        <section class="product_group col-12">
            <div class="product_group_header">
                <h2 class="product_group_title">${type}</h2>
                <button class="btn_view" type="button" data-type="${type}">
                    See All
                    <img src="../../assets/images/arrow-right1.svg" alt="">
                </button>
            </div>
            <div class="product_slider">
                <div class="product_nav">
                    <button class="product_arrow_product product_arrow_left" type="button" aria-label="Previous products">
                        <img src="../../assets/images/arrow_left.svg" alt="">
                    </button>
                    <button class="product_arrow_product product_arrow_right" type="button" aria-label="Next products">
                        <img src="../../assets/images/arrow_right.svg" alt="">
                    </button>
                </div>
                <div class="product_row owl-carousel">
                    ${products.map(renderProductCard).join("")}
                </div>
            </div>
        </section>
    `;

    const renderProducts = (selectedType = "all") => {
        const productGroups = productTypes
            .filter((type) => selectedType === "all" || type === selectedType)
            .map((type) => ({
                type,
                products: activeProducts.filter((product) => (product.type || "Other") === type)
            }));

        productList.innerHTML = productGroups
            .map(({ type, products }) => renderProductGroup(type, products))
            .join("");

        productList.querySelectorAll(".icon_heart").forEach((heart) => {
        const productId = heart.closest(".card")?.dataset?.id;
        const productData = arrProduct.find((product) => String(product.id) === String(productId));

        let toggleFavorite = () => {
            const isActive = heart.classList.toggle("active");
            const icon = heart.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-regular", !isActive);
                icon.classList.toggle("fa-solid", isActive);
            }

            heart.setAttribute("aria-pressed", String(isActive));

            if (productData) {
                syncProductCartState(productData, isActive);
            }
        };

        heart.addEventListener("click", toggleFavorite);
        heart.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleFavorite();
            }
        });
        });

        productList.querySelectorAll(".card[data-id]").forEach((card) => {
            const openProductDetail = () => {
                window.location.href = `../../view/webClient/productDetail.html?id=${card.dataset.id}`;
            };

            card.addEventListener("click", (event) => {
                if (event.target.closest(".icon_heart, .card_detail_link")) return;
                openProductDetail();
            });

            card.addEventListener("keydown", (event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                if (event.target.closest(".icon_heart, .card_detail_link")) return;

                event.preventDefault();
                openProductDetail();
            });
        });

        productList.querySelectorAll(".btn_view").forEach((button) => {
            button.addEventListener("click", () => {
                const selectedButton = productCategories.querySelector(
                    `.product-filter-button[data-type="${button.dataset.type}"]`
                );

                if (selectedButton) selectedButton.click();
            });
        });

        document.dispatchEvent(new CustomEvent("productsRendered"));
    };

    productCategories.querySelectorAll(".product-filter-button").forEach((button) => {
        button.addEventListener("click", () => {
            productCategories.querySelectorAll(".product-filter-button").forEach((item) => {
                const isActive = item === button;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            renderProducts(button.dataset.type);
        });
    });

    renderProducts();
    bindProductSearch(arrProduct);
}

export {renderData}