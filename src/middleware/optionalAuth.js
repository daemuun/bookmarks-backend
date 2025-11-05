import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export default async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            return next();
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select('-hashedPasswd'); 

        if (!user) {
            req.user = null;
            return next();
        }

        req.user = user; 
        next();

    } catch (error) {
        console.warn(`[OptionalAuth] Токен недействителен или просрочен: ${error.name}. Продолжение анонимно.`);
        req.user = null;
        next(); 
    }
};
