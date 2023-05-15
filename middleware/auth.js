import jwt from 'jsonwebtoken';
// import ENV from '../config.js'

/** auth middleware */
export default async function Auth(req, res, next){
    try {
        const {type} = req.body;
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];

        // retrive the user details for the logged in user
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        next()

    } catch (error) {
        res.status(401).json({ success: false, message : "You are not authorized!"})
    }
}


export function localVariables(req, res, next){
    app.locals = {
        otp : null,
        resetSession : false
    }
    next()
}