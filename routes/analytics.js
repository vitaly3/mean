const passport = require('passport')
const express = require('express')
const controller = require('../controllers/analytic')
const router = express.Router()

router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview)
router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analitics)

module.exports = router
