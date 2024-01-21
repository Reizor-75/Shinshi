import { Anime } from "../models/anime.js"

function index (req, res) {
  res.render('index', { title: 'Home Page' })
}

export {
  index,
}