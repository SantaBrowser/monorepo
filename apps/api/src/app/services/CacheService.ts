const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 min

export class CacheService {
    static get(key: string) {
        const cached = cache.get(key);
        if (cached && (Date.now() - cached.timestamp < CACHE_EXPIRATION)) {
            return cached.data;
        }
        return null;
    }

    static set(key: string, data: any) {
        cache.set(key, { data, timestamp: Date.now() });
    }
}