import mongoose from "@/lib/dbConnect"; 
import Product from "@/models/product";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
   mongoose()
   const {_id} = req.query;

   if(isValidObjectId(_id)) {
        if(req.method == "GET") {
            const product = await Product.findById(_id)
            if(!product) return res.status(404).json({message: "Product not found", data: null});
            else return res.status(200).json({message: "Product", data: product});
        } 
        else if (req.method === "POST") {
            const result = await Product.findByIdAndUpdate(_id, req.body);
            if(!result) {
                res.status(404).json({message: "Product not found", data: null})
            }
            else {
                res.status(200).json({ message: "Product updated", data: result })
            }
        }
        else if (req.method === "PUT") {
            const result = await Product.findByIdAndUpdate(_id, req.body, {new: true});
            if(!result) {
                res.status(404).json({message: "Product not found", data: null})
            }
            else {
                res.status(200).json({ message: "Product updated", data: result })
            }
        }
        else if (req.method === "DELETE") {
            const result = await Product.findByIdAndDelete(_id);
            if(!result) {
                res.status(404).json({message: "Product not found", data: null})
            }
            else {
                res.status(200).json({ message: "Product deleted", data: null })
            }
        }
   }
   else {
    res.status(404).json({message: "Invalid product id", data: null})
   }
    

}
