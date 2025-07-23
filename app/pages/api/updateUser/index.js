import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      firstname,
      lastname,
      username,
      email,
      phone,
      address = {},
      currentPassword,
      newPassword
    } = req.body;

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // ✅ آدرس با ساختار آبجکت:
    if (address) {
      user.address = {
        street: address.street || user.address?.street || '',
        city: address.city || user.address?.city || '',
        postalCode: address.postalCode || user.address?.postalCode || '',
        number: address.number || user.address?.number || '',
        floor: address.floor || user.address?.floor || '',
        country: address.country || user.address?.country || ''
      };
    }

    // ✅ تغییر رمز عبور در صورت درخواست
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'رمز عبور فعلی اشتباه است' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return res.status(200).json({ message: 'پروفایل با موفقیت به‌روزرسانی شد' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'خطا در سرور' });
  }
}
