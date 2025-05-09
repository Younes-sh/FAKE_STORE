import {models, model, Schema} from 'mongoose';


const ProductSchema = new Schema ({
    productName: String,
    description: String,
    price: String,
    model: String,
    section: String,
    image: String,
    
});

const Product = models.Product || model ('Product', ProductSchema);
export default Product;