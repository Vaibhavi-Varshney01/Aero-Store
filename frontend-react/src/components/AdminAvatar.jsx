import React from 'react';

/**
 * Modern SVG Illustrated Avatars for Admin & Store Management Profiles
 * Replaces old shirt/tie emojis with professional, diverse person avatars.
 */

export const ADMIN_AVATAR_PRESETS = [
  {
    id: 'avatar_director',
    label: 'Store Director (Alex)',
    role: 'Store Director',
    bg: ['#6366f1', '#4338ca'], // Indigo gradient
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_alex" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
          <clipPath id="clip_alex">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip_alex)">
          <circle cx="50" cy="50" r="50" fill="url(#bg_alex)" />
          {/* Shoulders / Shirt */}
          <path d="M18 96 C20 74 34 68 50 68 C66 68 80 74 82 96 Z" fill="#e0e7ff" />
          <path d="M42 68 L50 78 L58 68 Z" fill="#cbd5e1" />
          {/* Neck */}
          <rect x="44" y="54" width="12" height="16" rx="4" fill="#fcd34d" />
          {/* Head */}
          <ellipse cx="50" cy="44" rx="19" ry="22" fill="#fde68a" />
          {/* Hair */}
          <path d="M30 40 C30 22 42 16 50 16 C60 16 70 24 70 38 C70 38 65 30 52 30 C38 30 32 37 30 40 Z" fill="#1e293b" />
          {/* Glasses */}
          <circle cx="42" cy="43" r="5.5" fill="none" stroke="#1e293b" strokeWidth="1.8" />
          <circle cx="58" cy="43" r="5.5" fill="none" stroke="#1e293b" strokeWidth="1.8" />
          <path d="M47.5 43 L52.5 43" stroke="#1e293b" strokeWidth="1.8" />
          <circle cx="42" cy="43" r="1.8" fill="#1e293b" />
          <circle cx="58" cy="43" r="1.8" fill="#1e293b" />
          {/* Smile */}
          <path d="M45 54 Q50 58 55 54" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    )
  },
  {
    id: 'avatar_ops',
    label: 'Operations Lead (Sarah)',
    role: 'Operations Lead',
    bg: ['#10b981', '#047857'], // Emerald gradient
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_sarah" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <clipPath id="clip_sarah">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip_sarah)">
          <circle cx="50" cy="50" r="50" fill="url(#bg_sarah)" />
          {/* Long Hair Back */}
          <path d="M26 36 C24 60 28 80 32 95 L68 95 C72 80 76 60 74 36 Z" fill="#451a03" />
          {/* Shoulders */}
          <path d="M20 95 C22 75 35 70 50 70 C65 70 78 75 80 95 Z" fill="#d1fae5" />
          {/* Neck */}
          <rect x="44" y="55" width="12" height="16" rx="4" fill="#fed7aa" />
          {/* Head */}
          <ellipse cx="50" cy="44" rx="18" ry="21" fill="#ffedd5" />
          {/* Front Hair with bangs */}
          <path d="M30 40 C30 22 40 18 50 18 C62 18 70 24 70 40 C66 32 58 28 50 30 C42 28 34 32 30 40 Z" fill="#78350f" />
          {/* Eyes & Brows */}
          <circle cx="43" cy="43" r="2" fill="#1e293b" />
          <circle cx="57" cy="43" r="2" fill="#1e293b" />
          <path d="M40 39 Q43 37 46 39" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M54 39 Q57 37 60 39" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          {/* Smile */}
          <path d="M45 53 Q50 58 55 53" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
          {/* Gold Earrings */}
          <circle cx="31" cy="47" r="2.5" fill="#f59e0b" />
          <circle cx="69" cy="47" r="2.5" fill="#f59e0b" />
        </g>
      </svg>
    )
  },
  {
    id: 'avatar_regional',
    label: 'Regional Director (David)',
    role: 'Regional Director',
    bg: ['#0284c7', '#0369a1'], // Ocean blue gradient
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_david" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <clipPath id="clip_david">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip_david)">
          <circle cx="50" cy="50" r="50" fill="url(#bg_david)" />
          {/* Shoulders */}
          <path d="M18 95 C20 73 34 68 50 68 C66 68 80 73 82 95 Z" fill="#bae6fd" />
          {/* Neck */}
          <rect x="43" y="55" width="14" height="15" rx="4" fill="#fbcfe8" />
          {/* Head */}
          <ellipse cx="50" cy="43" rx="19" ry="21" fill="#fce7f3" />
          {/* Short Textured Hair */}
          <path d="M31 38 C31 22 41 17 50 17 C60 17 69 22 69 38 C65 28 55 24 50 25 C43 24 35 28 31 38 Z" fill="#0f172a" />
          {/* Beard */}
          <path d="M33 44 C33 63 67 63 67 44 C67 53 62 60 50 62 C38 60 33 53 33 44 Z" fill="#0f172a" opacity="0.9" />
          {/* Eyes */}
          <circle cx="43" cy="42" r="2" fill="#0f172a" />
          <circle cx="57" cy="42" r="2" fill="#0f172a" />
          {/* Smile */}
          <path d="M46 52 Q50 55 54 52" fill="none" stroke="#be185d" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    )
  },
  {
    id: 'avatar_gm',
    label: 'General Manager (Elena)',
    role: 'General Manager',
    bg: ['#ec4899', '#be185d'], // Rose/Pink gradient
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_elena" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>
          <clipPath id="clip_elena">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip_elena)">
          <circle cx="50" cy="50" r="50" fill="url(#bg_elena)" />
          {/* Voluminous Hair */}
          <path d="M22 45 C18 25 32 15 50 15 C68 15 82 25 78 45 C80 65 72 82 66 95 L34 95 C28 82 20 65 22 45 Z" fill="#b45309" />
          {/* Shoulders */}
          <path d="M22 95 C24 76 36 71 50 71 C64 71 76 76 78 95 Z" fill="#fce7f3" />
          {/* Neck */}
          <rect x="44" y="55" width="12" height="16" rx="4" fill="#fed7aa" />
          {/* Head */}
          <ellipse cx="50" cy="44" rx="18" ry="21" fill="#ffedd5" />
          {/* Front Curls */}
          <path d="M28 35 C32 24 42 22 50 22 C58 22 66 26 68 36 C62 30 56 28 50 29 C42 28 36 31 28 35 Z" fill="#92400e" />
          {/* Eyes */}
          <circle cx="43" cy="43" r="2.2" fill="#1e293b" />
          <circle cx="57" cy="43" r="2.2" fill="#1e293b" />
          {/* Smile */}
          <path d="M45 53 Q50 58 55 53" fill="none" stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </svg>
    )
  },
  {
    id: 'avatar_retail',
    label: 'Retail Operations (Marcus)',
    role: 'Retail Operations',
    bg: ['#f59e0b', '#d97706'], // Amber gradient
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_marcus" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <clipPath id="clip_marcus">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip_marcus)">
          <circle cx="50" cy="50" r="50" fill="url(#bg_marcus)" />
          {/* Shoulders */}
          <path d="M18 95 C20 73 34 68 50 68 C66 68 80 73 82 95 Z" fill="#fef3c7" />
          {/* Neck */}
          <rect x="43" y="55" width="14" height="15" rx="4" fill="#a16207" />
          {/* Head */}
          <ellipse cx="50" cy="44" rx="19" ry="21" fill="#ca8a04" />
          {/* Curly Hair Fade */}
          <path d="M30 38 C28 22 40 16 50 16 C60 16 72 22 70 38 C67 30 58 26 50 26 C42 26 34 30 30 38 Z" fill="#18181b" />
          {/* Eyes */}
          <circle cx="43" cy="42" r="2" fill="#18181b" />
          <circle cx="57" cy="42" r="2" fill="#18181b" />
          {/* Smile */}
          <path d="M44 53 Q50 58 56 53" fill="none" stroke="#451a03" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </svg>
    )
  },
  {
    id: 'avatar_corporate',
    label: 'Corporate Officer (Fatima)',
    role: 'Corporate Officer',
    bg: ['#8b5cf6', '#6d28d9'], // Purple gradient
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_fatima" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <clipPath id="clip_fatima">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip_fatima)">
          <circle cx="50" cy="50" r="50" fill="url(#bg_fatima)" />
          {/* Hijab / Wrap Back */}
          <path d="M22 45 C20 20 32 14 50 14 C68 14 80 20 78 45 C77 70 70 90 66 98 L34 98 C30 90 23 70 22 45 Z" fill="#312e81" />
          {/* Shoulders */}
          <path d="M20 96 C22 75 35 70 50 70 C65 70 78 75 80 96 Z" fill="#ede9fe" />
          {/* Face opening */}
          <ellipse cx="50" cy="46" rx="16" ry="19" fill="#fed7aa" />
          {/* Hijab Drape Frame */}
          <path d="M34 44 C34 30 42 26 50 26 C58 26 66 30 66 44 C66 58 58 64 50 64 C42 64 34 58 34 44 Z" fill="none" stroke="#312e81" strokeWidth="5" />
          {/* Eyes */}
          <circle cx="44" cy="44" r="2.2" fill="#1e1b4b" />
          <circle cx="56" cy="44" r="2.2" fill="#1e1b4b" />
          {/* Smile */}
          <path d="M45 54 Q50 58 55 54" fill="none" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    )
  },
  {
    id: 'avatar_branch',
    label: 'Branch Administrator (Kai)',
    role: 'Branch Administrator',
    bg: ['#06b6d4', '#0891b2'], // Cyan gradient
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_kai" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <clipPath id="clip_kai">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip_kai)">
          <circle cx="50" cy="50" r="50" fill="url(#bg_kai)" />
          {/* Shoulders */}
          <path d="M18 95 C20 73 34 68 50 68 C66 68 80 73 82 95 Z" fill="#cffafe" />
          {/* Neck */}
          <rect x="44" y="55" width="12" height="15" rx="4" fill="#fed7aa" />
          {/* Head */}
          <ellipse cx="50" cy="44" rx="18" ry="21" fill="#ffedd5" />
          {/* Side-swept Hair */}
          <path d="M28 38 C28 20 40 16 52 16 C64 16 72 22 72 38 C68 28 58 24 48 24 C36 24 32 30 28 38 Z" fill="#292524" />
          <path d="M46 16 C58 16 66 22 66 32 C60 26 52 24 46 24 Z" fill="#44403c" />
          {/* Eyes */}
          <circle cx="43" cy="43" r="2" fill="#1c1917" />
          <circle cx="57" cy="43" r="2" fill="#1c1917" />
          {/* Smile */}
          <path d="M45 53 Q50 57 55 53" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    )
  },
  {
    id: 'avatar_exec',
    label: 'Senior Executive (Arthur)',
    role: 'Senior Executive',
    bg: ['#64748b', '#334155'], // Slate gradient
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_arthur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <clipPath id="clip_arthur">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip_arthur)">
          <circle cx="50" cy="50" r="50" fill="url(#bg_arthur)" />
          {/* Shoulders */}
          <path d="M18 95 C20 73 34 68 50 68 C66 68 80 73 82 95 Z" fill="#f1f5f9" />
          {/* Neck */}
          <rect x="44" y="55" width="12" height="15" rx="4" fill="#fef08a" />
          {/* Head */}
          <ellipse cx="50" cy="44" rx="19" ry="21" fill="#fef9c3" />
          {/* Distinguished Silver Hair */}
          <path d="M30 40 C30 22 41 17 50 17 C60 17 70 22 70 40 C65 28 55 24 50 25 C43 24 35 28 30 40 Z" fill="#e2e8f0" />
          {/* Silver Sideburns */}
          <path d="M30 38 L32 46 L35 44 Z" fill="#cbd5e1" />
          <path d="M70 38 L68 46 L65 44 Z" fill="#cbd5e1" />
          {/* Round Wire Glasses */}
          <circle cx="42" cy="43" r="5" fill="none" stroke="#475569" strokeWidth="1.5" />
          <circle cx="58" cy="43" r="5" fill="none" stroke="#475569" strokeWidth="1.5" />
          <path d="M47 43 L53 43" stroke="#475569" strokeWidth="1.5" />
          <circle cx="42" cy="43" r="1.8" fill="#1e293b" />
          <circle cx="58" cy="43" r="1.8" fill="#1e293b" />
          {/* Smile */}
          <path d="M45 54 Q50 58 55 54" fill="none" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    )
  }
];

