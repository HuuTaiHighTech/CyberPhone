/**
 * Lớp Product Service
 * Giúp lưu trữ và quản lý nhiều đối tượng product
 * 
 * CRUD
 * Creat, read, update, delete
 */

export default class ProductService {
    constructor(){
        this.arrProduct = []; //mảng đổi tượng sản phẩm
    }

    /**
     * Phương thức
     * input: Đối tượng product
     * output: Xuất hiện sản phẩm mới trong mảng sản phẩm
     */
    getall(){
       return this.arrProduct;
    }
}