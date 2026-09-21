
//Get 
let getList = () => {

    return axios({
        method: 'get',
        url: 'https://svcy.myclass.vn/api/ProductApi/getall',

    })

}

//Create
let addSP = (sp) => {
    console.log("🚀 ~ :49 ~ addSP ~ sp:", sp)

    return axios({
        method: 'post',
        url: `https://svcy.myclass.vn/api/ProductApi/create`,
        data: sp
    })

}

//Read
let getSP = (maSPXem) => {
    console.log("🚀 ~ :61 ~ getSV ~ maSPXem:", maSPXem)

    return axios({
        method: 'get',
        url: `https://svcy.myclass.vn/api/ProductApi/get/${maSPXem}`
    })

}

//Update
let updateSP = (sp) => {

    return axios({
        method: 'put',
        url: `https://svcy.myclass.vn/api/ProductApi/update/${sp.id}`,
        data: sp
    })

}

//Delete
let deleteSP = (maSPXoa) => {

    return axios({
        method: 'delete',
        url: `https://svcy.myclass.vn/api/ProductApi/delete/${maSPXoa}`
    })

}


export { getList, addSP, deleteSP, getSP, updateSP };