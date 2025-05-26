// pages/api/updateUser/index.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; // مسیر دقیق فایل auth
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
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
      address,
      currentPassword,
      newPassword,
    } = req.body;

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // اگر کاربر می‌خواهد رمز عبور را تغییر دهد
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
