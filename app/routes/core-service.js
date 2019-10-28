const fs = require('graceful-fs')
const postmark = require('postmark')

module.exports = function (router) {
  // Sign in pages
  router.get('/', function (req, res) {
    req.session.scenario = {}
    res.render('start')
  })
  router.get('/start', function (req, res) {
    req.session.scenario = {}
    res.render('start')
  })
  router.get('/signin', function (req, res) {
    res.render('signin')
  })
  router.post('/signin', function (req, res) {
    req.session.userEmail = req.body.email
    res.redirect('penalty-reference')
  })
  router.get('/penalty-reference', function (req, res) {
    res.render('penalty-reference')
  })
  router.post('/penalty-reference', function (req, res) {
    req.session.companyNumber = req.body.companyNumber
    req.session.penaltyReference = req.body.penaltyReference
    req.session.penaltyReference = req.session.penaltyReference.toUpperCase()
    var errorFlag = false
    var companyNumberErr = {}
    var penaltyReferenceErr = {}
    var errorList = []

    // VALIDATE USER INPUTS
    if (req.session.companyNumber.length < 8) {
      companyNumberErr.type = 'invalid'
      companyNumberErr.text = 'You must enter your full eight character company number'
      companyNumberErr.href = '#company-number'
      companyNumberErr.flag = true
    }
    if (req.session.companyNumber === '') {
      companyNumberErr.type = 'blank'
      companyNumberErr.text = 'You must enter an company number'
      companyNumberErr.href = '#company-number'
      companyNumberErr.flag = true
    }
    if (companyNumberErr.flag) {
      errorList.push(companyNumberErr)
      errorFlag = true
    }

    if (
      req.session.penaltyReference !== 'A00000001' &&
      req.session.penaltyReference !== 'B00000001'
    ) {
      penaltyReferenceErr.type = 'invalid'
      penaltyReferenceErr.text = 'Enter your reference number exactly as shown on your penalty notice'
      penaltyReferenceErr.href = '#penalty-reference'
      penaltyReferenceErr.flag = true
    }
    if (req.session.penaltyReference === '') {
      penaltyReferenceErr.type = 'blank'
      penaltyReferenceErr.text = 'You must enter a reference number'
      penaltyReferenceErr.href = '#penalty-reference'
      penaltyReferenceErr.flag = true
    }
    if (penaltyReferenceErr.flag) {
      errorList.push(penaltyReferenceErr)
      errorFlag = true
    }

    // TEST ERROR FLAG
    if (errorFlag === true) {
      res.render('penalty-reference', {
        errorList: errorList,
        companyNumberErr: companyNumberErr,
        penaltyReferenceErr: penaltyReferenceErr,
        companyNumber: req.session.companyNumber,
        penaltyReference: req.session.penaltyReference
      })
    } else {
      req.session.scenario = require('../assets/data/scenarios/' + req.session.companyNumber)
      res.redirect('/authenticate')
    }
  })
  // Authentication code (CHS account)
  router.get('/authenticate', function (req, res) {
    res.render('authenticate', {
      scenario: req.session.scenario
    })
  })
  router.post('/authenticate', function (req, res) {
    if (req.session.scenario != null) {
      var authCode = req.body.authCode
      var errorFlag = false
      var authCodeErr = {}
      var errorList = []

      authCode = authCode.toUpperCase()

      if (authCode !== req.session.scenario.company.authCode && authCode.length > 0) {
        authCodeErr.type = 'invalid'
        authCodeErr.text = 'The authentication code you entered isn\'t valid'
        authCodeErr.href = '#auth-code'
        authCodeErr.flag = true
      }
      if (authCode === '') {
        authCodeErr.type = 'blank'
        authCodeErr.text = 'You must enter an authentication code'
        authCodeErr.href = '#auth-code'
        authCodeErr.flag = true
      }
      if (authCodeErr.flag) {
        errorList.push(authCodeErr)
        errorFlag = true
      }

      // TEST ERROR FLAG
      if (errorFlag === true) {
        res.render('authenticate', {
          scenario: req.session.scenario,
          errorList: errorList,
          authCodeErr: authCodeErr,
          authCode: req.body.authCode
        })
      } else {
        res.redirect('/review-penalty')
      }
    } else {
      res.redirect('/start')
    }
  })

  // Review penalty details
  router.get('/review-penalty', function (req, res) {
    if (req.session.scenario != null) {
      req.session.appealReasons = []
      var totalDue = 0

      for (var i = 0; i < req.session.scenario.penalties.length; i++) {
        totalDue += (req.session.scenario.penalties[i].value + req.session.scenario.penalties[i].totalFees)
      }
      req.session.totalDue = totalDue

      res.render('review-penalty', {
        scenario: req.session.scenario,
        totalDue: totalDue
      })
    } else {
      res.redirect('/start')
    }
  })
  // Authentication code (CHS account)
  router.get('/authenticate', function (req, res) {
    res.render('authenticate', {
      scenario: req.session.scenario
    })
  })
  router.post('/authenticate', function (req, res) {
    if (req.session.scenario != null) {
      var authCode = req.body.authCode
      var errorFlag = false
      var authCodeErr = {}
      var errorList = []

      authCode = authCode.toUpperCase()

      if (authCode !== req.session.scenario.company.authCode && authCode.length > 0) {
        authCodeErr.type = 'invalid'
        authCodeErr.text = 'The authentication code you entered isn\'t valid'
        authCodeErr.href = '#auth-code'
        authCodeErr.flag = true
      }
      if (authCode === '') {
        authCodeErr.type = 'blank'
        authCodeErr.text = 'You must enter an authentication code'
        authCodeErr.href = '#auth-code'
        authCodeErr.flag = true
      }
      if (authCodeErr.flag) {
        errorList.push(authCodeErr)
        errorFlag = true
      }

      // TEST ERROR FLAG
      if (errorFlag === true) {
        res.render('authenticate', {
          scenario: req.session.scenario,
          errorList: errorList,
          authCodeErr: authCodeErr,
          authCode: req.body.authCode
        })
      } else {
        res.redirect('/review-penalty')
      }
    } else {
      res.redirect('/start')
    }
  })

  // Review penalty details
  router.get('/review-penalty', function (req, res) {
    if (req.session.scenario != null) {
      req.session.appealReasons = []
      var totalDue = 0

      for (var i = 0; i < req.session.scenario.penalties.length; i++) {
        totalDue += (req.session.scenario.penalties[i].value + req.session.scenario.penalties[i].totalFees)
      }
      req.session.totalDue = totalDue

      res.render('review-penalty', {
        scenario: req.session.scenario,
        totalDue: totalDue
      })
    } else {
      res.redirect('/start')
    }
  })
  router.get('/confirm-company', function (req, res) {
    res.render('confirm-company', {
      scenario: req.session.scenario
    })
  })
  router.get('/resume-application', function (req, res) {
    var userEmail = req.session.userEmail
    var scenario = req.session.scenario
    var appealReasons = req.session.appealReasons

    res.render('resume-application', {
      scenario: scenario,
      userEmail: userEmail,
      appealReasons: appealReasons,
      mode: true
    })
  })
  router.post('/resume-application', function (req, res) {
    var i = 0
    var reasonPos = 0
    var falseReason = false

    for (i = 0; i < req.session.appealReasons.length; i++) {
      if (req.session.appealReasons[i].complete === false) {
        reasonPos = i
        falseReason = true
        break
      }
    }
    if (falseReason) {
      res.redirect(req.session.appealReasons[i].nextStep)
    } else {
      res.redirect('check-your-answers')
    }
  })
  router.get('/check-your-answers', function (req, res) {
    var i

    for (i = 0; i < req.session.appealReasons.length; i++) {
      req.session.appealReasons[i].complete = true
    }
    res.render('check-your-answers', {
      scenario: req.session.scenario,
      appealReasons: req.session.appealReasons,
      userEmail: req.session.userEmail,
      penaltyReference: req.session.penaltyReference,
      companyNumber: req.session.companyNumber
    })
  })
  router.post('/check-your-answers', function (req, res) {
    res.redirect('confirmation')
  })
  router.get('/sign-out', function (req, res) {
    var application = {}
    var json = ''
    var jsonName = ''

    application.userEmail = req.session.userEmail
    application.scenario = req.session.scenario
    application.appealReasons = req.session.appealReasons
    jsonName = application.scenario.company.number
    json = JSON.stringify(application, null, '\t')
    // fs.writeFile('public/saved-sessions/' + jsonName + '.json', json, 'utf8')

    res.render('sign-out', {
      scenario: req.session.scenario,
      appealReasons: req.session.appealReasons,
      appealLength: req.session.appealLength,
      userEmail: req.session.userEmail
    })
  })
  router.get('/get-session', function (req, res) {
    var application = {}
    // var json = ''

    application.userEmail = req.session.userEmail
    application.scenario = req.session.scenario
    application.appealReasons = req.session.appealReasons
    // json = JSON.stringify(application, null, '\t')
    res.send(JSON.stringify(application))
  })
  router.get('/set-session', function (req, res) {
    var application = {}

    application = JSON.parse(req.query.application)
    req.session.userEmail = application.userEmail
    req.session.scenario = application.scenario
    req.session.appealReasons = application.appealReasons
    res.send(true)
  })
  router.get('/confirmation', function (req, res) {
    var scenario = req.session.scenario
    var appealReasons = req.session.appealReasons
    var userEmail = req.session.userEmail
    var authCodeFlag = false
    var i = 0

    for (i = 0; i < appealReasons.length; i++) {
      if (appealReasons[i].reason === 'authCode') {
        console.log('auth code flag 2')
        authCodeFlag = true
      }
    }

    if (process.env.POSTMARK_API_KEY) {
      var client = new postmark.Client(process.env.POSTMARK_API_KEY)

      // SEND CONFIRMATION EMAIL
      client.sendEmailWithTemplate({
        'From': process.env.FROM_EMAIL,
        'To': process.env.TO_EMAIL,
        'TemplateId': process.env.ETID_CONFIRMATION,
        'TemplateModel': {
          'scenario': scenario,
          'appealReasons': appealReasons,
          'userEmail': userEmail
        }
      }, function (error, success) {
        if (error) {
          console.error('Unable to send via postmark: ' + error.message)
        }
      })
      // SEND SUBMISSION EMAIL
      /*
      client.sendEmailWithTemplate({
        'From': process.env.FROM_EMAIL,
        'To': process.env.TO_EMAIL,
        'TemplateId': process.env.ETID_SUBMISSION,
        'TemplateModel': {
          'scenario': scenario,
          'appealReasons': appealReasons,
          'userEmail': userEmail
        }
      }, function (error, success) {
        if (error) {
          console.error('Unable to send via postmark: ' + error.message)
        }
      })
      */
    } else {
      console.log('No Postmrk API key detected. To test emails run app locally with `heroku local web`')
    }
    res.render('confirmation', {
      scenario: req.session.scenario,
      appealReasons: req.session.appealReasons,
      appealLength: req.session.appealLength,
      userEmail: req.session.userEmail,
      authCodeFlag: authCodeFlag
    })
  })
  router.get('/print-application', function (req, res) {
    res.render('print-application', {
      scenario: req.session.scenario,
      appealReasons: req.session.appealReasons,
      appealLength: req.session.appealLength,
      userEmail: req.session.userEmail,
      backLinkHref: 'confirmation'
    })
  })
  // DOCUMENT DOWNLOAD
  router.get('/download', function (req, res) {
    res.render('download')
  })
}
