const request = require('supertest');
const fs = require('fs');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Bird = require('../lib/models/Birds');
const Nest = require('../lib/models/Nests');

describe('all routes for birds and nests', () => {

  let bird;
  let nests;
  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    bird = await Bird.insert({
      type: 'Blue Jay'
    });
    nests = await Nest.insert({
      location: 'd101',
      birdId: bird.id
    });
  });

  afterAll(() => {
    return pool.end();
  });

  //nest post
  it('creates a nest with post', async() => {
    const res = await request(app)
      .post('/nests')
      .send({
        location: 'd101',
        birdId: bird.id
      });

    expect(res.body).toEqual({
      id: '2',
      location: 'd101',
      birdId: bird.id
    });
  });


  //nest findById
  it('finds a nest referenced by id with get',  async() => {
    const res = await request(app)
      .get(`/nests/${nests.id}`);
      
    expect(res.body).toEqual(nests);
  });

  //nests get all
  it('finds all nests with get', async() => {
    const nests = await Promise.all([
      
      {
        location: 'd101',
        birdId: nest.birdId
      },
      {
        location: 'f101',
        birdId: nest.birdId
      },
      {
        location: 'a101',
        birdId: nest.birdId
      }
    ].map(nest => nest.insert(nest)));

    const res = await request(app)
      .get('/nests');

    expect(res.body).toEqual(expect.arrayContaining(nests));
    expect(res.body).toHaveLength(nests.length + 1);
  });

  //nest update
  it('updates a nest with put', async() => {
    const res = await request(app)
      .put(`/nests/${nests.id}`)
      .send({
        location: 'd101',
        birdId: bird.id
      });

    expect(res.body).toEqual({
      id: nests.id,
      location: 'd101',
      birdId: bird.id
    });
  });

  //nest deletes
  it('deletes a nest with delete', async() => {
    const nest = await nest.insert({
      location: 'd101',
      birdId: bird.id
    });

    const res = await request(app)
      .delete(`/nests/${nest.id}`);

    expect(res.body).toEqual(nest);
  });
});
