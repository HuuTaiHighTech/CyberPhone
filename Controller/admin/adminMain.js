

//Hàm hiển thị danh sách
let hienThiDS = (mangSP) => {
    let contentTable = "";
    //duyệt mảng
    mangSP.map((sp, index) => {
        let trSP = `
        <tr>
            <td>${sp.id}</td>
            <td>${sp.img}</td>
            <td>${sp.name}</td>
            <td>
                <button class="btn btn-info" onclick="suaSP(${sp.id})" >
                <i class="fa-solid fa-pencil" title="Edit"></i></button>
                <button class="btn btn-danger" 
                onclick="xoaSP(${sp.id})" ><i class="fa-solid fa-trash" title="Delete"></i></button>
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


    }).catch((error) => {
        //!thất bại 
        console.log(error)
    })

}

//gọi hàm
getListMain()




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
