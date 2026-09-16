class Product {
    constructor(productForm){
        let {id, name, price, img, description, type, deleted} = productForm
        this.id = id;
        this.name = name;
        this.price = price;
        this.img = img;
        this.description = description;
        this.type = type;
        this.deleted = deleted;
    }
}