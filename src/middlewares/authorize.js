const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(500).json({error : 'Error de servidor: Autenticación requerida previo a autorización'});
        }

        const userRole = req.user.role || req.user.rol;

        if(!allowedRoles.includes(userRole)){
            return res.status(403).json({
                error : `Acceso denegado: Se requiere alguno de los siguientes roles: [${allowedRoles.join(', ')}]`
            });
        }

        next();
    };
};

module.exports = authorize;