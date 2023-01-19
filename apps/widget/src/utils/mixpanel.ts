import mixpanel from 'mixpanel-browser';
import { API_URL, MIXPANEL_TOKEN } from '../config/secrets';

const MIXPANEL_PROXY = `${API_URL}/v1/data`;

const mixpanelClient = () => {
    mixpanel.init(MIXPANEL_TOKEN, { api_host: MIXPANEL_PROXY });
    return mixpanel;
};

export const track = {
    UserSignsIn: (account: TAccount) => {
        if (!MIXPANEL_TOKEN) return;

        const mixpanel = mixpanelClient();
        mixpanel.identify(account.sub);
        mixpanel.people.set('$name', `${account.firstName} ${account.lastName}`);
        mixpanel.people.set('$email', account.email);
        mixpanel.people.set('plan', account.plan);
        if (account.address) mixpanel.people.set('address', account.address);
        mixpanel.track('user signs in', { distinct_id: account.sub });
    },
    UserVisits: (sub: string, path: string, params: string[]) => {
        if (!MIXPANEL_TOKEN) return;

        mixpanelClient().track(`user visits ${path}`, { distinct_id: sub, params });
    },
    UserOpens: (sub: string, modal: string) => {
        if (!MIXPANEL_TOKEN) return;

        mixpanelClient().track(`user opens ${modal}`, { distinct_id: sub });
    },
    UserCreates: (sub = '', item: string) => {
        if (!MIXPANEL_TOKEN) return;

        mixpanelClient().track(`user creates ${item}`, { distinct_id: sub });
    },
};
