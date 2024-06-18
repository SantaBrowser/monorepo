import jwt from 'jsonwebtoken';

const JWT_SECRET = 'a505648a93bac6b2ac6fcb207dec8d8aecb83deadd76d3719daa233997c8975b';

export class JWTService {
    static sign(payload: object) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    }

    static verify(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return null;
        }
    }
}
