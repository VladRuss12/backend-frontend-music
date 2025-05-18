import React from 'react';

export default function UserAvatar({ user, size = 64 }) {
  // Если пользователь не залогинен — показываем серую иконку
  if (!user) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#888',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* SVG иконка пользователя */}
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="#fff"
          style={{ display: 'block' }}
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 16-4 16 0" />
        </svg>
      </div>
    );
  }

  // Если есть аватар — показываем картинку
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.username || user.email}
        width={size}
        height={size}
        style={{ borderRadius: '50%', objectFit: 'cover' }}
      />
    );
  }

  // Если аватара нет — показываем первую букву имени/почты
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#888',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: size / 2,
        fontWeight: 600,
      }}
    >
      {(user.username || user.email || '?')[0].toUpperCase()}
    </div>
  );
}