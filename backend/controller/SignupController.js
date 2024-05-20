const UserModel=require('../models/user.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
async function signupUser(req, res) {
    const { email, password, mobileNumber,active,role } = req.body;

    try {
        let user = await UserModel.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new UserModel({
            email,
            password,
            mobileNumber,
            active,
            role,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
