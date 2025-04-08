const UserDB = require("../model/Users")
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { firstname, pword } = req.body;  //destructured firstname and password from the body.

    if(!firstname || !pword) return res.status(400).json({ "message": "Username and password not provided"}); //confirming the presence of both firstname and passwords
    const duplicateUser = await UserDB.findOne({username: firstname}) //ensuring it's not a duplicate from the userDB.
    if (duplicateUser) return res.sendStatus(409);

    try {
        const hashedPassword = await bcrypt.hash(pword, 10);
        const resultUserCreate = await UserDB.create({
            "username": firstname,
            "password": hashedPassword,
            "realPassword": pword,
        })
        res.status(201).json({ "message": `Account for ${firstname} successfully created` });
    }catch (error) {
        return res.status(500).json({ "message": error.message})
    }
}

module.exports = { handleNewUser };