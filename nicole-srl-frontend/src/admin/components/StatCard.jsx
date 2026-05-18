import React from 'react';
import { Package, Users, ShoppingCart, Tag, TrendingUp, Star, Image, DollarSign, Shield, User, UserCheck } from 'lucide-react';

const iconMap = {
  package: Package,
  users: Users,
  cart: ShoppingCart,
  tag: Tag,
  trend: TrendingUp,
  star: Star,
  image: Image,
  dollar: DollarSign,
  shield: Shield,
  user: User,
  userCheck: UserCheck,
};

const StatCard = ({ icon, label, value, change, changeType }) => {
  const Icon = iconMap[icon] || Package;
  return (
    <div className="admin-stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="admin-stat-label">{label}</p>
          <p className="admin-stat-value">{value}</p>
          {change && (
            <p className={`admin-stat-change ${changeType === 'positive' ? 'text-emerald-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-500'}`}>
              {change}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
