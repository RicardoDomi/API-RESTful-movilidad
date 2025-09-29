const jwt = require("jsonwebtoken");

function verifyToken(req, res, next){
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];
    if (!token){
        return res.status(401).json({ message: "No tienes autorizacion"});
    }
    try{
        const payload = jwt.verify(token);
        req.username = payload.username;
        next();
    }catch(errot){
        return res.status(403).json({message: "Token no valido"});
    }
}



