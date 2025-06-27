import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { FiImage, FiX } from 'react-icons/fi';

interface ImageUploaderProps {
    value: string;
    onChange?: (base64: string) => void;
    onUpload?: (file: File) => void;
    onDelete?: () => void;
}

export default function ImageUploader({ value, onChange, onUpload, onDelete }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string>(value || '');

    useEffect(() => {
        setPreview(value || '');
    }, [value]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (onUpload) {
            onUpload(file); // Llama a la función onUpload si está definida
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPreview(base64);
            if (onChange) {
                onChange(base64); // Llama a la función onChange con el base64
            }
            if (inputRef.current) inputRef.current.value = ''; // Fix para poder volver a subir misma imagen
        };
        reader.readAsDataURL(file);

    };

    const triggerFileInput = () => {
        inputRef.current?.click();
    };

    const clearImage = () => {
        setPreview('');
        if (onChange) {
            onChange(''); // Llama a la función onChange con cadena vacía
        }
     
        if (onDelete) {
            onDelete();
        }
        if (inputRef.current) inputRef.current.value = ''; // Reset input
    };

    return (
        <div className="space-y-2">

            <div
                onClick={triggerFileInput}
                className={`cursor-pointer border-dashed border-2 rounded-md flex items-center justify-center px-4 py-8 transition w-1/3 ${preview ? 'border-transparent' : 'border-gray-300 hover:border-blue-400'
                    }`}
            >
                {!preview ? (
                    <div className="text-center text-gray-500 ">
                        <FiImage className="mx-auto text-4xl text-red-500" />
                        <p className="mt-2 font-medium">Arrastra y suelta o <span className="text-blue-600 underline">Navega</span></p>
                        <p className="text-xs text-gray-400 mt-1">Solo se permiten imágenes</p>
                    </div>
                ) : (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Vista previa"
                            className="w-40 h-40 object-contain rounded-md shadow"
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearImage();

                            }}
                            className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1 shadow hover:text-red-800"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
