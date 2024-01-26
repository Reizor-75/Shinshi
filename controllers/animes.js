import { Anime } from "../models/anime.js";
import { Profile } from "../models/profile.js";
import Jikan from 'jikan4.js';

const client = new Jikan.Client();

async function search (req, res){
  const result = (await client.anime.search(req.body.title, null, null, 1)).map((anime) => {
    let genreList = [];
    anime.genres.forEach(genre => {genreList.push( genre.name)});
    let studioList = [];    
    anime.studios.forEach(studio => {studioList.push(studio.name)});
    return {
      title: anime.title.english,
      year: anime.year,
      genres: genreList,
      studios: studioList,
      synopsis: anime.synopsis,
      airing: anime.airInfo.status
    }
  });

  if (result[0].title) req.body.title = result[0].title;
  req.body.ongoing = result[0].airing;  
  req.body.genres = result[0].genres;
  req.body.releaseYear = new Date().setFullYear(result[0].year);
  req.body.studio = result[0].studios;
  req.body.rating = 0;
  req.body.synopsis = result[0].synopsis;

  Anime.create(req.body)
  .then(() => {
    res.redirect(`/catalog`);
  })
  .catch(err => {
    console.log(err);
    res.redirect('/');
  });
}

function index (req, res) {
  Anime.find({})
  .sort("ongoing")
  .sort({releaseYear: -1})
  .then(animes =>{
    res.render('index', { 
      title: 'Recent Animes',
      animes,
    });
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  });
}

function displayCatalog(req, res){
  Anime.find({})
  .sort("title")
  .then(animes => {
    res.render("animes/catalog", {
      animes,
      title: "Catalog"
    });
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  });
}

//admin
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
  });
}

//admin
function deleteAnime(req, res){  
  Profile.findById(req.user.profile._id)
  .then(profile =>{    
    if(profile.role > 500){
      Anime.findByIdAndDelete(req.params.animeId)
      .then(() =>{
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
    console.log(err)
    res.redirect('/')
  });
}

//admin
//No ApI
function create(req, res){  
  Profile.findById(req.user.profile._id)
  .then(profile =>{    
    if(profile.role> 500){
      req.body.rating = 0;
      req.body.ongoing = !!req.body.ongoing;  
      if(!req.body.releaseYear) req.body.releaseYear = new Date();
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
    });
  })
  .catch(err => {
    console.log(err);
    res.redirect('/');
  });
}

//admin
function update(req, res){
  if(req.user.profile.role > 500){
    Anime.findByIdAndUpdate(req.params.animeId, req.body, {new: true})
    .then(anime =>{    
      res.redirect(`/catalog/${anime._id}`) ;  
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
  }
  else {
    throw new Error('🚫 Not authorized 🚫');
  }
}

//user
function createReview(req, res){  
  Anime.findById(req.params.animeId)
  .then(anime =>{
    if(!req.body.reviewTitle) req.body.reviewTitle = "";
    if(!req.body.content) req.body.content = "No Comment";
    if(req.body.rating > 5) req.body.rating = 5;
    if(req.body.rating < 1) req.body.rating = 1;
    req.body.user = req.user.profile._id;

    anime.reviews.push(req.body);
    // to calculate average take anime rating multiple by number of reviews (before new review)
    // then add new review rating, then divide by number of reviews (include new)  
    anime.rating = ((anime.rating * (anime.reviews.length -1)) +  parseInt(req.body.rating) ) / anime.reviews.length;
    anime.save()
    .then(() =>{
      Profile.findById(req.user.profile._id)
      .then(profile =>{
        profile.animeReviews.push(anime._id);
        profile.save()
        .then(()=>{
          res.redirect(`/catalog/${anime._id}`);
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        });
      })
      .catch(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
  })
  .catch(err => {
    console.log(err);
    res.redirect('/');
  });
}

//user
function deleteReview(req, res){
  Anime.findById(req.params.animeId)
  .then(anime =>{
    const review = anime.reviews.id(req.params.reviewId);
    if(review.user.equals(req.user.profile._id)){
      Profile.findById(req.user.profile._id)
      .then(profile =>{
        const index = profile.animeReviews.indexOf(anime._id);
        profile.animeReviews.splice(index, 1);
        profile.save()
        .then(() =>{
          // to calculate average take anime rating multiple by number of reviews 
          // then sub current review rating, then divide by number of reviews (minus cur review)  
          anime.rating = ((anime.rating * (anime.reviews.length)) -  parseInt(review.rating) ) / anime.reviews.length - 1;
          anime.reviews.remove(review);
          anime.save()
          .then(()=>{        
            res.redirect(`/catalog/${anime._id}`);
          })
          .catch(err => {
            console.log(err);
            res.redirect('/');
          });          
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        });
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      });
    }
    else{
      throw new Error ('🚫 Not authorized 🚫');
    }
  })
  .catch(err => {
    console.log(err);
    res.redirect('/');
  });
}

//user
function updateReview(req, res){
  Anime.findById(req.params.animeId)
  .then(anime =>{
    const review = anime.reviews.id(req.params.reviewId);
    if (review.user.equals(req.user.profile._id)) {
      review.set(req.body);
      anime.save()
      .then(() => {
        res.redirect(`/catalog/${anime._id}`);
      })
      .catch(err => {
        console.log(err);
        res.redirect('/');
      });
    } else {
      throw new Error('🚫 Not authorized 🚫');
    }
  })
  .catch(err => {
    console.log(err);
    res.redirect('//');
  });
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
  search,
}