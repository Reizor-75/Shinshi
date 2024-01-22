import { Profile } from "../models/profile.js"
import { Anime } from "../models/anime.js"

function index(req, res) {
  Profile.findById(req.user.profile._id)
  .then(profile =>{
    res.render('profiles/index', {
      profile,
      title: `${profile.name}'s Profile`
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect("/")
  });
}

function watchList(req, res){
  Profile.findById(req.user.profile._id)
  .then(profile =>{
    res.render("profiles/watched", {
      profile,
      title:` Watched List`
    });
  })
  .catch(err => {
    console.log(err)
    res.redirect("/")
  });
}

function reviews(req, res){
  Profile.findById(req.user.profile._id)
  .populate("animeReviews")
  .then(profile =>{
    res.render("profiles/reviews", {
      profile,
      title:` Your Reviews`
    });
  })
  .catch(err => {
    console.log(err)
    res.redirect("/")
  });
}

//ask about this
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
        console.log(err)
        res.redirect('//')
      })
    } else {
      throw new Error('🚫 Not authorized 🚫')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect("/")
  });
}

export {
  index,
  watchList,
  reviews,
  updateReview
}