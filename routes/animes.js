import { Router } from 'express'
import * as animesCtrl from "../controllers/animes.js"

const router = Router()

// GET http://localhost:3000/anime
router.get('/', animesCtrl.index)
// GET http://localhost:3000/anime/catalog
router.get('/catalog', animesCtrl.displayCatalog)
// GET http://localhost:3000/anime/new
router.get('/new', animesCtrl.new)


export {
  router
}
