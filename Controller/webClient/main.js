
import { getList } from "./productController.js";
import { renderData } from "./productView.js";
import ProductService from '../../Model/webClient/ProductService.js';

let productSer = new ProductService();

const updateArrowButtonState = (button, direction, isActive) => {
    const image = button.querySelector("img");
    if (!image) return;

    const imageName = direction === "left"
        ? `arrow_left${isActive ? "_color" : ""}.svg`
        : `arrow_right${isActive ? "_color" : ""}.svg`;

    image.src = `../../assets/images/${imageName}`;
    button.disabled = !isActive;
    button.setAttribute("aria-disabled", String(!isActive));
};

const initProductCarousel = () => {
    const $ = window.jQuery;

    if (!$ || !$.fn.owlCarousel) return;

    $("#product_list .product_row").each(function () {
        const $carousel = $(this);
        const $group = $carousel.closest(".product_group");
        const $leftButton = $group.find(".product_arrow_left");
        const $rightButton = $group.find(".product_arrow_right");

        const updateButtons = (event) => {
            const currentIndex = event.item.index;
            const visibleItems = event.page.size;
            const lastIndex = Math.max(event.item.count - visibleItems, 0);
            const canSlide = event.item.count > visibleItems;

            $leftButton.prop("hidden", !canSlide);
            $rightButton.prop("hidden", !canSlide);

            if (canSlide) {
                updateArrowButtonState($leftButton[0], "left", currentIndex > 0);
                updateArrowButtonState($rightButton[0], "right", currentIndex < lastIndex);
            }
        };

        $carousel.on("initialized.owl.carousel changed.owl.carousel refreshed.owl.carousel", updateButtons);

        $carousel.owlCarousel({
            items: 4,
            margin: 24,
            loop: false,
            nav: false,
            dots: false,
            smartSpeed: 650,
            // autoplay: true,
            // autoplayTimeout: 4000,
            // autoplayHoverPause: true
        });

        $leftButton.on("click", () => $carousel.trigger("prev.owl.carousel"));
        $rightButton.on("click", () => $carousel.trigger("next.owl.carousel"));
    });
};

let getListProduct = () => {
    let axiosObj = getList();
    axiosObj.then((result) => { 
        productSer.arrProduct = result.data;
        const products = productSer.getall();
        renderData(products);
        initProductCarousel();
    }).catch((error) => {
        console.log(error);
    })
}
getListProduct();
