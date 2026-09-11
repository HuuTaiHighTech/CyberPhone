import { URL_API } from "../../util/variable_global.js";
import { renderProducts } from "./productView.js";
const testAPI = async () => {
    try {

        const response = await axios({
            method: "GET",
            url: `${URL_API}/api/ProductApi/getall`
        });

        // console.log("Response:", response);
        // console.log("Data:", response.data);
        const products = response.data;
        console.log(products[0]);
    } catch (error) {

        console.log("API ERROR:", error);

    }
};
const getProducts = async () => {
    try {
        const response = await axios({
            method: "GET",
            url: `${URL_API}/api/ProductApi/getall`
        });

        console.log(response);
        console.log(response.data);

        renderProducts(response.data);

    } catch (error) {
        console.log(error);
    }
};
export { testAPI, getProducts };