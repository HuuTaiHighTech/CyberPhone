
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

let renderData = (arrProduct) => {
    let contentTable = "";
    let activeProducts = arrProduct.filter((product) => {
        const deleted = String(product.deleted).toLowerCase();
        return deleted !== "true" && deleted !== "1";
    });
    let productGroups = activeProducts.reduce((groups, product) => {
        let type = product.type || "Other";
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(product);
        return groups;
    }, {});

    Object.entries(productGroups).forEach(([type, products]) => {
        contentTable += `
            <section class="product_group col-12">
                <div class="product_group_header">
                    <span class="product_group_title">${type}</span>
                    <button class="btn_view" type="button">
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
        `;

        products.forEach((product) => {
            contentTable += `
                <div class="product_item">
                <div class="card">
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
                        <button>
                        See more
                        <img src="../../assets/images/arrow-right1.svg" alt="">
                        </button>
                     </div>
                </div>
                </div>
            `;
        });

        contentTable += `
                    </div>
                </div>
            </section>
        `;
    });
    let productList = document.querySelector("#product_list");
    productList.innerHTML = contentTable;

    productList.querySelectorAll(".icon_heart").forEach((heart) => {
        let toggleFavorite = () => {
            const isActive = heart.classList.toggle("active");
            const icon = heart.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-regular", !isActive);
                icon.classList.toggle("fa-solid", isActive);
            }

            heart.setAttribute("aria-pressed", String(isActive));
        };

        heart.addEventListener("click", toggleFavorite);
        heart.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleFavorite();
            }
        });
    });
}

export {renderData}