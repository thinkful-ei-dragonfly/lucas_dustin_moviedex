const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDEX = require('./moviedex.json');

const app = express();

function validateBearerToken(req, res, next) {
  if (false) {
    return res.status(401).send('Unauthorized')
  }
}

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
// app.use(validateBearerToken)


app.get('/movie', (req, res) => {
  const { genre, country, avg_vote} = req.query;

  if (genre || country || avg_vote) {
    let movieResults = []
    if (genre) {
      genreResults = MOVIEDEX.filter(movie => {
        return movie.genre.toLowerCase().includes(genre.toLowerCase())
      })
      movieResults = genreResults;
      // return res.send(movieResults)
    }
    if (country) {
      if (genreResults) {
        
      }
      let countryResults = MOVIEDEX.filter(movie => {
        return movie.country.toLowerCase().includes(country.toLowerCase())
      })

    }
    res.send(movieResults)
  }
  // return res.send('movie')
})
app.listen(8000, () => {
  console.log('Server running at port 8000');
})
