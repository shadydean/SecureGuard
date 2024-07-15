const UserModel = require('../models/user.model'); // Adjust the path as needed

const approved = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id); // Adjust the field name to match your user model
        if (user.active) {
            req.active = true;
            return next();
        } else {
            return res.status(401).json("You are unauthorized.");
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json("Server error.");
    }
}

module.exports = approved;


module.exports = approved