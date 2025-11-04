import { User } from "../models/user.js";
import auth from 'basic-auth'

export default async (req, res, next) => {
    try {
        const credentials = auth(req);

        if (!credentials) {
            return requireAuth(res);
        }

        const user = await User.findOne({ login: credentials.name });
        if (!user) {
            return requireAuth(res);
        }

        const isValid = await user.verifyPasswd(credentials.pass);
        if (!isValid) {
            return requireAuth(res);
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
}

function requireAuth(res) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Bookmark Manager", charset="UTF-8"');
    return res.status(401).json({ error: 'Authentication required' });
}
