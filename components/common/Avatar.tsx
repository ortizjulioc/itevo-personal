interface AvatarProps {
    initials: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Tamaños predefinidos
    color?: 'success' | 'primary' | 'info' | 'danger'; // Colores predefinidos
  }

  const sizeClasses = {
    xs: 'w-8 h-8 text-sm',
    sm: 'w-10 h-10 text-base',
    md: 'w-14 h-14 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
  };

  const colorClasses = {
    success: 'bg-success',
    primary: 'bg-primary',
    info: 'bg-info',
    danger: 'bg-danger',
  };

  const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', color="primary" }) => {
    return (
      <span
        className={`flex justify-center items-center rounded-full text-center object-cover text-white ${sizeClasses[size]} ${colorClasses[color]}`}
      >
        {initials}
      </span>
    );
  };

  export default Avatar;
