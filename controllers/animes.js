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
  console.log(req.body.ongiong)
  Anime.create(req.body)
  .then(() => {
    res.redirect(`/catalog`)
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  });
}

function show(req, res){
  Anime.findById(req.params.animeId)
  .then(anime =>{
    res.render('animes/show', {
      anime,
      title: 'Show Detail', 
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  });
}

function createReview(req, res){  
  Anime.findById(req.params.animeId)
  .then(anime =>{
    if(!req.body.reviewTitle) req.body.reviewTitle = "";
    if(!req.body.content) req.body.content = "No Comment";
    req.body.user = req.user.profile._id;
    anime.reviews.push(req.body);
    anime.save()
    .then(() =>{
      res.redirect(`/catalog/${anime._id}`)
    })
    .catch(err => {
      console.log(err)
      res.redirect()
    });
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  });
}

function deleteReview(req, res){
  Anime.findById(req.params.animeId)
  .then(anime =>{
    const review = anime.reviews.id(req.params.reviewId);
    if(review.user.equals(req.user.profile._id)){
      anime.reviews.remove(review);
      anime.save()
      .then(()=>{        
        res.redirect(`/catalog/${anime._id}`)
      })
    }
    else{
      throw new Error ('🚫 Not authorized 🚫')
    }
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
  show,
  createReview,
  deleteReview as delete
}