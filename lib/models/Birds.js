const pool = require('../utils/pool');

module.exports = class Bird {
    id;
    type;

    constructor(row) {
      this.id = String(row.id);
      this.type = row.type;
    }

    static async insert({ type, nests = [] }) {
      const { rows } = await pool.query(
        'INSERT INTO birds (type) VALUES ($1) RETURNING *',
        [type]
      );

      await pool.query(`
      INSERT INTO birds_nests (bird_id, nest_id)
      SELECT ${rows[0].id}, id FROM nests WHERE location = ANY($1::text[])`,
      [nests]);
      
      return new Bird(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT 
          birds.*,
          array_agg(nests.location) AS nests 
        FROM 
            birds_nests
        JOIN birds
        ON birds_nests.bird_id = birds.id
        JOIN nests
        ON birds_nest.nests.id = nests.bird_id
        WHERE birds.id=$1
        GROUP BY birds.id`,
        [id]
      );

      if(!rows[0]) throw new Error(`No bird found with the id of ${id}`);

      return { 
        ...new Bird(rows[0]),
        nests: rows[0].nests
      };
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM birds');

      return rows.map(row => new Bird(row));
    }
    
    static async update(id, { type }) {
      const { rows } = await pool.query(
        `UPDATE birds
          SET type=$1
            WHERE id=$2
            RETURNING *`,
        [type, id]
      );
  
      if(!rows[0]) throw new Error(`No bird found with the id of ${id}`);
        
      return new Bird(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM birds WHERE id=$1 RETURNING *',
        [id]
      );
  
      if(!rows[0]) throw new Error(`No bird found with the id of ${id}`);
        
      return new Bird(rows[0]);
    }
};
