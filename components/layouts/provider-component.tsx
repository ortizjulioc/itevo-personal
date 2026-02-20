'use client';
import App from '@/App';
import store from '@/store';
import { Provider } from 'react-redux';
import React, { ReactNode, Suspense } from 'react';
import Loading from '@/components/layouts/loading';
import { SessionProvider } from 'next-auth/react';

interface IProps {
    children?: ReactNode;
    lang?: string;
}

const ProviderComponent = ({ children, lang }: IProps) => {
    return (
        <SessionProvider  >
            <Provider store={store}>
                <Suspense fallback={<Loading />}>
                    <App lang={lang}>{children} </App>
                </Suspense>
            </Provider>
        </SessionProvider>
    );
};

export default ProviderComponent;
