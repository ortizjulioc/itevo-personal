import React, { ReactNode, MouseEventHandler } from 'react';
import classNames from 'classnames';

interface CardProps {
    children: ReactNode;
    className?: string;
    clickable?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
    bordered?: boolean;
    bodyClass?: string;
    header?: ReactNode | string;
    headerClass?: string;
    headerBorder?: boolean;
    headerExtra?: ReactNode;
    footer?: ReactNode | string;
    footerClass?: string;
    footerBorder?: boolean;
}

const Card: React.FC<CardProps> = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    const {
        className,
        clickable = false,
        onClick,
        bordered = false,
        bodyClass,
        header,
        headerClass,
        headerBorder = true,
        headerExtra,
        footer,
        footerClass,
        footerBorder = true,
        ...rest
    } = props;

    const cardClass = classNames(
        'card',
        className,
        bordered ? 'card-border' : 'card-shadow',
        clickable && 'cursor-pointer user-select-none'
    );

    const cardBodyClass = classNames('card-body', bodyClass);
    const cardHeaderClass = classNames(
        'card-header',
        headerBorder && 'card-header-border',
        headerExtra && 'card-header-extra',
        headerClass
    );
    const cardFooterClass = classNames(
        'card-footer',
        footerBorder && 'card-footer-border',
        footerClass
    );

    const renderHeader = () => {
        if (typeof header === 'string') {
            return <h4>{header}</h4>;
        }
        return <>{header}</>;
    };

    const handleCardClick: MouseEventHandler<HTMLDivElement> = (e) => {
        onClick?.(e);
    };

    return (
        <div className={cardClass} ref={ref} {...rest} onClick={handleCardClick}>
            {header && (
                <div className={cardHeaderClass}>
                    {renderHeader()}
                    {headerExtra && <span>{headerExtra}</span>}
                </div>
            )}
            <div className={cardBodyClass}>
                {props.children}
            </div>
            {footer && <div className={cardFooterClass}>{footer}</div>}
        </div>
    );
});

export default Card;
