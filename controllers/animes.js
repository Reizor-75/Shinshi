import { Anime } from "../models/anime.js"

function index (req, res) {
  res.render('index', { title: 'Home Page' })
}

function displayCatalog(req, res){
  res.render("animes/catalog", {
    title: "Catalog Page"
  });
}

export {
  index,
  displayCatalog
}