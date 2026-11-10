const cleanData = (data) => {
    if(data instanceof Array){
        for(let i = 0; i < data.length; i++){
            cleanData(data[i]);
        }
    }
    else if(data !== null && typeof data  === 'object'){
        for(const key of Object.keys(data)){
            if(key.startsWith('$') || key.includes('.')){
                console.warn(`[Seguridad] Operador NoSQL neutralizado ${key}`);

                const cleanKey = key.replace(/^\$/, '_').replace(/\./g, '_');
                data[cleanKey] = data[key];
                delete data[key];

                cleanData(data[cleanKey]);
            }
            else {
                cleanData(data[key]);
            }
        }
    }
};

const noSqlSanitizer = (req, res, next) => {
    if(req.body) cleanData(req.body);
    if(req.params) cleanData(req.params);
    if(req.query) cleanData(req.query);

    next();
};

module.exports = noSqlSanitizer;