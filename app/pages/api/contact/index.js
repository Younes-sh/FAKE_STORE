import Contact from "@/models/contact";
import connectDB from "@/lib/dbConnect";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { name, email, message } = req.body;
      
      const newContact = new Contact({
        name,
        email,
        message
      });

      await newContact.save();
      
      return res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: newContact
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }

  if (req.method === "GET") {
    try {
      const { page = 1, limit = 10, status } = req.query;
      
      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }

      const contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Contact.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({
    success: false,
    message: `Method ${req.method} Not Allowed`
  });
}