import { AnimatePresence, motion } from "framer-motion";


interface FormItemProps {
    name?: string;
    label: string;
    invalid?: boolean;
    errorMessage?: string;
    asterisk?: boolean;
    extra?: React.ReactNode;
    children: React.ReactNode;
}

export default function FormItem({
    name,
    label,
    invalid,
    asterisk,
    extra,
    errorMessage,
    children
}: FormItemProps) {

    const enterStyle = { opacity: 1, marginTop: 3, bottom: -21 }
    const exitStyle = { opacity: 0, marginTop: -10 }
    const initialStyle = exitStyle

    return (
        <div className={`form-item mb-4 ${invalid ? 'has-error' : ''}`}>
            <label htmlFor={name}>
                {asterisk && (
                    <span className="text-red-500 mr-1">*</span>
                )}
                {label}
                {extra && <span className='ml-1'>{extra}</span>}
            </label>
            {children}
            {invalid && (
                <AnimatePresence mode="wait">
                    {invalid && (
                        <motion.div
                            className="text-danger"
                            initial={initialStyle}
                            animate={enterStyle}
                            exit={exitStyle}
                            transition={{ duration: 0.15, type: 'tween' }}
                        >
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};
