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

const renderProductDetail = (product) => {
	const detailContainer = document.querySelector("#product_Detail");

	if (!detailContainer) return;

	if (!product) {
		detailContainer.innerHTML = `
			<div class="product-detail-empty">
				<h1>Product not found</h1>
				<a href="../../view/webClient/products.html">Back to products</a>
			</div>
		`;
		return;
	}

	const price = Number(product.price);
	const formattedPrice = Number.isFinite(price)
		? price.toLocaleString("vi-VN", {
				style: "currency",
				currency: "VND"
			})
		: "Updating";

	detailContainer.innerHTML = `
		<div class="col-12">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item"><a href="../../index.html">Home</a></li>
					<li class="breadcrumb-separator" aria-hidden="true">
						<img src="../../assets/images/arrowRight.svg" alt="">
					</li>
					<li class="breadcrumb-item">
						<a href="../../view/webClient/products.html">Products</a>
					</li>
					<li class="breadcrumb-separator" aria-hidden="true">
						<img src="../../assets/images/arrowRight.svg" alt="">
					</li>
					<li class="breadcrumb-item active" aria-current="page">
						${product.name || "Product"}
					</li>
				</ol>
			</nav>
		</div>
		<div class="product-detail-image-column">
			<div class="product-detail-image-wrapper">
				<img class="product-detail-image" src="${product.img}" alt="${product.name}">
			</div>
		</div>
		<div class="product-detail-content">
			<div class="product-detail-type-row">
				<span class="product-detail-type">${product.type || "Other"}</span>
				<div class="icon_heart" role="button" tabindex="0" aria-label="Add to favorites" aria-pressed="false">
					<i class="fa-regular fa-heart"></i>
				</div>
			</div>
			<h1 class="product-detail-name">${product.name || "Unnamed product"}</h1>
			<div class="product-detail-field">
				<span class="product-detail-label">Description</span>
				<p class="product-detail-description">${product.description || "No description available."}</p>
			</div>
			<div class="product-detail-meta">
				<div class="product-detail-field">
					<span class="product-detail-label">Price</span>
					<strong class="product-detail-price">${formattedPrice}</strong>
				</div>
			</div>
		</div>
	`;

	const heart = detailContainer.querySelector(".icon_heart");
	const toggleFavorite = () => {
		const isActive = heart.classList.toggle("active");
		const icon = heart.querySelector("i");

		icon.classList.toggle("fa-regular", !isActive);
		icon.classList.toggle("fa-solid", isActive);
		heart.setAttribute("aria-pressed", String(isActive));

		if (product) {
			syncProductCartState(product, isActive);
		}
	};

	heart.addEventListener("click", toggleFavorite);
	heart.addEventListener("keydown", (event) => {
		if (event.key !== "Enter" && event.key !== " ") return;

		event.preventDefault();
		toggleFavorite();
	});
};

export { renderProductDetail };
