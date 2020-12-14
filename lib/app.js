const express = require('express');
const Bird = require('./models/Birds');
const Nest = require('./models/Nests');
const app = express();

app.use(express.json());

//create 
app.post('/birds', (req, res, next) => {
  Bird
    .insert(req.body)
    .then(bird => res.send(bird))
    .catch(next);
});
app.post('/nests', (req, res, next) => {
  Nest
    .insert(req.body)
    .then(nests => res.send(nests))
    .catch(next);
});

//find by id
app.get('/birds/:id', (req, res, next) => {
  Bird
    .findById(req.params.id)
    .then(bird => res.send(bird))
    .catch(next);
});

app.get('/nests/:id', (req, res, next) => {
  Nest
    .findById(req.params.id)
    .then(nest => res.send(nest))
    .catch(next);
});

//get all
app.get('/birds', (req, res, next) => {
  Bird
    .find()
    .then(birds => res.send(birds))
    .catch(next);
});

app.get('/nests', (req, res, next) => {
  Nest
    .find()
    .then(nests => res.send(nests))
    .catch(next);
});

// update with id
app.put('/birds/:id', (req, res, next) => {
  Bird
    .update(req.params.id, req.body)
    .then(bird => res.send(bird))
    .catch(next);
});

app.put('/nests/:id', (req, res, next) => {
  Nest
    .update(req.params.id, req.body)
    .then(nest => res.send(nest))
    .catch(next);
});

//delete
app.delete('/birds/:id', (req, res, next) => {
  Bird
    .delete(req.params.id)
    .then(bird => res.send(bird))
    .catch(next);
});

app.delete('/nests/:id', (req, res, next) => {
  Nest
    .delete(req.params.id)
    .then(nest => res.send(nest))
    .catch(next);
});

module.exports = app;
