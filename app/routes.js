const express = require('express')
const router = express.Router()

// Start
router.get('/', function (req, res) {
  res.render('start')
})

// Sign in (via CHS account)
router.get('/sign-in', function (req, res) {
  res.render('sign-in')
})
router.post('/sign-in', function (req, res) {
  res.render('sign-in')
})

// Penalty reference and company number
router.get('/penalty-reference', function (req, res) {
  res.render('penalty-reference')
})
router.post('/penalty-reference', function (req, res) {
  res.render('penalty-reference')
})

// Authentication code (CHS account)
router.get('/authenticate', function (req, res) {
  res.render('authenticate')
})
router.post('/authenticate', function (req, res) {
  res.render('authenticate')
})

// Review penalty details
router.get('/review-penalty', function (req, res) {
  res.render('review-penalty')
})

// Choose appeal reason
router.get('/choose-appeal-reason', function (req, res) {
  res.render('choose-appeal-reason')
})
router.post('/choose-appeal-reason', function (req, res) {
  var reason = req.body.appealReason
  req.session.appealReason = reason
  switch (reason) {
    case 'health':
      res.redirect('/ill-health/who-was-ill')
      break
    case 'disaster':
      res.redirect('/natural-disaster/type-of-disaster')
      break
    case 'payment':
      res.redirect('/payment-appeal')
      break
    case 'filing':
      res.redirect('/filing-appeal')
      break
    case 'dormant':
      res.redirect('/dormant-appeal')
      break
    case 'post':
      res.redirect('/delivery-appeal')
      break
    case 'other':
      req.session.otherReason = req.body.otherReason
      res.redirect('/other-appeal')
      break
  }
})

// ILLNESS
// Who was ill
router.get('/ill-health/who-was-ill', function (req, res) {
  res.render('ill-health/who-was-ill')
})
router.post('/ill-health/who-was-ill', function (req, res) {
  req.session.illPerson = req.body.illPerson
  req.session.someoneElse = req.body.someoneElse
  res.redirect('/ill-health/date-illness-started')
})

// Date illness started
router.get('/ill-health/date-illness-started', function (req, res) {
  res.render('ill-health/date-illness-started')
})
router.post('/ill-health/date-illness-started', function (req, res) {
  req.session.illnessStartDate = {}
  req.session.illnessStartDate.day = req.body['illnessStart-day']
  req.session.illnessStartDate.month = req.body['illnessStart-month']
  req.session.illnessStartDate.year = req.body['illnessStart-year']
  res.redirect('/ill-health/continued-illness')
})

// Continued illness
router.get('/ill-health/continued-illness', function (req, res) {
  res.render('ill-health/continued-illness', {
    illnessStartDate: req.session.illnessStartDate
  })
})
router.post('/ill-health/continued-illness', function (req, res) {
  req.session.continuedIllness = req.body.continuedIllness
  if (req.session.continuedIllness === 'no') {
    res.redirect('/ill-health/date-illness-ended')
  } else {
    res.redirect('/ill-health/nature-of-illness')
  }
})

// Date illness ended
router.get('/ill-health/date-illness-ended', function (req, res) {
  res.render('ill-health/date-illness-ended', {
    illnessStartDate: req.session.illnessStartDate
  })
})
router.post('/ill-health/date-illness-ended', function (req, res) {
  req.session.illnessEndDate = {}
  req.session.illnessEndDate.day = req.body['illnessEnd-day']
  req.session.illnessEndDate.month = req.body['illnessEnd-month']
  req.session.illnessEndDate.year = req.body['illnessEnd-year']
  res.redirect('/ill-health/nature-of-illness')
})

// Nature of illness
router.get('/ill-health/nature-of-illness', function (req, res) {
  var backLink = ''
  if (req.session.continuedIllness === 'no') {
    backLink = 'date-illness-ended'
  } else {
    backLink = 'continued-illness'
  }
  res.render('ill-health/nature-of-illness', {
    backLink: backLink
  })
})
router.post('/ill-health/nature-of-illness', function (req, res) {
  req.session.natureOfIllness = req.body.natureOfIllness
  res.redirect('/supporting-evidence')
})

// NATURAL DISASTER
// Type of disaster
router.get('/natural-disaster/type-of-disaster', function (req, res) {
  res.render('natural-disaster/type-of-disaster')
})

// Date of disaster
router.get('/natural-disaster/date-of-disaster', function (req, res) {
  res.render('natural-disaster/date-of-disaster')
})

// Other appeal
router.get('/other-appeal', function (req, res) {
  res.render('other-appeal', {
    otherReason: req.session.otherReason
  })
})

// Supporting evidence
router.get('/supporting-evidence', function (req, res) {
  res.render('supporting-evidence')
})

// Add another appeal reason
router.get('/add-appeal-reason', function (req, res) {
  res.render('add-appeal-reason')
})

// Check your answers
router.get('/check-your-answers', function (req, res) {
  res.render('check-your-answers')
})

// Confirmation
router.get('/confirmation', function (req, res) {
  res.render('confirmation')
})

module.exports = router
