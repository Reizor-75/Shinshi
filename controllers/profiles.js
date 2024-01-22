import { Profile } from "../models/profile.js"

function index(req, res) {
  Profile.find({})
  .then(profile => {
    res.render('profiles/index', {
      profile,
      title: "🐈💩"
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect("/")
  })
}

export {
  index,
}