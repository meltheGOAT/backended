const  User = require("../model/Users")

//the logout functionn(async)
async function handleLogout(req,res) {
  //confirming if there's a cookie present
    const cookies = req.cookies; 
    if (!cookies?.jwt) return res.sendStatus(204).json({"message": "No cookie found"});
    const refreshToken = cookies.jwt;
    //finding out who the cookie i.e the refresh token, belongs too
    const foundUser = await User.findOne({refreshToken}).exec();

    if(!foundUser) {
        res.clearCookie("jwt", refreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60* 1000 })
        return res.sendStatus(204);
    }

    foundUser.refreshToken = "";
    const result = await foundUser.save();
    res.clearCookie("jwt", refreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
    return res.sendStatus(204);
}

module.exports =  handleLogout;