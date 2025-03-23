import Link from 'next/link';
import React from 'react';

const Error503 = () => {
   

   

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <div className="px-6 py-16 text-center font-semibold before:container before:absolute before:left-1/2 before:-translate-x-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#4361EE_0%,rgba(67,97,238,0)_50.73%)] before:aspect-square before:opacity-10 md:py-20">
                <div className="relative">
                    <img src={'/assets/images/error/401.png'} alt="503" className="mx-auto w-full max-w-xs object-cover md:max-w-xl" />
                    <p className="mt-5 text-base dark:text-white">Lo sentimos, no tienes permiso para acceder a esta página.</p>
                    <Link href="/" className="btn btn-gradient mx-auto !mt-7 w-max border-0 uppercase shadow-none">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Error503;
