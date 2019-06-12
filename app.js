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

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

// app will use validateBearerToken
app.use(validateBearerToken)
// app will use validateBearerToken


app.get('/movie', (req, res) => {
  const { genre , country , avg_vote} = req.query;

  // let filteredMovies = MOVIEDEX.filter(movie => {
  //   return movie.genre.toLowerCase().includes(genre.toLowerCase());
  // });
  //
  // filteredMovies = filteredMovies.filter(movie =>{
  //   return movie.country.toLowerCase().includes(country.toLowerCase());
  // });
  let filteredMovies = []
  if (genre) {
    filteredMovies = MOVIEDEX.filter(movie => {
      return movie.genre.toLowerCase().includes(req.query.genre.toLowerCase());
    })
  }

  if (country) {
    filteredMovies = MOVIEDEX.filter(movie => {
      return movie.country.toLowerCase().includes(req.query.country.toLowerCase());
    })
  }

  if (avg_vote) {


    filteredMovies = filteredMovies.filter(movie => {
      return Number(movie.avg_vote) >= Number(avg_vote);
    });

    if(isNaN(avg_vote)){
      // just in case
      res.status(400).send('avg_vote must be a number')
    }
  }
  res.send(filteredMovies);
});
app.listen(8000, () => {
  console.log('Server running at port 8000');
})
