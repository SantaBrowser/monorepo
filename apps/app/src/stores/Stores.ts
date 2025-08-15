import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        currentTheme: 'dark' as 'light' | 'dark',
        preference: 'system' as 'system' | 'light' | 'dark',
    }),
    actions: {
        setTheme(theme: 'light' | 'dark') {
            this.currentTheme = theme;
        },
        applyTheme(theme: 'light' | 'dark') {
            this.currentTheme = theme;
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('data-theme', theme);
            }
        },
        setPreference(pref: 'system' | 'light' | 'dark') {
            this.preference = pref;
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('themePreference', pref);
                } catch (e) {
                    // ignore storage errors (private mode or quota)
                }
            }
            if (pref === 'system') {
                const mq = window.matchMedia('(prefers-color-scheme: dark)');
                this.applyTheme(mq.matches ? 'dark' : 'light');
            } else {
                this.applyTheme(pref);
            }
        },
        initFromStorage() {
            if (typeof window === 'undefined') return;
            try {
                const stored = localStorage.getItem('themePreference') as 'system' | 'light' | 'dark' | null;
                if (stored === 'light' || stored === 'dark' || stored === 'system') {
                    this.preference = stored;
                }
            } catch (e) {
                // ignore storage errors
            }
        },
    },
});
