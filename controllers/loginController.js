const userDB =  require("../model/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleUserLogin = async ( req, res) => {
    const { firstName, pword } = req.body;

    if(!firstName || !pword) return res.status(400).json({ "message": "Username and password not provided"});

    //finding the user's detail
    const foundUser = await userDB.findOne({username: firstName}).exec()

    if (!foundUser) return res.sendStatus(401);

    //decrypting the password
    const usermatch = await bcrypt.compare(pword, foundUser.password) 
    if (usermatch) {
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                "UserInfo":{
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET, //enabling access to the env file
            {expiresIn: "5m"}
        )

        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "1d"}
        )

        foundUser.refreshToken = refreshToken;
        const resultLogin = await foundUser.save();

        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})

        return res.status(201).json({"message": "login successful", "authToken": `Access token is ${accessToken}`})
    } else {
        res.sendStatus(401)
    }
}

module.exports = {handleUserLogin}