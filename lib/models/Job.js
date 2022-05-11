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
};
