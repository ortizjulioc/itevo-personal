import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface CardProps {
  children: ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
  bordered?: boolean;
  bodyClass?: string;
  header?: ReactNode;
  headerClass?: string;
  headerBorder?: boolean;
  headerExtra?: ReactNode;
  footer?: ReactNode;
  footerClass?: string;
  footerBorder?: boolean;
  [key: string]: any; // Para aceptar el resto de las propiedades
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  clickable = false,
  onClick,
  bordered = false,
  bodyClass,
  header,
  headerClass,
  headerBorder = false,
  headerExtra,
  footer,
  footerClass,
  footerBorder = false,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        'mb-5 max-w-[30rem] w-full bg-white dark:bg-[#191e3a] shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border dark:border-[#1b2e4b] dark:shadow-none',
        bordered && 'border-white-light dark:border-[#1b2e4b]',
        clickable && 'cursor-pointer',
        className
      )}
      onClick={clickable ? onClick : undefined}
      {...rest}
    >
      {header && (
        <div
          className={classNames(
            'p-5',
            headerClass,
            headerBorder && 'border-b border-white-light dark:border-[#1b2e4b]'
          )}
        >
          <div className="flex justify-between items-center">
            {header}
            {headerExtra && <div>{headerExtra}</div>}
          </div>
        </div>
      )}

      <div className={classNames('p-5', bodyClass)}>
        {children}
      </div>

      {footer && (
        <div
          className={classNames(
            'p-5',
            footerClass,
            footerBorder && 'border-t border-white-light dark:border-[#1b2e4b]'
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