/**
 * Returns a valid avatar ID, ensuring old '👔' or '👨‍💼' shirt/tie values
 * are automatically migrated to a clean person avatar.
 */
export function getCleanAdminAvatar(savedValue) {
  if (
    !savedValue ||
    savedValue === '👔' ||
    savedValue === '🛡️' ||
    savedValue === '👨‍💼' ||
    savedValue === '📋' ||
    savedValue === '💼' ||
    savedValue === 'undefined' ||
    savedValue === 'null'
  ) {
    return 'avatar_director';
  }
  return savedValue;
}

/**
 * AdminAvatar component - renders crisp SVG vector person avatar.
 */
export default function AdminAvatar({ avatarId, size = 48, className = '', style = {} }) {
  const cleanId = getCleanAdminAvatar(avatarId);
  const preset = ADMIN_AVATAR_PRESETS.find((p) => p.id === cleanId) || ADMIN_AVATAR_PRESETS[0];

  return (
    <div
      className={`admin-svg-avatar-wrap ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        minWidth: typeof size === 'number' ? `${size}px` : size,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
        ...style
      }}
      title={preset.label}
    >
      {preset.render()}
    </div>
  );
}

export const SHIPPER_AVATAR_PRESETS = ADMIN_AVATAR_PRESETS.map((av, idx) => ({
  id: av.id,
  label: `Warehouse Shipper (${['Marcus', 'Sarah', 'David', 'Elena', 'James', 'Maya'][idx] || 'Lead'})`,
  role: 'Shipper',
  render: av.render
}));

export const DELIVERY_AVATAR_PRESETS = ADMIN_AVATAR_PRESETS.map((av, idx) => ({
  id: av.id,
  label: `Delivery Partner (${['John', 'Vikram', 'Carlos', 'Aisha', 'Sam', 'Ravi'][idx] || 'Driver'})`,
  role: 'Delivery Partner',
  render: av.render
}));
