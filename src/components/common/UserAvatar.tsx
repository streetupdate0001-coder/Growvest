import React from 'react';
import { UserProfile } from '../../types';

interface UserAvatarProps {
  user: UserProfile | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showStatus?: boolean;
  showRoleBadge?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  showStatus = false,
  showRoleBadge = false,
  className = ''
}) => {
  const getInitials = () => {
    if (!user) return 'GZ';
    const first = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const last = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    if (first && last) return `${first}${last}`;
    if (first) return first;
    if (user.username) return user.username.substring(0, 2).toUpperCase();
    if (user.email) return user.email.substring(0, 2).toUpperCase();
    return 'GZ';
  };

  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl font-bold'
  }[size];

  const statusSize = {
    xs: 'w-2 h-2 ring-1',
    sm: 'w-2.5 h-2.5 ring-1.5',
    md: 'w-3 h-3 ring-2',
    lg: 'w-3.5 h-3.5 ring-2',
    xl: 'w-4 h-4 ring-2',
    '2xl': 'w-5 h-5 ring-3'
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`} id="user-avatar-container">
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user ? `${user.firstName} ${user.lastName}` : 'User Profile'}
          className={`${sizeClasses} rounded-full object-cover ring-1 ring-slate-700/50 shadow-sm`}
          referrerPolicy="no-referrer"
          id="user-avatar-img"
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full bg-gradient-to-tr from-slate-900 via-emerald-950 to-teal-900 text-emerald-300 font-semibold flex items-center justify-center ring-1 ring-emerald-500/30 shadow-inner font-mono tracking-tight`}
          id="user-avatar-initials"
        >
          {getInitials()}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ${statusSize} ring-slate-950 ${
            user?.accountStatus === 'suspended'
              ? 'bg-rose-500'
              : user?.verificationStatus === 'verified' || user?.verificationStatus === 'tier2_verified'
              ? 'bg-emerald-500'
              : 'bg-amber-500'
          }`}
          title={`Status: ${user?.accountStatus || 'Active'}`}
        />
      )}

      {showRoleBadge && user?.role === 'admin' && (
        <span
          className="absolute -top-1 -right-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-1 rounded-full tracking-wider"
          title="Institutional Administrator"
        >
          ADMIN
        </span>
      )}
    </div>
  );
};
