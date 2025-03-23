import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import '../styles/global.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
    title: {
        template: '%s | VRISTO - Multipurpose Tailwind Dashboard Template',
        default: 'VRISTO - Multipurpose Tailwind Dashboard Template',
    },
};
const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={nunito.variable}>
                <NextTopLoader showSpinner={false} color='#4361ee' />
                <ProviderComponent>{children}</ProviderComponent>
            </body>
        </html>
    );
}
