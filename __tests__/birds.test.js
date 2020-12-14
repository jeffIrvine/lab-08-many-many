const request = require('supertest');
const fs = require('fs');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Bird = require('../lib/models/Birds');
const Nest = require('../lib/models/Nests');

describe('all routes for birds and nests', () => {

  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });


  it('creates a bird with post', async() => {
    const res = await request(app)
      .post('/birds')
      .send({
        type: 'Blue Jay'
      });

    expect(res.body).toEqual({
      id: '1',
      type: 'Blue Jay'
    });
  });

  it('finds a bird by id with get',  async() => {
    await Promise.all([
      { location: 'tree' },
      { location: 'log' },
      { location: 'bush' }
    ].map(nest => Nest.insert(nest)));

    const bird = await Bird.insert({
      type: 'Blue Jay',
      nests: ['tree', 'log']
    });

    const res = await request(app)
      .get(`/birds/${bird.id}`);
      
    expect(res.body).toEqual({
      ...bird,
      nests: ['tree', 'log']
    });
  });

  it('finds all birds with get', async() => {
    const birds = await Promise.all([
      {
        type: 'Blue Jay'
      },
      {
        type: 'Raven'
      },
      {
        type: 'Finch'
      }
    ].map(bird => Bird.insert(bird)));

    const res = await request(app)
      .get('/birds');

    expect(res.body).toEqual(expect.arrayContaining(birds));
    expect(res.body).toHaveLength(birds.length);
  });


  it('updates a bird with put', async() => {
    const bird = await Bird.insert({
      type: 'Blue Jay'
    });
      
    const res = await request(app)
      .put(`/birds/${bird.id}`)
      .send({
        type: 'Blue Jay'
      });

    expect(res.body).toEqual({
      id: bird.id,
      type: 'Blue Jay'
    });
  });


  it('deletes a bird with delete', async() => {
    const bird = await Bird.insert({
      type: 'Blue Jay'
    });

    const res = await request(app)
      .delete(`/birds/${bird.id}`);

    expect(res.body).toEqual(bird);
  });

});
