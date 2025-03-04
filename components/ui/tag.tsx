const Tag = ({ text, color, outline }: { text: string; color: string; outline?: boolean }) => {
  const baseClass = ' relative my-1 rounded border border-transparent px-2 py-0.5 text-xs font-semibold text-white'; // Clase base
  
  // Definir el color para el fondo y texto cuando no es outline
  const colorClass = `bg-blue-600 text-blue-100`;
  
  // Definir el color para borde y texto cuando es outline
  const outlineClass = `border-blue-600 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-700 dark:text-white`;
  
  return (
    <span className={`${baseClass} ${outline ? outlineClass : colorClass}`}>
      {text}
    </span>
  );
};

export default Tag;