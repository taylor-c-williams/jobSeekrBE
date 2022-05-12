const pool = require('../utils/pool');

module.exports = class Job { 
  id;
  user_id;
  fav;
  remote;
  zipcode;
  applied;
  phone_screen;
  take_home;
  offer;
  rejected;
  accepted;
  url;
  description;
  notes;
  contact;
  created_at;
  last_updated;

  constructor(row){
    this.id = row.id;
    this.user_id = row.user_id;
    this.fav = row.fav;
    this.remote = row.remote;
    this.zipcode = row.zipcode;
    this.applied = row.applied;
    this.phone_screen = row.phone_screen;
    this.take_home = row.take_home;
    this.offer = row.offer;
    this.rejected = row.rejected;
    this.accepted = row.accepted;
    this.url = row.url;
    this.description = row.description;
    this.notes = row.notes;
    this.contact = row.contact;
    this.created_at = row.created_at;
    this.last_updated = row.last_updated;
  }

  // Insert new Job
  static async insert ({  
    user_id,
    fav,
    remote,
    zipcode,
    applied,
    phone_screen,
    take_home,
    offer,
    rejected,
    accepted,
    url,
    description,
    notes,
    contact
  }){
    const { rows } = await pool.query(
      `
      INSERT INTO jobs (  
        user_id,
        fav,
        remote,
        zipcode,
        applied,
        phone_screen,
        take_home,
        offer,
        rejected,
        accepted,
        url,
        description,
        notes,
        contact
      )
      VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
      `, [user_id, fav, remote, zipcode, applied, phone_screen, take_home, offer, rejected, accepted, url, description, notes, contact]      
    );
    return new Job(rows[0]);
  }

  // Get All Jobs for a given User
  static async getJobsByUserId(user_id){
    const { rows } = await pool.query(`
    SELECT * 
    FROM jobs
    WHERE user_id = $1
    `, [user_id]);
    return rows.map((row) => new Job(row));
  }

  // Delete Job by Id
  static async deleteJobById(id){
    const { rows } = await pool.query(`
      DELETE
      FROM jobs 
      WHERE id = $1
      RETURNING *
    `, [id]);
    if (!rows[0]) return null;
    return new Job(rows[0]);
  }

  // Delete All Jobs (dev !Caution!)
  static async deleteAllJobs(){
    const { rows } = await pool.query(`
      DELETE
      FROM jobs 
    `);
    if (!rows[0]) return null;
    return new Job(rows[0]);
  }

  // Get Job by ID
  static async getJobById(id){
    const { rows } = await pool.query(`
    SELECT * 
    FROM jobs
    WHERE id = $1
    `, [id]);
    return rows.map((row) => new Job(row));
  }

  // Update Job by ID
  static async updateJob(id, attributes){
    const currentJob = await Job.getJobById(id);
    const fav = attributes.fav ?? currentJob.fav;
    const remote = attributes.remote ?? currentJob.remote;
    const zipcode = attributes.zipcode ?? currentJob.zipcode;
    const applied = attributes.applied ?? currentJob.applied;
    const phone_screen = attributes.phone_screen ?? currentJob.phone_screen;
    const take_home = attributes.take_home ?? currentJob.take_home;
    const offer = attributes.offer ?? currentJob.offer;
    const rejected = attributes.rejected ?? currentJob.rejected;
    const accepted = attributes.accepted ?? currentJob.accepted;
    const url = attributes.url ?? currentJob.url;
    const description = attributes.description ?? currentJob.description;
    const notes = attributes.notes ?? currentJob.notes;
    const contact = attributes.contact ?? currentJob.contact;
    const last_updated = new Date();
    console.log('================================================');
    console.log(last_updated);
    console.log('currently');
    console.log(currentJob.last_updated);

    const { rows } = await pool.query(`
      UPDATE jobs SET  
        fav = $1,
        remote = $2,
        zipcode = $3,
        applied = $4,
        phone_screen = $5,
        take_home = $6,
        offer = $7,
        rejected = $8,
        accepted = $9,
        url = $10,
        description = $11,
        notes = $12,
        contact = $13,
        last_updated = $14
        WHERE id = $15 
        RETURNING *
      `, [fav, remote, zipcode, applied, phone_screen, take_home, offer, rejected, accepted, url, description, notes, contact, last_updated, id]   
    );

    if (!rows[0]) {
      const error = new Error (`Job id #${id} not found`);
      error.status = 404;
      throw error;
    }
    return new Job(rows[0]);
  }

};
