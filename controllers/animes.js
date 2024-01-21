import { Anime } from "../models/anime.js"

function index (req, res) {
  res.render('index', { title: 'Home Page' })
}

function displayCatalog(req, res){
  res.send("Anime Catalog")
}

export {
  index,
  displayCatalog
}