import ProviderComponent from '@/components/layouts/provider-component';
import { cookies } from 'next/headers';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import '../styles/global.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
    title: {
        template: '%s | [PRUEBAS] ITEVO - Software de facturación',
        default: '[PRUEBAS] ITEVO - Software de facturación y gestión de cursos',
    },
};
const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const lang = cookieStore.get('i18nextLng')?.value || 'en';

    return (
        <html lang="en">
            <body className={nunito.variable}>
                {/* BANNER DE PRUEBAS */}
                <div className="pointer-events-none fixed bottom-0 left-0 z-[99999] w-full bg-danger py-2 text-center text-sm font-bold tracking-widest text-white shadow-md">
                    ⚠️ ENTORNO DE PRUEBAS - LOS DATOS MOSTRADOS NO SON DE PRODUCCIÓN ⚠️
                </div>
                {/* MARCA DE AGUA FLOTANTE */}
                <div className="pointer-events-none fixed inset-0 z-[99998] flex items-center justify-center overflow-hidden opacity-[0.03]">
                    <div className="-rotate-45 transform whitespace-nowrap text-[10rem] font-black text-danger">VERSIÓN DE PRUEBA</div>
                </div>
                <NextTopLoader showSpinner={false} color="#f59e0b" />
                <ProviderComponent lang={lang}>{children}</ProviderComponent>
            </body>
        </html>
    );
}
