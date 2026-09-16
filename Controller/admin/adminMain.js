import { Product } from "../../Model/admin/productService.js"
import { getList, addSP, deleteSP, getSP, updateSP } from "./callAPI.js"
import { Validation } from "./validation.js"

let validation = new Validation();
let arraySP = [];

//Hàm hiển thị danh sách
let hienThiDS = (mangSP) => {
    let contentTable = "";
    //duyệt mảng
    mangSP.map((sp, index) => {

        // Kiểm tra link ảnh hợp lệ
        let imgValid = (sp.img && sp.img !== 'string')
            ? sp.img
            : 'https://placehold.co/160x160?text=No+Image';

        let trSP = `
        <tr>
            <td>${sp.id}</td>
            <td>
  <img src="${imgValid}" alt="${sp.name}" style="width: 160px; height: auto; object-fit: cover;" />
            </td>
            <td>${sp.name}</td>
            <td>
                <button class="btn btn-info" onclick="xemChiTiet('${sp.id}')" >
                <i class="fa-solid fa-pencil" title="Edit"></i></button>
                <button class="btn btn-danger" 
                onclick="xoaSP('${sp.id}')" ><i class="fa-solid fa-trash" title="Delete"></i></button>
            </td>
        </tr>
        `
        contentTable += trSP
    });

    document.querySelector("#tblProduct").innerHTML = contentTable

}

let getListMain = () => {
    let axiosObj = getList()

    //then() : phương thức thực hiện các code sau khi lấy data thành công
    // catch(): phương thức thực hiện các code khi lấy data thất bại

    axiosObj.then((result) => {
        //callback function 
        // then(tham số nhận kết quả khi lấy dữ liệu thành công, đặt tên: result, response )=> {}
        //?thành công
        console.log(result) //object result
        console.log(result.data) // lấy giá trị của thuộc tính data => lấy được mảng sinh viên
        //TODO: Hiển thị lên UI
        hienThiDS(result.data)
        arraySP = result.data

    }).catch((error) => {
        //!thất bại 
        console.log(error)
    })

}
//Gọi hàm
getListMain()

//Hàm thêm sản phẩm
let themSP = () => {

    // Object destructuring (bóc tách thuộc tính/ phương thức của object)
    let { isRequired, isID, isName } = validation

    let spForm = {}

    //?B1: lấy giá trị từ form
    let arrFormELE = document.querySelectorAll("#addProductForm .form-control");
    // console.log(arrFormELE); //id, value
    for (let element of arrFormELE) {
        // element từng thẻ input/select của form
        // element.id (tên thuộc tính của object), element.value
        // svForm['maSinhVien'] = value
        spForm[element.id] = element.value
    }

    let { id, name, price, description } = spForm

    //TODO B2: kiểm tra giá trị nhập 

    let isValid = true;
    //Kiểm tra id
    isValid &= isRequired(id, "#err_required_id", "Mã sản phẩm không được để trống")
        && isID(arraySP, id, "#err_required_id", "Mã sản phẩm không được trùng");

    //Kiểm tra tên
    isValid &= isRequired(name, "#err_required_name", "Tên sản phẩm không được để trống")
        && isID(arraySP, name, "#err_required_name", "Tên sản phẩm không được trùng");

    //Kiểm tra giá
    isValid &= isRequired(price, "#err_required_price", "Giá sản phẩm không được để trống");

    //Kiểm tra mô tả
    isValid &= isRequired(description, "#err_required_description", "Mô tả sản phẩm không được để trống");



    //TODO kết quả cuối cùng phải là true thì mới được thêm sv
    console.log("🚀 ~ :97 ~ themSV ~ isValid:", isValid)

    if (isValid) {
        //tất cả dữ liệu đều hợp lệ
        //?B3: Tạo đối tượng SV

        let sp = new Product(spForm)
        console.log(sp)

        //?B4: Gọi hàm để truyển data SV object xuống cho BE thông qua API
        let axiosObj = addSP(sp)
        axiosObj.then((result) => {
            //thành công
            console.log(result)
            alert("Thêm sản phẩm thành công! 😀")
            //Hiện thị lại DSSV
            closeModal()
            getListMain()

        }).catch((error) => {
            //! thất bại
            console.log(error)

        })
    }

}

document.querySelector('#btnCreate').onclick = themSP;

//Hàm xem sản phẩm
let xemChiTiet = (maSPXem) => {
    let axiosObj = getSP(maSPXem)
    axiosObj.then((result) => {

        let sp = result.data;

        document.querySelector('#update_id').value = sp.id;
        document.querySelector('#update_name').value = sp.name;
        document.querySelector('#update_price').value = sp.price;
        // document.querySelector('#updateProductImage').value = sp.img;
        document.querySelector('#update_description').value = sp.description;
        document.querySelector('#update_type').value = sp.type;

        const updateImagePreview = document.getElementById('updateImagePreview');
        if (sp.img && sp.img !== 'string') {
            updateImagePreview.src = sp.img;
            updateImagePreview.style.display = 'block';
        } else {
            updateImagePreview.src = '#';
            updateImagePreview.style.display = 'none';
        }

        openUpdateModal();
    }).catch((error) => {
        //! thất bại
        console.log(error)
    })
}
//Khai báo hàm xemChiTiet thành hàm public cho đối tượng window 
window.xemChiTiet = xemChiTiet;

// //Hàm cập nhật sản phẩm
// let capNhatSP = () => {
//     //B1: lấy giá trị từ form
//     let id = document.querySelector('#id').value;
//     let name = document.querySelector('#name').value;
//     let price = document.querySelector('#price').value;
//     // let img = document.querySelector('#img').value;
//     let description = document.querySelector('#description').value;
//     let type = document.querySelector('#type').value;

