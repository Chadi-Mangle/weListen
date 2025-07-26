import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';
import MainLayout from './layouts/MainLayout';
import { AppProvider } from '@/contexts/AppContext';
import PageTransition from './components/PageTransition';
import { PlayerProvider } from '@/contexts/AudioContext';

declare global {
    const route: typeof routeFn;
}

// const appName = import.meta.env.VITE_APP_NAME || 'WeListen';

createInertiaApp({
    title: (title) => `WeListen`,  
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        const page = pages[`./pages/${name}.tsx`];
        
        // Appliquer le MainLayout par défaut, SAUF pour les pages d'authentification
        // Pages à exclure : celles dans le dossier Auth/, Login, Register, etc.
        const isAuthPage = name.startsWith('auth/'); 

        // N'appliquer le layout MainLayout que si la page n'a pas déjà un layout
        // et si ce n'est pas une page d'authentification
        if (!page.default.layout && !isAuthPage) {
            page.default.layout = (page) => (
                <PageTransition>
                    <AppProvider>
                        <MainLayout>
                            {page}
                        </MainLayout>
                    </AppProvider>
                </PageTransition>
            );
        } 
        // Pour les pages d'auth sans layout défini, appliquer juste le PageTransition et AppProvider
        else if (!page.default.layout && isAuthPage) {
            page.default.layout = (page) => (
                <PageTransition>
                    <AppProvider>
                        {page}
                    </AppProvider>
                </PageTransition>
            );
        }
        
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <PlayerProvider>
                <App {...props} />
            </PlayerProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
