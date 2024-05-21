const User = require('../models/user.model'); 

const approveUser = async (req, res) => {
  try {
    const idd = await User.findOne({"mobilenumber": req.params.id})
    const user = await User.findById(idd._id).select('-password')
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.active = true; 
    await user.save();

    res.json({ msg: 'User approved successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password')
        res.status(200).json(users)

    }catch(err){
        res.status(500).send({message:"Error getting users"})
    }
}

const getUserById = async (req, res) => {
    try{
        const idd = await User.findOne({"mobilenumber": req.params.id})
        const user = await User.findById(idd._id).select('-password')
        res.status(200).json(user)
    }catch(err){
        res.status(500).send({message:"Error getting user"})
    }
}

const removeUser = async (req, res) => {
    try{
        const idd = await User.findOne({"mobilenumber": req.params.id})
        const user = await User.findByIdAndDelete(idd._id).select('-password')
        res.status(200).json(user)
    }catch(err){
        res.status(500).send({message:"Error deleting user"})
    }
}

const updateUser = async (req, res) => {
    try{
        const idd = await User.findOne({"mobilenumber": req.params.id})
        const user = await User.findByIdAndUpdate(idd._id, req.body, { new: true })
        res.status(200).json(user)
    }catch(err){
        res.status(500).send({message:"Error updating user"})
    }
}


module.exports = {
  approveUser, getUsers, getUserById, removeUser, updateUser
};