//     //TODO B2: kiểm tra giá trị nhập 

//     //?B3: Tạo đối tượng SV
//     let sp = new Product(id, name, price, description, type)

//     //?B4: Gọi hàm để truyển data SV object xuống cho BE thông qua API
//     let axiosObj = updateSP(sp)
//     axiosObj.then((result) => {
//         //thành công
//         console.log(result)
//         alert("Cập nhật sinh viên thành công")
//         getListMain();

//     }).catch((error) => {
//         //!thất bại
//         console.log(error)
//     })

// }

// document.querySelector('#btnUpdate').onclick = capNhatSP;


let capNhatSP = (e) => {
    if (e) e.preventDefault();
    let { isRequired } = validation;
    // Lấy dữ liệu từ các input của Form Update
    let id = document.querySelector('#update_id').value;
    let name = document.querySelector('#update_name').value;
    let price = document.querySelector('#update_price').value;
    let description = document.querySelector('#update_description').value;
    let type = document.querySelector('#update_type').value;
    // let img = document.querySelector('#updateImagePreview').src;
    let imgSrc = document.querySelector('#updateImagePreview').src;
    let img = (imgSrc && !imgSrc.startsWith('data:') && imgSrc !== 'http://127.0.0.1:5500/#')
        ? imgSrc
        : 'https://placehold.co/160x160?text=No+Image';

    // let sp = new Product({ id, name, price, img, description, type });
    // console.log("Dữ liệu gửi lên API update:", sp);

    let isValid = true;

    //Kiểm tra tên
    isValid &= isRequired(name, "#err_required_nameUP", "Tên sản phẩm không được để trống");

    //Kiểm tra giá
    isValid &= isRequired(price, "#err_required_priceUP", "Giá sản phẩm không được để trống");

    //Kiểm tra mô tả
    isValid &= isRequired(description, "#err_required_descriptionUP", "Mô tả sản phẩm không được để trống");

    if (isValid) {
        let spForm = {
            id: id, // Khóa ID đảm bảo tên field là "id"
            name: name,
            price: price,
            img: img,
            description: description,
            type: type
        };

        let sp = new Product(spForm);

        let axiosObj = updateSP(sp);
        axiosObj.then((result) => {
            console.log(result)
            alert("Cập nhật sản phẩm thành công!");
            closeUpdateModal(); // Đóng modal
            getListMain();       // Tải lại danh sách
        }).catch((error) => {
            // console.log(error);
            console.log("Lỗi từ Backend:", error.response ? error.response.data : error);
        });
    }
}

// Gán sự kiện click cho nút Update
document.querySelector('#btnUpdate').onclick = capNhatSP;



//Hàm xoá sản phẩm 
let xoaSP = (maSPXoa) => {
    let axiosObj = deleteSP(maSPXoa)
    axiosObj.then((result) => {
        // thành công
        console.log(result)
        alert(`Xóa sản phẩm có mã ${maSPXoa} thành công`)
        getListMain()

    }).catch((error) => {
        //! thất bại
        console.log(error)
    })

}
window.xoaSP = xoaSP;



/*
*/
// Lấy các phần tử DOM
const modal = document.getElementById('productModal');
const openModalBtn = document.getElementById('openModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeHeaderBtn = document.getElementById('closeHeaderBtn');
const addProductForm = document.getElementById('addProductForm');

// Hàm mở Modal
function openModal() {
    modal.style.display = 'flex';
}

// Hàm đóng Modal & Reset form
function closeModal() {
    modal.style.display = 'none';
    addProductForm.reset(); // Xóa dữ liệu cũ đã nhập trong form
}

// 1. Sự kiện khi click nút "+ Thêm mới sản phẩm"
openModalBtn.addEventListener('click', openModal);

// 2. Sự kiện đóng Modal khi click nút "Hủy bỏ" hoặc dấu "X"
cancelBtn.addEventListener('click', closeModal);
closeHeaderBtn.addEventListener('click', closeModal);

// 3. Đóng Modal khi người dùng click ra vùng nền tối bên ngoài
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

const productImageInput = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');

// 1. Lắng nghe sự kiện người dùng chọn file ảnh
productImageInput.addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (file) {
        // Dùng FileReader để đọc thông tin file ảnh
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result; // Gán dữ liệu ảnh vào thẻ img
            imagePreview.style.display = 'block'; // Hiển thị khung ảnh
        };

        reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
    } else {
        // Nếu không có file nào được chọn
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
    }
});

/**
 * JS cho From Update
 */
// Lấy các phần tử DOM của Form Update
const updateModal = document.getElementById('updateProductModal');
const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');
const closeUpdateHeaderBtn = document.getElementById('closeUpdateHeaderBtn');
const updateProductForm = document.getElementById('updateProductForm');

// Hàm MỞ Modal Update
function openUpdateModal() {
    updateModal.style.display = 'flex';
}

// Hàm ĐÓNG Modal Update
function closeUpdateModal() {
    updateModal.style.display = 'none';
    updateProductForm.reset();
    document.getElementById('updateImagePreview').style.display = 'none';
}

// Gán sự kiện Đóng
cancelUpdateBtn.addEventListener('click', closeUpdateModal);
closeUpdateHeaderBtn.addEventListener('click', closeUpdateModal);

// Xử lý xem trước ảnh riêng cho Form Update
document.getElementById('updateProductImage').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const preview = document.getElementById('updateImagePreview');
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Đóng modal khi click ngoài nền đen (cho cả 2 modal)
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
    if (e.target === updateModal) closeUpdateModal();
});



