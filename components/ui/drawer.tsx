'use client'
import { useEffect } from "react";
import { IconX } from "../icon";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({ open, onClose, children, title, className }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose}></div>
      )}

      <nav
        className={`fixed top-0 bottom-0 z-[51] w-full bg-white p-4 shadow-lg transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'
          } ltr:right-0 rtl:left-0 dark:bg-black ${className || 'max-w-[400px]'} flex flex-col`}
      >
        <div className="flex-none mb-4">
          <button
            type="button"
            className="absolute top-0 right-0 p-2"
            onClick={onClose}
          >
            <IconX className="h-5 w-5" />
          </button>

          {title && (
            <h4 className="text-lg font-semibold dark:text-white">{title}</h4>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
      </nav>
    </>
  );
};

export default Drawer;
