import classNames from "classnames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ElementType;
    className?: string;
}

export default function Input({
    className = '',
    icon: Icon,
    ...rest
}: InputProps) {

    const inputClasses = classNames('form-input py-2 pr-11 peer', className);

    if (Icon) {
        return (
            <div className="relative">
                <input
                    className={` ${inputClasses} placeholder:tracking-widest pl-9 pr-9 sm:pr-4`}
                    {...rest}
                />
                <button type="button" className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto">
                    <Icon className="mx-auto" />
                </button>
            </div>
        );
    }

    return (
        <input
            className={inputClasses}
            {...rest}
        />
    );
}

