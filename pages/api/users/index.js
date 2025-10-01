// pages/api/users/index.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import dbConnect from '@/lib/dbConnect';
import User from "../../../models/user";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await dbConnect();

    // فقط ادمین
    const me = await User.findOne({ email: session.user.email }).select('+role');
    if (!me || me.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method === 'GET') {
      // query params
      const {
        page = 1,
        limit = 10,
        q = '',
        role,
        active,        // 'true' | 'false'
        country,
        sort = '-createdAt', // e.g. 'createdAt' or '-createdAt'
      } = req.query;

      const filters = {};
      if (q) {
        filters.$or = [
          { username: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { firstname: { $regex: q, $options: 'i' } },
          { lastname: { $regex: q, $options: 'i' } },
        ];
      }
      if (role) filters.role = role;
      if (typeof active !== 'undefined') filters.isActive = active === 'true';
      if (country) filters['address.country'] = { $regex: `^${country}$`, $options: 'i' };

      const pageNum = Math.max(parseInt(page, 10), 1);
      const perPage = Math.max(parseInt(limit, 10), 1);

      const [items, total] = await Promise.all([
        User.find(filters)
          .select('-password')
          .sort(sort)
          .skip((pageNum - 1) * perPage)
          .limit(perPage),
        User.countDocuments(filters),
      ]);

      return res.status(200).json({
        items,
        total,
        page: pageNum,
        pages: Math.ceil(total / perPage),
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
