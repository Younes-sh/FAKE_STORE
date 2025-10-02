import dbConnect from "@/lib/dbConnect"; 
import Product from "@/models/product";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    await dbConnect();
    
    // استفاده از id به جای _id - چون در URL از [id] استفاده شده
    const { id } = req.query;

    console.log('🔍 Products API called with id:', id);
    console.log('🔍 Full query:', req.query);

    // بررسی وجود id
    if (!id || id === 'undefined') {
      console.error('❌ No product ID provided');
      return res.status(400).json({ 
        success: false,
        message: "Product ID is required", 
        data: null 
      });
    }

    // بررسی معتبر بودن ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('❌ Invalid MongoDB ObjectId:', id);
      return res.status(400).json({ 
        success: false,
        message: "Invalid product id format", 
        data: null 
      });
    }

    switch (req.method) {
      case "GET":
        try {
          console.log('🔍 Searching for product with id:', id);
          
          const product = await Product.findById(id);
          
          if (!product) {
            console.error('❌ Product not found in database:', id);
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
          console.error('❌ Database error in GET:', error);
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