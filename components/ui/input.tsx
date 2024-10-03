import classNames from "classnames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    field?: any;
    icon?: React.ElementType;
    className?: string;
}

export default function Input({
    field,
    className = '',
    icon: Icon,
    ...rest
}: InputProps) {

    console.log('props', rest);
    console.log('props', rest.disabled);

    const inputClasses = classNames(
        'form-input py-2 pr-11 peer disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]',
        { ' cursor-not-allowed text-gray-600 dark:text-gray-500': rest.disabled },
        className
    );

    if (Icon) {
        return (
            <div className="relative">
                <input
                    {...field}
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
            {...field}
            {...rest}
        />
    );
}

