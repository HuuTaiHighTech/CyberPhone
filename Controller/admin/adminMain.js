import { Product } from "../../Model/admin/productService.js"
import { getList, addSP, deleteSP, getSP, updateSP } from "./callAPI.js"
import { Validation } from "./validation.js"

let validation = new Validation();
let arraySP = [];
const imageDirectory = "../../assets/images/";

const getImagePath = (imageName) => {
    const value = imageName.trim();

    if (!value || value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
        return value;
    }

    return `${imageDirectory}${value.replace(/^\.\//, "")}`;
};

// 1. Hàm hiển thị danh sách
let hienThiDS = (mangSP) => {
    let contentTable = "";
    mangSP.forEach((sp) => {
        // Kiểm tra link ảnh hợp lệ
        let imgValid = (sp.img && sp.img.trim() !== "" && sp.img !== 'string')
            ? sp.img
            : 'https://placehold.co/160x160?text=No+Image';

        let trSP = `
        <tr>
            <td>${sp.id}</td>
            <td>
                <img src="${imgValid}" alt="${sp.name}" 
                     style="width: 100px; height: 100px; object-fit: contain; border-radius: 4px;" 
                     onerror="this.onerror=null; this.src='https://placehold.co/160x160?text=Error+Img';" />
            </td>
            <td>${sp.name}</td>
            <td>
                <button class="btn btn-info" onclick="xemChiTiet('${sp.id}')">
                    <i class="fa-solid fa-pencil" title="Edit"></i>
                </button>
                <button class="btn btn-danger" onclick="xoaSP('${sp.id}')">
                    <i class="fa-solid fa-trash" title="Delete"></i>
                </button>
            </td>
        </tr>
        `;
        contentTable += trSP;
    });

    document.querySelector("#tblProduct").innerHTML = contentTable;
}

let getListMain = () => {
    let axiosObj = getList();
    axiosObj.then((result) => {
        hienThiDS(result.data);
        arraySP = result.data;
    }).catch((error) => {
        console.log(error);
    });
}
getListMain();

// 2. Lắng nghe sự kiện gõ URL để Live Preview ảnh
document.getElementById('img').addEventListener('input', function (e) {
    let url = getImagePath(e.target.value);
    let preview = document.getElementById('imagePreview');
    if (url) {
        preview.src = url;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
});

document.getElementById('update_img').addEventListener('input', function (e) {
    let url = getImagePath(e.target.value);
    let preview = document.getElementById('updateImagePreview');
    if (url) {
        preview.src = url;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
});

// 3. Hàm thêm sản phẩm
let themSP = (e) => {
    if (e) e.preventDefault();
    let { isRequired, isID } = validation;

    let id = document.querySelector('#id').value;
    let name = document.querySelector('#name').value;
    let price = document.querySelector('#price').value;
    let img = getImagePath(document.querySelector('#img').value);
    let description = document.querySelector('#description').value;
    let type = document.querySelector('#type').value;

    let isValid = true;
    isValid &= isRequired(id, "#err_required_id", "Mã sản phẩm không được để trống")
        && isID(arraySP, id, "#err_required_id", "Mã sản phẩm không được trùng");

    isValid &= isRequired(name, "#err_required_name", "Tên sản phẩm không được để trống");
    isValid &= isRequired(price, "#err_required_price", "Giá sản phẩm không được để trống");
    isValid &= isRequired(img, "#err_required_img", "Hình ảnh không được để trống");
    isValid &= isRequired(description, "#err_required_description", "Mô tả không được để trống");

    if (isValid) {
        let spForm = { id, name, price, img, description, type };
        let sp = new Product(spForm);

        addSP(sp).then((result) => {
            alert("Thêm sản phẩm thành công! 😀");
            closeModal();
            getListMain();
        }).catch((error) => {
            console.log(error);
        });
    }
}
document.querySelector('#addProductForm').onsubmit = themSP;

// 4. Hàm xem chi tiết sản phẩm
let xemChiTiet = (maSPXem) => {
    getSP(maSPXem).then((result) => {
        let sp = result.data;

        document.querySelector('#update_id').value = sp.id;
        document.querySelector('#update_name').value = sp.name;
        document.querySelector('#update_price').value = sp.price;
        document.querySelector('#update_img').value = sp.img || "";
        document.querySelector('#update_description').value = sp.description;
        document.querySelector('#update_type').value = sp.type;

        let preview = document.getElementById('updateImagePreview');
        if (sp.img && sp.img.trim() !== "" && sp.img !== 'string') {
            preview.src = sp.img;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }

        openUpdateModal();
    }).catch((error) => {
        console.log(error);
    });
}
window.xemChiTiet = xemChiTiet;

// 5. Hàm cập nhật sản phẩm
let capNhatSP = (e) => {
    if (e) e.preventDefault();
    let { isRequired } = validation;

    let id = document.querySelector('#update_id').value;
    let name = document.querySelector('#update_name').value;
    let price = document.querySelector('#update_price').value;
    let img = getImagePath(document.querySelector('#update_img').value);
    let description = document.querySelector('#update_description').value;
    let type = document.querySelector('#update_type').value;

    let isValid = true;
    isValid &= isRequired(name, "#err_required_nameUP", "Tên sản phẩm không được để trống");
    isValid &= isRequired(price, "#err_required_priceUP", "Giá sản phẩm không được để trống");
    isValid &= isRequired(img, "#err_required_imgUP", "Hình ảnh không được để trống");
    isValid &= isRequired(description, "#err_required_descriptionUP", "Mô tả không được để trống");

    if (isValid) {
        let spForm = { id, name, price, img, description, type };
        let sp = new Product(spForm);

        updateSP(sp).then((result) => {
            alert("Cập nhật sản phẩm thành công!");
            closeUpdateModal();
            getListMain();
        }).catch((error) => {
            console.log("Lỗi từ Backend:", error.response ? error.response.data : error);
        });
    }
}
document.querySelector('#btnUpdate').onclick = capNhatSP;

// 6. Hàm xóa sản phẩm
let xoaSP = (maSPXoa) => {
    if (confirm(`Bạn có chắc muốn xóa sản phẩm mã ${maSPXoa}?`)) {
        deleteSP(maSPXoa).then((result) => {
            alert(`Xóa sản phẩm có mã ${maSPXoa} thành công`);
            getListMain();
        }).catch((error) => {
            console.log(error);
        });
    }
}
window.xoaSP = xoaSP;


/**
 * 
 */
// 7. Xử lý đóng/mở Modal
const modal = document.getElementById('productModal');
const openModalBtn = document.getElementById('openModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeHeaderBtn = document.getElementById('closeHeaderBtn');
const addProductForm = document.getElementById('addProductForm');

function openModal() { modal.style.display = 'flex'; }
function closeModal() {
    modal.style.display = 'none';
    addProductForm.reset();
    document.getElementById('imagePreview').style.display = 'none';
}

openModalBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
closeHeaderBtn.addEventListener('click', closeModal);

const updateModal = document.getElementById('updateProductModal');
const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');
const closeUpdateHeaderBtn = document.getElementById('closeUpdateHeaderBtn');
const updateProductForm = document.getElementById('updateProductForm');

function openUpdateModal() { updateModal.style.display = 'flex'; }
function closeUpdateModal() {
    updateModal.style.display = 'none';
    updateProductForm.reset();
    document.getElementById('updateImagePreview').style.display = 'none';
}

cancelUpdateBtn.addEventListener('click', closeUpdateModal);
closeUpdateHeaderBtn.addEventListener('click', closeUpdateModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
    if (e.target === updateModal) closeUpdateModal();
});