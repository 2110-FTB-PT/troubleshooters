const requireUser = (req, res, next) => {
    if (!req.user){
        next({
            name: "MissingUserError",
            message: "You must be logged in to perform this action"
        });
    }
    next();
}

const requireAdminUser = (req, res, next) => {
    if(!req.user || !req.user.isAdmin ){
        next({
            name: 'AuthorizatonError',
            message: 'You must be an Admin'
        })
    }
    next();
}

module.exports = { 
    requireUser,
    requireAdminUser 
};