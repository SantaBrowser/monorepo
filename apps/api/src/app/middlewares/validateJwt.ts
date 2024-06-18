import { expressjwt } from 'express-jwt';
const JWT_SECRET = 'a505648a93bac6b2ac6fcb207dec8d8aecb83deadd76d3719daa233997c8975b';
export const validateJwt = expressjwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: true,
});
