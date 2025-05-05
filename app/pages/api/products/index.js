import MongoDB from "@/utils/mongoose";
import Product from "@/models/product";

export default async function handlerProduct (req , res) {
    MongoDB();
    if(req.method === "GET") {
        try {
            const products = await Product.find({});
            return res.status(200).json({products});
        }catch (error) {
            return res.status(500).json({message: "Internal server error"});
        }
    }
    if(req.method !== "POST") {
        return res.status(400).json({message: "This method is not allowed"});
    }else {
        const {productName, description, price, model, section, image} = req.body;
        if(!productName || !description || !price || !model || !section || !image) {
            return res.status(400).json({message: "All fields are required"});
        }
        try {
            await Product.create({productName, description, price, model, image});
            return res.status(200).json({message: "Product created successfully"});
        }catch (error) {
            return res.status(500).json({message: "Internal server error"});
        }
    }

}