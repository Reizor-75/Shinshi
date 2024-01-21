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

export {
  index,
  displayCatalog
}