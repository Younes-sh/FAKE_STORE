import { getSession } from 'next-auth/react';
import User from '@/models/User'; // اصلاح مسیر import
import dbConnect from '@/lib/dbConnect'; // اصلاح مسیر import

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    switch (req.method) {
      case 'POST':
        const user = await User.findOne({ email: session.user.email })
          .select('-password -__v'); // حذف فیلدهای حساس
        
        if (!user) {
          console.log('User not found for email:', session.user.email); // لاگ ایمیل
          return res.status(404).json({ message: 'User not found' });
        }
        
        console.log('Found user:', user); // لاگ کاربر یافت شده
        return res.status(200).json(user);

      case 'PUT':
        const { firstname, lastname } = req.body;
        
        const updatedUser = await User.findOneAndUpdate(
          { email: session.user.email },
          { 
            firstname,
            lastname,
            updatedAt: new Date() 
          },
          { new: true, select: '-password -__v' }
        );
        
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json(updatedUser);

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error); // لاگ خطاها
    return res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
}