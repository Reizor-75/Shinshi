import { Router } from 'express';
import * as animesCtrl from "../controllers/animes.js";
import { isAdmin, isLoggedIn } from "../middleware/middleware.js";

const router = Router()

// GET http://localhost:3000/
router.get('/', animesCtrl.index)
// GET http://localhost:3000/catalog
router.get('/catalog', animesCtrl.displayCatalog)
// GET http://localhost:3000/new
router.get('/new',isAdmin, animesCtrl.new)
// GET http://localhost:3000/catalog/:animeId
router.get('/catalog/:animeId', animesCtrl.show)
// POST http://localhost:3000/catalog
router.post('/catalog', isAdmin, animesCtrl.create)
// POST http://localhost:3000/catalog/:animeId/reviews
router.post('/catalog/:animeId/reviews', isLoggedIn, animesCtrl.createReview)
// PUT localhost:3000/catalog/:animeId/reviews/:reviewId
router.put('/catalog/:animeId/reviews/:reviewId', isLoggedIn, animesCtrl.updateReview)
// DELETE http://localhost:3000/catalog/:animeId
router.delete('/catalog/:animeId/', isLoggedIn, animesCtrl.delete)
// DELETE http://localhost:3000/catalog/:animeId/reviews
router.delete('/catalog/:animeId/reviews/:reviewId', isLoggedIn, animesCtrl.deleteReview)

export {
  router
}
