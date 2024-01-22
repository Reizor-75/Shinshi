import { Router } from 'express'
import * as profilesCtrl from '../controllers/profiles.js'
import { isLoggedIn } from "../middleware/middleware.js";

const router = Router()

// GET localhost:3000/profiles
router.get('/', isLoggedIn, profilesCtrl.index)
// GET localhost:3000/profiles/watched
router.get('/watched', isLoggedIn, profilesCtrl.watchList)
// GET localhost:3000/profiles/revies
router.get('/reviews', isLoggedIn, profilesCtrl.reviews)

export {
  router
}