// pages/api/products/[id].js
import dbConnect from "@/lib/dbConnect"; 
import Product from "@/models/product";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
  try {
    await dbConnect();
    
    // 🔥 اصلاح: استفاده از id به جای _id در پارامتر
    const { id } = req.query;

    console.log('🔍 Products API called with id:', id);
    console.log('🔍 Method:', req.method);

    if (!id || !isValidObjectId(id)) {
      console.error('❌ Invalid product ID:', id);
      return res.status(400).json({ 
        success: false,
        message: "Invalid product id", 
        data: null 
      });
    }

    switch (req.method) {
      case "GET":
        try {
          const product = await Product.findById(id);
          if (!product) {
            console.error('❌ Product not found:', id);
            return res.status(404).json({ 
              success: false,
              message: "Product not found", 
              data: null 
            });
          }
          
          console.log('✅ Product found:', product.productName);
          return res.status(200).json({ 
            success: true,
            message: "Product found", 
            data: product 
          });
        } catch (error) {
          console.error('❌ Error in GET:', error);
          return res.status(500).json({ 
            success: false,
            message: "Server error", 
            error: error.message 
          });
        }

      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ 
          success: false,
          message: `Method ${req.method} Not Allowed` 
        });
    }
  } catch (error) {
    console.error("❌ General error in products API:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
}