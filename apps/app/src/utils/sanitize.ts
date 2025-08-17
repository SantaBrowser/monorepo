// Lightweight DOMPurify integration via CDN with fallback
// Usage: import { sanitizeHtml, sanitizeHtmlSync } from './sanitize'
// - sanitizeHtml(html) returns a Promise<string> and ensures DOMPurify is loaded
// - sanitizeHtmlSync(html) uses window.DOMPurify if present, else strips tags

const DOMPURIFY_CDN = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';

let domPurifyLoadPromise: Promise<void> | null = null;

function ensureDomPurify(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    if ((window as any).DOMPurify) return Promise.resolve();
    if (domPurifyLoadPromise) return domPurifyLoadPromise;

    domPurifyLoadPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${DOMPURIFY_CDN}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Failed to load DOMPurify')));
            return;
        }
        const s = document.createElement('script');
        s.src = DOMPURIFY_CDN;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load DOMPurify'));
        document.head.appendChild(s);
    });

    return domPurifyLoadPromise;
}

function getConfig() {
    return {
        // Allow structural/content tags used in About content
        ALLOWED_TAGS: [
            'b',
            'strong',
            'i',
            'em',
            'u',
            'br',
            'span',
            'p',
            'ul',
            'ol',
            'li',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'div',
            'section',
            'article',
            'blockquote',
            'pre',
            'code',
            'figure',
            'figcaption',
            'small',
            'sup',
            'sub',
            'hr',
            'table',
            'thead',
            'tbody',
            'tr',
            'th',
            'td',
            'img',
            'a',
        ],
        // Allow only safe attributes; keep styles and events forbidden
        ALLOWED_ATTR: [
            'class',
            // links
            'href',
            'target',
            'rel',
            // images
            'src',
            'srcset',
            'sizes',
            'alt',
            'loading',
            // tables
            'colspan',
            'rowspan',
            'scope',
        ],
        FORBID_ATTR: ['style', 'on*'],
        // Keep inner text when stripping unknown wrappers (e.g., <section>)
        KEEP_CONTENT: true,
        RETURN_TRUSTED_TYPE: false,
    } as any;
}

export async function sanitizeHtml(html: string): Promise<string> {
    try {
        await ensureDomPurify();
        const DP: any = (window as any).DOMPurify;
        if (DP?.sanitize) return DP.sanitize(html, getConfig());
    } catch (_) {
        // ignore
    }
    return sanitizeHtmlSync(html);
}

export function sanitizeHtmlSync(html: string): string {
    try {
        const DP: any = (typeof window !== 'undefined' && (window as any).DOMPurify) || null;
        if (DP?.sanitize) return DP.sanitize(html, getConfig());
    } catch (_) {
        // ignore
    }
    // Fallback: strip all tags
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (div) {
        div.innerHTML = html || '';
        return (div.textContent || div.innerText || '').toString();
    }
    return String(html || '');
}
