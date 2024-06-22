const User = require('../models/user')

const createUser = async(username) => {
    try {
        const newUser = await User.create({ username });
        if(!newUser) {
            throw new Error('Error Creating User')
        }
        return newUser;
      } catch (error) {
            return error;
      }
}
const getAllUsers = async() => {
    try {
        const users = await User.find({},'username _id');
        if(!users){
            throw new Error('Not users found');
        }
        return users
    } catch (error) {
        return error
    }
}
const addExercise = async(userId,description, duration,exerciseDate) => {
    try {
        const user = await User.findByIdAndUpdate(userId, {
            $push: { log: { description, duration, date: exerciseDate } }
          }, { new: true });
        if(!user){
            throw new Error('User not found');
        }
        return user
    } catch (error) {
        return error
    }
}
module.exports = {createUser,getAllUsers,addExercise}