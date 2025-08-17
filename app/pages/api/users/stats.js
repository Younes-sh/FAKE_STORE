// pages/api/users/stats.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import mongoose from 'mongoose';

function startOfMonth(date) {
  const d = new Date(date);
  d.setUTCDate(1);
  d.setUTCHours(0,0,0,0);
  return d;
}

function addMonths(date, n) {
  const d = new Date(date);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d;
}

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

    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { type = 'monthly', months = 12, top = 10 } = req.query;

    if (type === 'monthly') {
      // ثبت‌نام ماه به ماه برای N ماه اخیر
      const count = Math.max(parseInt(months, 10), 1);
      const end = startOfMonth(new Date());           // اول ماه جاری
      const start = addMonths(end, -count + 1);       // اول ماه N-1 ماه قبل

      const pipeline = [
        { $match: { createdAt: { $gte: start, $lt: addMonths(end, 1) } } },
        {
          $group: {
            _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
            users: { $sum: 1 }
          }
        },
        { $sort: { '_id.y': 1, '_id.m': 1 } }
      ];

      const data = await User.aggregate(pipeline);

      // خروجی به صورت آرایه‌ی کامل (حتی ماه‌های صفر)
      const out = [];
      for (let i = 0; i < count; i++) {
        const d = addMonths(start, i);
        const y = d.getUTCFullYear();
        const m = d.getUTCMonth() + 1;
        const found = data.find(it => it._id.y === y && it._id.m === m);
        out.push({
          year: y,
          month: m,           // 1..12
          label: `${y}-${String(m).padStart(2, '0')}`,
          users: found ? found.users : 0
        });
      }
      return res.status(200).json(out);
    }

    if (type === 'roles') {
      const byRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $project: { _id: 0, role: '$_id', count: 1 } },
        { $sort: { count: -1 } }
      ]);
      return res.status(200).json(byRole);
    }

    if (type === 'active') {
      const byActive = await User.aggregate([
        { $group: { _id: '$isActive', count: { $sum: 1 } } },
        { $project: { _id: 0, isActive: '$_id', count: 1 } },
        { $sort: { count: -1 } }
      ]);
      return res.status(200).json(byActive);
    }

    if (type === 'countries') {
      const topN = Math.max(parseInt(top, 10), 1);
      const byCountry = await User.aggregate([
        { $group: { _id: { $ifNull: ['$address.country', 'Unknown'] }, count: { $sum: 1 } } },
        { $project: { _id: 0, country: '$_id', count: 1 } },
        { $sort: { count: -1, country: 1 } },
        { $limit: topN }
      ]);
      return res.status(200).json(byCountry);
    }

    if (type === 'cities') {
      const topN = Math.max(parseInt(top, 10), 1);
      const byCity = await User.aggregate([
        { $group: { _id: { $ifNull: ['$address.city', 'Unknown'] }, count: { $sum: 1 } } },
        { $project: { _id: 0, city: '$_id', count: 1 } },
        { $sort: { count: -1, city: 1 } },
        { $limit: topN }
      ]);
      return res.status(200).json(byCity);
    }

    return res.status(400).json({ message: 'Invalid type' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
