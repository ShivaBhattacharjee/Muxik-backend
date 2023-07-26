import jwt from 'jsonwebtoken';

/** auth middleware */
export default async function Auth(req, res, next){
    try {
        
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken =  jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        next()

    } catch (error) {
        res.status(401).json({ message  : "Authentication Failed!"})
    }
}

export function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        expiresAt: null,
        resetSession : false
    }
    next()
}