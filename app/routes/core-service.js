const fs = require('graceful-fs')
const postmark = require('postmark')

module.exports = function (router) {
  // Sign in pages
  router.get('/', function (req, res) {
    res.render('start')
  })
  router.get('/start', function (req, res) {
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
    if (req.session.scenario != null) {
      res.render('penalty-reference', {
        scenario: req.session.scenario,
        companyNumber: req.session.scenario.company.number,
        penaltyReference: req.session.penaltyReference
      })
    } else {
      res.render('penalty-reference')
    }
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
    req.session.penaltyReference !== 'PEN1A/12345677' &&
    req.session.penaltyReference !== 'PEN2A/12345677' &&
    req.session.penaltyReference !== 'PEN1A/12345671' &&
    req.session.penaltyReference !== 'PEN2A/12345671' &&
    req.session.penaltyReference !== 'PEN1A/12345672'
  ) {
      penaltyReferenceErr.type = 'invalid'
      penaltyReferenceErr.text = 'Enter your penalty reference exactly as shown on your penalty letter'
      penaltyReferenceErr.href = '#penalty-reference'
      penaltyReferenceErr.flag = true
    }
    if (req.session.penaltyReference === '') {
      penaltyReferenceErr.type = 'blank'
      penaltyReferenceErr.text = 'You must enter a penalty reference'
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
      if (req.session.penaltyReference === 'PEN1A/12345677' || req.session.penaltyReference === 'PEN2A/12345677') {
        req.session.scenario = require('./assets/data/scenarios/00345567')
      } else if (req.session.penaltyReference === 'PEN1A/12345671' || req.session.penaltyReference === 'PEN2A/12345671' || req.session.penaltyReference === 'PEN1A/12345672') {
        req.session.scenario = require('./assets/data/scenarios/00987512')
      }
      res.redirect('/authenticate')
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
    var extensionReasons = req.session.extensionReasons

    res.render('resume-application', {
      scenario: scenario,
      userEmail: userEmail,
      extensionReasons: extensionReasons,
      mode: true
    })
  })
  router.post('/resume-application', function (req, res) {
    var i = 0
    var reasonPos = 0
    var falseReason = false

    for (i = 0; i < req.session.extensionReasons.length; i++) {
      if (req.session.extensionReasons[i].complete === false) {
        reasonPos = i
        falseReason = true
        break
      }
    }
    if (falseReason) {
      res.redirect(req.session.extensionReasons[i].nextStep)
    } else {
      res.redirect('check-your-answers')
    }
  })
  router.get('/check-your-answers', function (req, res) {
    var i

    for (i = 0; i < req.session.extensionReasons.length; i++) {
      req.session.extensionReasons[i].complete = true
    }
    res.render('check-your-answers', {
      scenario: req.session.scenario,
      extensionReasons: req.session.extensionReasons,
      userEmail: req.session.userEmail
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
    application.extensionReasons = req.session.extensionReasons
    jsonName = application.scenario.company.number
    json = JSON.stringify(application, null, '\t')
    // fs.writeFile('public/saved-sessions/' + jsonName + '.json', json, 'utf8')

    res.render('sign-out', {
      scenario: req.session.scenario,
      extensionReasons: req.session.extensionReasons,
      extensionLength: req.session.extensionLength,
      userEmail: req.session.userEmail
    })
  })
  router.get('/get-session', function (req, res) {
    var application = {}
    // var json = ''

    application.userEmail = req.session.userEmail
    application.scenario = req.session.scenario
    application.extensionReasons = req.session.extensionReasons
    // json = JSON.stringify(application, null, '\t')
    res.send(JSON.stringify(application))
  })
  router.get('/set-session', function (req, res) {
    var application = {}

    application = JSON.parse(req.query.application)
    req.session.userEmail = application.userEmail
    req.session.scenario = application.scenario
    req.session.extensionReasons = application.extensionReasons
    res.send(true)
  })
  router.get('/confirmation', function (req, res) {
    var scenario = req.session.scenario
    var extensionReasons = req.session.extensionReasons
    var userEmail = req.session.userEmail
    var authCodeFlag = false
    var i = 0

    for (i = 0; i < extensionReasons.length; i++) {
      if (extensionReasons[i].reason === 'authCode') {
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
          'extensionReasons': extensionReasons,
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
          'extensionReasons': extensionReasons,
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
      extensionReasons: req.session.extensionReasons,
      extensionLength: req.session.extensionLength,
      userEmail: req.session.userEmail,
      authCodeFlag: authCodeFlag
    })
  })
  router.get('/print-application', function (req, res) {
    res.render('print-application', {
      scenario: req.session.scenario,
      extensionReasons: req.session.extensionReasons,
      extensionLength: req.session.extensionLength,
      userEmail: req.session.userEmail,
      backLinkHref: 'confirmation'
    })
  })
  // DOCUMENT DOWNLOAD
  router.get('/download', function (req, res) {
    res.render('download')
  })
}
