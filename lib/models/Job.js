const pool = require('../utils/pool');

module.exports = class Job {
  id;
  user_id;
  title;
  company;
  fav;
  remote;
  zipcode;
  wishlist;
  applied;
  phone_screen;
  interviewed;
  take_home;
  technical_interview;
  offer;
  rejected;
  accepted;
  url;
  description;
  notes;
  contact_name;
  contact_email;
  created_at;
  last_updated;
  salary;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.title = row.title;
    this.company = row.company;
    this.fav = row.fav;
    this.remote = row.remote;
    this.zipcode = row.zipcode;
    this.wishlist = row.wishlist;
    this.applied = row.applied;
    this.phone_screen = row.phone_screen;
    this.interviewed = row.interviewed;
    this.take_home = row.take_home;
    this.technical_interview = row.technical_interview;
    this.offer = row.offer;
    this.rejected = row.rejected;
    this.accepted = row.accepted;
    this.url = row.url;
    this.description = row.description;
    this.notes = row.notes;
    this.contact_name = row.contact_name;
    this.contact_email = row.contact_email;
    this.created_at = row.created_at;
    this.last_updated = row.last_updated;
    this.salary = row.salary;
  }

  // Insert new Job
  static async insert({
    user_id,
    title,
    company,
    fav,
    remote,
    zipcode,
    wishlist,
    applied,
    phone_screen,
    interviewed,
    take_home,
    technical_interview,
    offer,
    rejected,
    accepted,
    url,
    description,
    notes,
    contact_name,
    contact_email,
    salary,
  }) {
    const { rows } = await pool.query(
      `
      INSERT INTO jobs (  
        user_id,
        title,
        company,
        fav,
        remote,
        zipcode,
        wishlist,
        applied,
        phone_screen,
        interviewed,
        take_home,
        technical_interview,
        offer,
        rejected,
        accepted,
        url,
        description,
        notes,
        contact_name,
        contact_email,
        salary
      )
      VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
      `,
      [
        user_id,
        title,
        company,
        fav,
        remote,
        zipcode,
        wishlist,
        applied,
        phone_screen,
        interviewed,
        take_home,
        technical_interview,
        offer,
        rejected,
        accepted,
        url,
        description,
        notes,
        contact_name,
        contact_email,
        salary,
      ]
    );
    return new Job(rows[0]);
  }

  // Get All Jobs for a given User
  static async getJobsByUserId(user_id) {
    const { rows } = await pool.query(
      `
    SELECT * 
    FROM jobs
    WHERE user_id = $1
    `,
      [user_id]
    );
    return rows.map((row) => new Job(row));
  }

  // Delete Job by Id
  static async deleteJobById(id) {
    const { rows } = await pool.query(
      `
      DELETE
      FROM jobs 
      WHERE id = $1
      RETURNING *
    `,
      [id]
    );
    if (!rows[0]) return null;
    return new Job(rows[0]);
  }

  // Delete All Jobs (dev !Caution!)
  static async deleteAllJobs() {
    const { rows } = await pool.query(`
      DELETE
      FROM jobs 
    `);
    if (!rows[0]) return null;
    return new Job(rows[0]);
  }

  // Get Job by ID
  static async getJobById(id) {
    const { rows } = await pool.query(
      `
    SELECT * 
    FROM jobs
    WHERE id = $1
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Update Job by ID
  static async updateJob(id, attributes) {
    const currentJob = await Job.getJobById(id);
    const title = attributes.title ?? currentJob.title;
    const company = attributes.company ?? currentJob.company;
    const fav = attributes.fav ?? currentJob.fav;
    const remote = attributes.remote ?? currentJob.remote;
    const zipcode = attributes.zipcode ?? currentJob.zipcode;
    const wishlist = attributes.wishlist ?? currentJob.wishlist;
    const applied = attributes.applied ?? currentJob.applied;
    const phone_screen = attributes.phone_screen ?? currentJob.phone_screen;
    const interviewed = attributes.interviewed ?? currentJob.interviewed;
    const take_home = attributes.take_home ?? currentJob.take_home;
    const technical_interview =
      attributes.technical_interview ?? currentJob.technical_interview;
    const offer = attributes.offer ?? currentJob.offer;
    const rejected = attributes.rejected ?? currentJob.rejected;
    const accepted = attributes.accepted ?? currentJob.accepted;
    const url = attributes.url ?? currentJob.url;
    const description = attributes.description ?? currentJob.description;
    const notes = attributes.notes ?? currentJob.notes;
    const contact_name = attributes.contact_name ?? currentJob.contact_name;
    const contact_email = attributes.contact_email ?? currentJob.contact_email;
    const last_updated = new Date();
    const salary = attributes.salary ?? currentJob.salary;

    const { rows } = await pool.query(
      `
      UPDATE jobs SET  
        title = $1,
        company = $2,
        fav = $3,
        remote = $4,
        zipcode = $5,
        wishlist = $6,
        applied = $7,
        phone_screen = $8,
        interviewed = $9,
        take_home = $10,
        technical_interview = $11,
        offer = $12,
        rejected = $13,
        accepted = $14,
        url = $15,
        description = $16,
        notes = $17,
        contact_name = $18,
        contact_email = $19,
        last_updated = $20,
        salary = $21
        WHERE id = $22
        RETURNING *
      `,
      [
        title,
        company,
        fav,
        remote,
        zipcode,
        wishlist,
        applied,
        phone_screen,
        interviewed,
        take_home,
        technical_interview,
        offer,
        rejected,
        accepted,
        url,
        description,
        notes,
        contact_name,
        contact_email,
        last_updated,
        salary,
        id,
      ]
    );

    if (!rows[0]) {
      const error = new Error(`Job id #${id} not found`);
      error.status = 404;
      throw error;
    }
    return new Job(rows[0]);
  }

  // Get where Fav = True
  static async getFavJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND fav
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Wishlist = True
  static async getWishlistJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND wishlist
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Remote = True
  static async getRemoteJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND remote = 'true'
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Remote = False
  static async getNonRemoteJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND remote = 'false'
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Remote = Hybrid
  static async getHybridJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND remote = 'hybrid'
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Applied = True
  static async getAppliedJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND applied
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where phone_screen = True
  static async getPhoneScreenedJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND phone_screen
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Interviewed = True
  static async getInterviewedJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND interviewed
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Take Home = True
  static async getTakeHomeJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND take_home
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Tech Interview = True
  static async getTechInterviewJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND technical_interview
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Offer = True
  static async getOfferJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND offer
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Rejected = True
  static async getRejectedJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND rejected
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }

  // Get where Accepted = True
  static async getAcceptedJobs(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM jobs
    WHERE user_id = $1 AND accepted
    `,
      [id]
    );
    return rows.map((row) => new Job(row));
  }
};
