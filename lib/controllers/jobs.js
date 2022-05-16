const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
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

// Get Interviewed Jobs
  .get('/interviewed', authenticate, async (req, res, next) => {
    try {
      const { id } = req.user;
      const jobs = await Job.getInterviewedJobs(id);      
      res.send(jobs);
    } catch(error) { 
      next(error);
    }
  })

  // Get Applied Jobs
  .get('/applied', authenticate, async (req, res, next) => {
    try {
      const { id } = req.user;
      const jobs = await Job.getAppliedJobs(id);      
      res.send(jobs);
    } catch(error) { 
      next(error);
    }
  })
  

  // Get Jobs by ID
  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const jobs = await Job.getJobById(id);
      res.send(jobs);
    } catch(error) { 
      next(error);
    }
  })

  // Delete Job by ID
  .delete('/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const job = await Job.deleteJobById(id);
      res.send(job);
    } catch(error) {
      next(error);
    }
  })

  // Update Job
  .patch('/:id', authenticate, async (req, res, next) => {
    const { id } = req.params;
    const {
      fav, remote, zipcode, applied, phone_screen, interviewed, take_home, offer, rejected, accepted, url, description, notes, contact
    } = req.body;

    try {
      const job = await Job.updateJob(id, { fav, remote, zipcode, applied, phone_screen, interviewed, take_home, offer, rejected, accepted, url, description, notes, contact });
      res.send(job);
    } catch  (error) {
      next(error);
    }
  })
  
;
