import { Anime } from "../models/anime.js"

function index (req, res) {
  res.render('index', { title: 'Home Page' })
}

function displayCatalog(req, res){
  Anime.find({})
  .then(animes => {
    res.render("animes/catalog", {
      animes,
      title: "Catalog Page"
    });
  });
}

function newAnime(req, res){
  res.render('animes/new', {
    title: 'Add New Anime'
  })
}

export {
  index,
  displayCatalog,
  newAnime as new,
}