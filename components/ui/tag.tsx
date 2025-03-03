const Tag = ({ text, color, outline }: { text: string; color: string; outline?: boolean }) => {
  const baseClass = 'badge px-4 py-1 rounded-full text-sm font-medium inline-block'; // Clase base
  
  // Definir el color para el fondo y texto cuando no es outline
  const colorClass = `bg-${color}-500 text-${color}-100`;
  
  // Definir el color para borde y texto cuando es outline
  const outlineClass = `border-${color}-500 text-${color}-500 hover:bg-${color}-100 dark:hover:bg-${color}-700 dark:text-white`;
  
  return (
    <span className={`${baseClass} ${outline ? outlineClass : colorClass}`}>
      {text}
    </span>
  );
};

export default Tag;