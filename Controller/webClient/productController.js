import { URL_API } from "../../util/variable_global.js";


const getList = () => {
    return axios ({
        method: 'get',
        url: `${URL_API}/api/ProductApi/getall`,
    })
};

const getProductById = (id) => {
    return axios({
        method: "get",
        url: `${URL_API}/api/ProductApi/get/${id}`,
    });
};

export { getList, getProductById };
