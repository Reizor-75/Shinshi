import { Router } from 'express';
import * as profilesCtrl from '../controllers/profiles.js';
import { isLoggedIn } from "../middleware/middleware.js";

const router = Router();

// GET localhost:3000/profiles
router.get('/', isLoggedIn, profilesCtrl.index)
// GET localhost:3000/profiles/watched
router.get('/watched', isLoggedIn, profilesCtrl.watchList)
// GET localhost:3000/profiles/reviews
router.get('/reviews', isLoggedIn, profilesCtrl.reviews)
// POST http://localhost:3000/profiles/watched
router.post('/watched', isLoggedIn, profilesCtrl.addWatchList)
// PUT localhost:3000/profiles/reviews/:animeId/:reviewId
router.put('/reviews/:animeId/:reviewId', isLoggedIn, profilesCtrl.updateReview)
// DELETE localhost:3000/profiles/watched/:animeId
router.delete('/watched/:animeId', isLoggedIn, profilesCtrl.deleteWatchList)
// DELETE localhost:3000/profiles/reviews/:animeId/:reviewId
router.delete('/reviews/:animeId/:reviewId', isLoggedIn, profilesCtrl.deleteReview)

export {
  router
}