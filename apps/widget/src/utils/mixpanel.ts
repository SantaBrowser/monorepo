import mixpanel from 'mixpanel-browser';
import { MIXPANEL_TOKEN } from '../config/secrets';

const mixpanelClient = () => {
    mixpanel.init(MIXPANEL_TOKEN);
    return mixpanel;
};

export const track = {
    UserSignsIn: (account: TAccount) => {
        const mixpanel = mixpanelClient();
        mixpanel.identify(account.sub);
        mixpanel.people.set('$name', `${account.firstName} ${account.lastName}`);
        mixpanel.people.set('$email', account.email);
        mixpanel.people.set('plan', account.plan);
        mixpanel.track('user signs in', { distinct_id: account.sub });
    },
    UserVisits: (sub: string, path: string, params: string[]) => {
        mixpanelClient().track(`user visits ${path}`, { distinct_id: sub, params });
    },
    UserOpens: (sub: string, modal: string) => {
        mixpanelClient().track(`user opens ${modal}`, { distinct_id: sub });
    },
    UserCreates: (sub = '', item: string) => {
        mixpanelClient().track(`user creates ${item}`, { distinct_id: sub });
    },
};
