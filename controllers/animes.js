import { Anime } from "../models/anime.js"
import { Profile } from "../models/profile.js";

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
  Profile.findById(req.user.profile._id)
  .then(profile =>{    
    if(profile.role > 500){
      res.render('animes/new', {
        title: 'Add New Anime'
      });
    } else{
      throw new Error ('🚫 Not authorized 🚫');
    }
  })
  .catch(err => {
    console.log(err);
    res.redirect('/');
  })
}

function deleteAnime(req, res){
  Anime.findByIdAndDelete(req.params.animeId)
  .then(() =>{
    res.redirect(`/catalog`)       
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  });
}

function create(req, res){  
  Profile.findById(req.user.profile._id)
  .then(profile =>{    
    if(profile.role> 500){
      req.body.ongoing = !!req.body.ongoing;  
      if(!req.body.releaseYear)req.body.releaseYear = new Date();
      Anime.create(req.body)
      .then(() => {
        res.redirect(`/catalog`);
      })
      .catch(err => {
        console.log(err);
        res.redirect('/');
      });
    } else{
      throw new Error ('🚫 Not authorized 🚫');
    }
  })
  .catch(err => {
    console.log(err);
    res.redirect('/');
  })
}

function show(req, res){
  Anime.findById(req.params.animeId)
  .populate("reviews.user")
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

function update(req, res){
  if(req.user.profile.role > 500){
    req.body.ongoing = !!req.body.ongoing;
    Anime.findByIdAndUpdate(req.params.animeId, req.body, {new: true})
    .then(anime =>{    
      res.redirect(`/catalog/${anime._id}`)   
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    })
  }
  else {
    throw new Error('🚫 Not authorized 🚫');
  }
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
      Profile.findById(req.user.profile._id)
      .then(profile =>{
        profile.animeReviews.push(anime._id);
        profile.save()
        .then(()=>{
          res.redirect(`/catalog/${anime._id}`)   
        })
        .catch(err => {
          console.log(err)
          res.redirect('/')
        })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      });
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
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
      Profile.findById(req.user.profile._id)
      .then(profile =>{
        const index = profile.animeReviews.indexOf(anime._id)
        profile.animeReviews.splice(index, 1);
        profile.save()
        .then(() =>{
          anime.reviews.remove(review);
          anime.save()
          .then(()=>{        
            res.redirect(`/catalog/${anime._id}`)
          })
          .catch(err => {
            console.log(err)
            res.redirect('/')
          });          
        })
        .catch(err => {
          console.log(err)
          res.redirect('/')
        });
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      });
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

function updateReview(req, res){
  Anime.findById(req.params.animeId)
  .then(anime =>{
    const review = anime.reviews.id(req.params.reviewId);
    if (review.user.equals(req.user.profile._id)) {
      review.set(req.body);
      anime.save()
      .then(() => {
        res.redirect(`/catalog/${anime._id}`)
      })
      .catch(err => {
        console.log(err);
        res.redirect('/');
      })
    } else {
      throw new Error('🚫 Not authorized 🚫');
    }
  })
  .catch(err => {
    console.log(err);
    res.redirect('//');
  })
}

export {
  index,
  displayCatalog,
  newAnime as new,
  deleteAnime as delete,
  create,
  show,
  update,
  createReview,
  deleteReview,
  updateReview,
}