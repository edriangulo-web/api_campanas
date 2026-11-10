const jwt = require('jsonwebtoken');
const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token =  authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            error: 'Acceso no autorizado: Token no proporcionado'
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_temporal_dev');
        req.user = decoded;

        next();

    }catch(error){
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({error: 'Sesión expirada: El token ha vencido'});
        }

        return res.status(403).json({error : 'Acceso prohibido: Token inválido'});
    }
};

module.exports = authenticationToken;