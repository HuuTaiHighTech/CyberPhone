/**
* Tạo class Product 
* + thuộc tính dựa vào đặc tả BE
* + đặt tên thuộc tính theo BE
* "id": "string",
    "name": "string",
    "price": "string",
    "img": "string",
    "description": "string",
    "type": "string",
    "deleted": true
*/

export class Product {
    constructor(spForm) {
        let { id, name, price, img, description, type } = spForm
        // thuộc tính
        this.id = id;
        this.name = name;
        this.price = price;
        this.img = img;
        this.description = description;
        this.type = type;
    }
}


