const User = require('../models/user');
const Booking = require('../models/booking');
const usersController = {
 userList :async (req,res) => {
     try{
           const users = await User.find();
          res.status(200).json(users);
     }catch(err){
          res.status(500).json({ message: 'Failed to fetch users' });
     };
 },
createUser: async (req, res) => {
  try {
    const { name, role } = req.body;
    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }
    const newUser = await User.create({ name, role });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user' });
  }
},
updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const validRoles = ['admin', 'owner', 'user'];
      if (!role || !validRoles.includes(role)) {
        return res.status(400).json({ message: 'Valid role is required' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true } 
      );
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update user role' });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

 // remove all bookings created by this user
      await Booking.deleteMany({ userId: id });
      await User.findByIdAndDelete(id);

      res.status(200).json({ message: 'User and their bookings deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete user' });
    }
  },

}

module.exports = usersController;