import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Setting from '@/components/layouts/setting';
import Sidebar from '@/components/layouts/sidebar';
import Portals from '@/components/portals';
import {getServerSession} from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/auth-options';

export default async function DefaultLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    return (
        <>
            {/* VERSIÓN DE PRUEBA - BANNER */}
            <div className="sticky top-0 z-50 bg-orange-500 text-white text-center text-sm font-semibold py-1.5 px-4 shadow">
                ⚠️ VERSIÓN DE PRUEBA — Este sistema es solo para entrenamiento. No realice operaciones reales.
            </div>

            {/* BEGIN MAIN CONTAINER */}
            <div className="relative">
                <Overlay />
                <ScrollToTop />

                {/* BEGIN APP SETTING LAUNCHER */}
                {/* <Setting /> */}
                {/* END APP SETTING LAUNCHER */}

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    <Sidebar />
                    {/* END SIDEBAR */}
                    <div className="main-content flex min-h-screen flex-col">
                        {/* BEGIN TOP NAVBAR */}
                        <Header user={session?.user} />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <ContentAnimation>{children}</ContentAnimation>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        <Footer />
                        {/* END FOOTER */}
                        <Portals />
                    </div>
                </MainContainer>
            </div>
        </>
    );
}
