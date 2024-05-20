import jwt from 'jsonwebtoken';
import { AUTH_URL } from '../../config/secrets';

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAwaZ3afW0/zYy3HfJwAAr83PDdZvADuSJ6jTZk1+jprdHdG6P
zH9XaB6xhzvwTIJFcWuREkNSC06MDLCuvmZ8fj93FcNaZ2ZJ0LFvY4SODMDqFekE
5vD2Y15aSI2Y69qwKlVLphvEEXJ/FRqIHQX9wwCtwVsnqcLt/f5aNWRHyk2jwhz7
IBm+dLu9/CV8AsvE5ddgOYYbNk+SMCjznESZcMg1KRzbdawnOklzloc+Q0iCxQK7
022ukVxFbmT7U1hTVOTOzrruqBxptPDiutkKfOXebzYyZodlFFL5MWcatCWS3XL5
1KBIeKWny5mExZPzIf1ofGuJe0zxllw8olgMqQIDAQABAoIBAB6x2DO/cpURbjZr
9lqsrErGirDVoze5GfM5tVMa0cHXQ0g9TiXH+X7TfqhE4+38qC02M6SFbzfDl4db
ahdb/1ezj5ivgmDpYcHmnhVUKX/0BCa87L3+a8+MYRsm9ppL66iKJJeLxyRM1b/u
mKyhCnwiW2hOnpbWAwtDieD0qDx0kzkYLevG3MivaAe1rDD6gS2LhPy6tGtmemRv
uT03a1X9DEO0U45oDvhi0V6dm8jz/eBBybHt0WWNNi2c5PVjhIL3HfT2UMiNa0xf
O3g1eGc8bdVPW4z0Kz1g+H/uvguTEqKVq4yT8Y2LuF0Vm2MxptqAmxxJTyL5q0ZI
V7PDg0ECgYEAziWa0BWbX+cMfIJXNi89aMpgBqBLdvQt9rE/TGjVeViPBcG8AoRr
Osxzct6tMd+DQO3uzx5DES2FiM7gbOtpGKnLWjJImmCq2gPCtWXo74I8il5egJNh
vq03eP7wdcm+bFta4+ScGv2wAbx28y3+5fQZPqzUISz+2dM8Hxx9GO0CgYEA8Hs0
ap+FKD/nbRFfYMVLeP0WfJYuSpn9MF8FT73RSvCva4Ql0a3WbaZ5AMgLFGjm5nRp
idf5vPMaXbleDG1xZnkhhBXidwFmn4TCVvG/fiDjXOULuJ5qjKLv+5dTG72GDHGG
onNUwn1LQ3bJpGZ3VHIFJXOcQHl2Dxa6Cn7G9y0CgYBn0gyL67XasNRbCJG/mj8F
PZbq/2PCPuu/KDlG1C1e9bjiH1X+to4CiOFD4t27FmRWGP6ClS0Vw6VS502jzVOa
tjjR7i0egrzJG8e979tGdILk9O4HNzKtAzPC3jJgQACFNeUqjQIJneY8mZwWkP2k
9jCYnhYftzeKoJXQ3VoraQKBgQDiprxYYdDWhqRQH7eNNWZUufSfp8wpc8k19djD
t1uzDfXHl90tKnKXFfelzOTkb5pwSffOe0hd1aJcA4GopN3kfvYfz6CKGT/nyPCB
kYeyEL05qIbLkkNKGaelsJIb6xyUTctfAOQ6Cm0NQL/7urdtV6mSCsyR1+h1gC4I
BkTwYQKBgC7s9J9rRT23bx0NKyyHKu7/akAdC8m0YCohU5L7NNw0UZql0p8EQguh
bKhNO4+rlwh2VzIi5tVMQTYoUbaab8n17fdNxtfTsG0h4vj8q+7ab59GYf1TKn0R
JEn/NS0gRKfNh6bwZaSTfhFxALmKApVNTPm2UT9G5hADTcw4xTQf
-----END RSA PRIVATE KEY-----`;

export const jwksResponse = {
    keys: [
        {
            kty: 'RSA',
            use: 'sig',
            kid: 'qSjSTujaClXGGkwW4zdC1zpRHxAq099krc8TTFfXYlg',
            alg: 'RS256',
            e: 'AQAB',
            n: 'oGGYqftZswJRU_vfKDi7jFNgH20LOVfOgSYBu39GEvYWeygBTGuHmf2Ict7m70IKiFAY24kOhMnNjFJ6B0dxdBt5Hf3Kw-VoTKp1MDuy6_wao51WbR5G6II7ND3_2jucyNLeHpYwKHmk00yo4XTBlihNB_ogLCsblupHFceULfq5DN1whTGp-ZHTdYZaSZGXBC_v046vzqIqdKF785AzN56fBDlWhJ0CB9PdLSqj5hd91mxIbJqarHHWR844R5gOLE5ZMJMwX7SUgirFXhDo_VPVKJsP06SxGWBHe8HaYYi6DSXA7i59yBWyJy80F4t3OBTX-AWkzSfJ-_O9zPEBXQ',
        },
    ],
};

export function getToken(scope: string, outerSub?: string) {
    const payload: any = {
        scope,
    };

    if (scope === dashboardScopes) {
        payload.sub = sub;
    } else if (scope === walletScopes) {
        payload.sub = sub2;
    }

    if (outerSub) {
        payload.sub = outerSub;
    }

    const options = {
        header: { kid: '0' },
        algorithm: 'RS256',
        expiresIn: '1d',
        issuer: AUTH_URL,
    };

    let token;
    try {
        token = jwt.sign(payload, privateKey, options);
    } catch (err) {
        console.log(err);
        throw err;
    }

    return `Bearer ${token}`;
}

export const accountAddress = '0x287aAa0f0089069A115AF9D25f0adeB295b52964';
export const accountEmail = 'test@test.com';
export const accountSecret = 'mellon';
export const clientId = 'xxxxxxx';
export const sub = '6074cbdd1459355fae4b6a14';
export const sub2 = '6074cbdd1459355fae4b6a15';

export const dashboardScopes =
    'openid pools:read pools:write erc20:write erc20:read erc721:write erc721:read rewards:read rewards:write deposits:read deposits:write promotions:read promotions:write widgets:write widgets:read transactions:read swaprule:read swaprule:write claims:read';
export const dashboardAccessToken = getToken(dashboardScopes);
export const walletScopes =
    'openid rewards:read erc20:read erc721:read withdrawals:read withdrawals:write deposits:read deposits:write account:read account:write memberships:read memberships:write promotions:read payments:write payments:read relay:write transactions:read transactions:write swap:read swap:write swaprule:read claims:read wallets:read wallets:write';
export const walletAccessToken = getToken(walletScopes);
export const walletAccessToken2 = getToken(walletScopes, sub);
