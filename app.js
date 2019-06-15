require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDEX = require('./moviedex.json');

const app = express();

function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request'})
  }

  next();
}

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);


app.get('/movie', (req, res) => {
  const { genre = '', country = '', avg_vote} = req.query;

  let filteredMovies = MOVIEDEX.filter(movie => {
    return movie.genre.toLowerCase().includes(genre.toLowerCase());
  });

  filteredMovies = filteredMovies.filter(movie =>{
    return movie.country.toLowerCase().includes(country.toLowerCase());
  });

  if (avg_vote) {
    const avg_voteNum = parseFloat(avg_vote);

    if(isNaN(avg_voteNum)){
      res.status(400).send('avg_vote must be a number');
    }
    filteredMovies = filteredMovies.filter(movie => {
      return (movie.avg_vote >= avg_voteNum);
    });
  }
  res.send(filteredMovies);
});

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }};
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

module.exports = app;
