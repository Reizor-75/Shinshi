import { Router } from 'express'
import * as animesCtrl from "../controllers/animes.js"

const router = Router()

// GET http://localhost:3000/
router.get('/', animesCtrl.index)
// GET http://localhost:3000/catalog
router.get('/catalog', animesCtrl.displayCatalog)
// GET http://localhost:3000/new
router.get('/new', animesCtrl.new)
// GET http://localhost:3000/catalog/:animeId
router.get('/catalog/:animeId', animesCtrl.show)

// POST http://localhost:3000/catalog
router.post('/catalog', animesCtrl.create)


export {
  router
}
