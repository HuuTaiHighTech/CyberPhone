const eleproductlist = document.querySelector("#product_list");

export const renderProducts = (products) => {
    eleproductlist.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        eleproductlist.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100">

                    <img
                        src="${product.img}"
                        class="card-img-top"
                        style="height: 300px; object-fit: contain;"
                        alt="${product.name}"
                    >

                    <div class="card-body">
                        <h5 class="card-title">
                            ${product.name}
                        </h5>

                        <p class="card-text">
                            ${product.description}
                        </p>

                        <p class="text-danger fw-bold">
                            ${Number(product.price).toLocaleString("vi-VN")} VNĐ
                        </p>

                        <p class="card-text">
                            Loại: ${product.type}
                        </p>

                        <button
                            class="btn btn-primary"
                            data-id="${product.id}"
                        >
                            Xem chi tiết
                        </button>
                    </div>

                </div>
            </div>
        `;
    }
};