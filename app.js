import axios from 'axios'; 
import express from 'express';

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');
const port = 3000;

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/search', async (req, res) => {
  const ingredient = req.query.ingredient?.trim();

  if (!ingredient) {
    return res.status(400).render('result', {
      ingredient: '',
      drinks: [],
      error: 'Enter an ingredient to search for cocktails.',
    });
  }

  try {
    const response = await axios.get(
      'https://www.thecocktaildb.com/api/json/v1/1/filter.php',
      { params: { i: ingredient } },
    );

    res.render('result', {
      ingredient,
      drinks: response.data.drinks ?? [],
      error: null,
    });
  } catch (error) {
    console.error('CocktailDB search failed:', error.message);
    res.status(502).render('result', {
      ingredient,
      drinks: [],
      error: 'Cocktail search is temporarily unavailable. Please try again.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});