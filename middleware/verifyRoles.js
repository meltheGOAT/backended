function verifyAllRoles(...allowedRoles){
    return(req, res, next) => {
        if (!req.roles) return res.status(401).json({"message": "unauthorized to access the resource"});
        const rolesArray = [...allowedRoles];

        const result = req.roles.map(role => rolesArray.includes(role).find(val => val === true));

        if (!result) return res.status(401).json({"message": "role undefined"});

        next();
    }
}

module.exports = verifyAllRoles; 