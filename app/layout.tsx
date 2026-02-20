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
        template: '%s | ITEVO - Software de facturación y gestión de cursos',
        default: 'ITEVO - Software de facturación y gestión de cursos',
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
                <NextTopLoader showSpinner={false} color='#4361ee' />
                <ProviderComponent lang={lang}>{children}</ProviderComponent>
            </body>
        </html>
    );
}
