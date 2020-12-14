const pool = require('../utils/pool');

module.exports = class Nest {
    id;
    location;

    constructor(row) {
      this.id = String(row.id);
      this.location = row.location;
    }

    static async insert({ location }) {
      const { rows } = await pool.query(
        'INSERT INTO nests (location) VALUES ($1) RETURNING *',
        [location]
      );
  
      return new Nest(rows[0]);
    }
  
    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM nests WHERE id=$1',
        [id]
      );
  
      if(!rows[0]) throw new Error(`No nest found with the id of ${id}`);
  
      return new Nest(rows[0]);
    }
  
  
    static async find() {
      const { rows } = await pool.query('SELECT * FROM nests');
  
      return rows.map(row => new Nest(row));
    }
      
    static async update(id, { location }) {
      const { rows } = await pool.query(
        `UPDATE nests
            SET location=$1
              WHERE id=$2
              RETURNING *`,
        [location, id]
      );
    
      if(!rows[0]) throw new Error(`No nest found with the id of ${id}`);
          
      return new Nest(rows[0]);
    }
  
  
    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM nests WHERE id=$1 RETURNING *',
        [id]
      );
    
      if(!rows[0]) throw new Error(`No nest found with the id of ${id}`);
          
      return new Nest(rows[0]);
    }
};
