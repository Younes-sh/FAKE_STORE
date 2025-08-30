import MongoDB from "@/lib/dbConnect";
import Product from "@/models/product";

export default async function handlerProduct(req, res) {
  await MongoDB(); // اضافه کردن await
  
  if (req.method === "GET") {
    try {
      const products = await Product.find({});
      return res.status(200).json({ products });
    } catch (error) {
      console.error("GET Error:", error);
      // بازگرداندن پیام خطای واقعی در محیط توسعه
      if (process.env.NODE_ENV === 'development') {
        return res.status(500).json({ message: "Internal server error", error: error.message });
      } else {
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  if (req.method === "POST") {
    const { productName, description, price, model, section, image } = req.body;
    
    // اعتبارسنجی
    if (!productName || !description || !price || !model || !section || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const newProduct = await Product.create({
        productName,
        description,
        price: Number(price), // تبدیل به عدد
        model,
        section, // اضافه کردن section که قبلا فراموش شده بود
        image
      });
      
      return res.status(201).json({ // تغییر status به 201 برای ایجاد موفق
        message: "Product created successfully",
        product: newProduct // ارسال محصول ایجاد شده در پاسخ
      });
    } catch (error) {
      console.error("POST Error:", error); // اضافه کردن لاگ خطا
      return res.status(500).json({ 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // برای سایر متدها
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: "Method not allowed" });
}