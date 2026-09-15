
//Get 
let getList = () => {

    return axios({
        method: 'get',
        url: 'https://svcy.myclass.vn/api/ProductApi/getall',

    })

}

//Delete
let deleteSP = (maSPXoa) => {
    console.log("🚀 ~ :72 ~ deleteSP ~ maSPXoa:", maSPXoa)

    return axios({
        method: 'delete',
        url: `https://svcy.myclass.vn/api/ProductApi/delete/${maSPXoa}`
    })

}

