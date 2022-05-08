const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Job = require('../models/Job');


module.exports = Router()

  // Post new Job
  .post('/', authenticate, async (req, res, next) => {
    try {
      const job = await Job.insert({ ...req.body, userId: req.body.user_id });
      res.send(job);
    } catch(error) {
      next(error);
    }
  })

  // Get Jobs by User
  .get('/', authenticate, async (req, res, next) => {
    try {
      const { id } = req.user;
      const jobs = await Job.getJobsByUserId(id);
      res.send(jobs);
    } catch(error) { 
      next(error);
    }
  })
  
  .delete('/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const job = await Job.deleteJobById(id);
      res.send(job);
    } catch(error) {
      next(error);
    }
  })
  
;
