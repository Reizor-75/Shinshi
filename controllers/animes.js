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
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  });
}

function newAnime(req, res){
  res.render('animes/new', {
    title: 'Add New Anime'
  })
}

function create(req, res){
  req.body.ongiong = !!req.body.ongiong;  
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  Anime.create(req.body)
  .then(show => {
    res.redirect(`/catalog`)
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  });
}

export {
  index,
  displayCatalog,
  newAnime as new,
  create,
}