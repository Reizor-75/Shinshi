import { Profile } from "../models/profile.js"

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
    console.log(`😸 ${profile.animeReviews}`)
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

export {
  index,
  watchList,
  reviews
}