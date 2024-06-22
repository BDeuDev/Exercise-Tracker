const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, addExercise } = require('../services/user_service')
const User = require('../models/user');

router.post('/users', async (req, res) => {
    const { username } = req.body;

    try {
        await createUser(username)
            .then((result) => {
                res.status(200).json({ username: result.username, _id: result._id, })
            })
            .catch(err => res.status(404).json({ error: err }))

    } catch (error) {
        res.status(400).json({ error: 'Failed to create new user' });
    }
});

router.get('/users', async (req, res) => {
    try {
        await getAllUsers()
            .then((result) => {
                res.status(200).json( result )
            })
            .catch(err => res.status(404).json({ error: err }))
    } catch (error) {
        res.status(400).json({ error: 'Failed to retrieve users' });
    }
});

router.post('/users/:_id/exercises', async (req, res) => {
    const { description, duration, date } = req.body;
    const userId = req.params._id;

    try {
        let exerciseDate = date ? new Date(date) : new Date();

        await addExercise(userId, description, duration, exerciseDate)
            .then((result) => {
                res.status(200).json({
                    username: result.username,
                    _id: result._id,
                    description,
                    duration: parseInt(duration),
                    date: exerciseDate.toDateString()
                });
            })
            .catch(err => res.status(404).json({error : err}));
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/users/:_id/logs', async (req, res) => {
    const { _id } = req.params;
    const { from, to, limit } = req.query;
  
    try {
      let query = { _id };
  
      if (from || to) {
        query.date = {};
        if (from) query.date.$gte = new Date(from);
        if (to) query.date.$lte = new Date(to);
      }
  
      let user = await User.findOne(query);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      let log = user.log;
  
      if (limit) {
        log = log.slice(0, parseInt(limit));
      }
  
      res.status(200).json({
        _id: user._id,
        username: user.username,
        count: log.length,
        log: log.map((exercise) => ({
          description: exercise.description,
          duration: exercise.duration,
          date: new Date(exercise.date).toDateString()
        }))
      });
    } catch (error) {
      res.status(400).json({ error: 'Failed to retrieve exercise log' });
    }
});

module.exports = router