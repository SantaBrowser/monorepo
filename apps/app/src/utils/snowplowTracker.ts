import {
    newTracker,
    trackPageView,
    BrowserTracker,
    setUserId,
    addGlobalContexts,
    SelfDescribingJson,
} from '@snowplow/browser-tracker';
// No imports needed for cookie handling

let tracker: BrowserTracker | null | undefined;

// Get client ID from cookie
const getClientId = (): string | undefined => {
    // Try to get existing client ID from cookie
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('clid=')) {
            return cookie.substring(5); // Return the value after 'clid='
        }
    }

    // If no client ID exists in cookies, return undefined
    return undefined;
};

const initializeTracker = (endpoint: string) => {
    // Get the client ID
    const clientId = getClientId();

    // Initialize the tracker with reduced tracking
    tracker = newTracker('rewards', endpoint, {
        appId: 'rewards',
        plugins: [],
        stateStorageStrategy: 'cookie', // Use cookies instead of localStorage
        eventMethod: 'post', // Use POST method for events
        bufferSize: 1, // Send events immediately instead of batching
        maxPostBytes: 40000, // Limit post size
        respectDoNotTrack: true, // Respect browser's Do Not Track setting
        contexts: {
            webPage: false, // Disable automatic web page context
            session: false, // Disable automatic session tracking
            browser: false, // Disable automatic browser context
        },
    });

    // We're not using activity tracking to reduce calls
    // Instead, we'll track only on page load and route changes

    // Add the user context with client ID if available
    if (tracker && clientId) {
        // Define the user context schema as a SelfDescribingJson object
        const userContext: SelfDescribingJson<{ clid: string }> = {
            schema: 'iglu:com.santabrowser/user_context/jsonschema/1-0-0',
            data: {
                clid: clientId,
            },
        };

        // Add the context to all events
        addGlobalContexts([userContext]);

        // Set the user ID to match the client ID for consistency
        setUserId(clientId);

        console.log(`Snowplow initialized with client ID: ${clientId}`);
    } else if (tracker) {
        console.log('Snowplow initialized without client ID (no clid cookie found)');
    }
};

/**
 * Track a page view event
 * This should be called on route changes
 */
const trackPageViewEvent = () => {
    if (tracker) {
        console.log('Tracking page view');
        trackPageView();
    }
};

/**
 * @deprecated Use trackPageViewEvent directly instead
 */
const useTrackPageview = () => {
    if (tracker) {
        trackPageViewEvent();
    }
};

const isTrackerInitialized = () => tracker !== undefined;

export { tracker, initializeTracker, useTrackPageview, isTrackerInitialized, trackPageViewEvent };
