function passDataToView(req, res, next) {
  res.locals.user = req.user ? req.user : null
  res.locals.googleClientID = process.env.GOOGLE_CLIENT_ID
  next()
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}

function isAdmin(req, res, next){
  if (req.isAuthenticated() && req.user.profile.role === "admin") return next()
  res.redirect('/')
}

export {
  passDataToView,
  isLoggedIn,
  isAdmin
}
