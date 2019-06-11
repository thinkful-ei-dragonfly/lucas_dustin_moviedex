require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDEX = require('./moviedex.json');

const app = express();

const API_TOKEN = process.env.API_TOKEN;

function validateBearerToken(req, res, next) {
  if (app.get('Authorization').split(' ')[1] === API_TOKEN) {
    return res.status(401).send('Unauthorized');
  }
  next();
}

app.use(morgan('dev'));
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
      res.status(400).send('avg_vote must be a number')
    }
    filteredMovies = filteredMovies.filter(movie => {
      return (movie.avg_vote >= avg_voteNum);     
    });
  }
  res.send(filteredMovies);
});
app.listen(8000, () => {
  console.log('Server running at port 8000');
})
