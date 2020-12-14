const request = require('supertest');
const fs = require('fs');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Nest = require('../lib/models/Nests');

describe('all routes for birds and nests', () => {
  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  //nest post
  it('creates a nest with post', async() => {
    const res = await request(app)
      .post('/nests')
      .send({
        location: 'tree'
      });

    expect(res.body).toEqual({
      id: '1',
      location: 'tree'
    });
  });


  //nest findById
  it('finds a nest referenced by id with get',  async() => {
    const nest = await Nest.insert({
      location: 'tree'
    });

    const res = await request(app)
      .get(`/nests/${nest.id}`);
      
    expect(res.body).toEqual({
      id: nest.id,
      location: 'tree'
    });
  });

  //nests get all
  it('finds all nests with get', async() => {
    const nests = await Promise.all([
      
      {
        location: 'tree'
      },
      {
        location: 'log'
      },
      {
        location: 'branch'
      }
    ].map(nest => Nest.insert(nest)));

    const res = await request(app)
      .get('/nests');

    expect(res.body).toEqual(expect.arrayContaining(nests));
    expect(res.body).toHaveLength(nests.length);
  });

  //nest update
  it('updates a nest with put', async() => {
    const nest = await Nest.insert({
      location: 'tree'
    });

    const res = await request(app)
      .put(`/nests/${nest.id}`)
      .send({
        location: 'log',
      });

    expect(res.body).toEqual({
      id: nest.id,
      location: 'log',
    });
  });

  //nest deletes
  it('deletes a nest with delete', async() => {
    const nest = await Nest.insert({
      location: 'tree'
    });

    const res = await request(app)
      .delete(`/nests/${nest.id}`);

    expect(res.body).toEqual(nest);
  });
});
