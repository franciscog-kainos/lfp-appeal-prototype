const express = require('express')
const router = express.Router()

// ROUTE TEMPLATES
router.get('/template', function (req, res) {
  if (req.session.scenario != null) {
    res.render('template', {
      scenario: req.session.scenario
    })
  } else {
    res.redirect('/start')
  }
})
router.post('/template', function (req, res) {
  if (req.session.scenario != null) {
    var template = req.body.template
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (template === '') {
      Err.type = 'blank'
      Err.text = 'You must enter an authentication code'
      Err.href = '#auth-code'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }

    // TEST ERROR FLAG
    if (errorFlag === true) {
      res.render('template', {
        scenario: req.session.scenario,
        errorList: errorList,
        Err: Err
      })
    } else {
      res.redirect('/template')
    }
  } else {
    res.redirect('/start')
  }
})

// Start
router.get('/', function (req, res) {
  req.session.destroy()
  res.render('start')
})
router.get('start', function (req, res) {
  req.session.destroy()
  res.render('start')
})

// Sign in (via CHS account)
router.get('/sign-in', function (req, res) {
  res.render('sign-in')
})
router.post('/sign-in', function (req, res) {
  req.session.email = req.body.email
  req.session.password = req.body.password
  var errorFlag = false
  var emailErr = {}
  var passwordErr = {}
  var errorList = []

  if (req.session.email === '') {
    emailErr.type = 'blank'
    emailErr.text = 'You must enter an email address'
    emailErr.href = '#email'
    emailErr.flag = true
    errorList.push(emailErr)
    errorFlag = true
  }
  if (req.session.password === '') {
    passwordErr.type = 'blank'
    passwordErr.text = 'You must enter a password'
    passwordErr.href = '#password'
    passwordErr.flag = true
    errorList.push(passwordErr)
    errorFlag = true
  }

  // TEST ERROR FLAG
  if (errorFlag === true) {
    res.render('sign-in', {
      errorList: errorList,
      emailErr: emailErr,
      passwordErr: passwordErr,
      email: req.session.email,
      password: req.session.password
    })
  } else {
    res.redirect('/penalty-reference')
  }
})

// Penalty reference and company number
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
    companyNumberErr.href = '#companyNumber'
    companyNumberErr.flag = true
  }
  if (req.session.companyNumber === '') {
    companyNumberErr.type = 'blank'
    companyNumberErr.text = 'You must enter an company number'
    companyNumberErr.href = '#companyNumber'
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
    penaltyReferenceErr.href = '#penaltyReference'
    penaltyReferenceErr.flag = true
  }
  if (req.session.penaltyReference === '') {
    penaltyReferenceErr.type = 'blank'
    penaltyReferenceErr.text = 'You must enter a penalty reference'
    penaltyReferenceErr.href = '#penaltyReference'
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

// Authentication code (CHS account)
router.get('/authenticate', function (req, res) {
  if (req.session.scenario != null) {
    res.render('authenticate', {
      scenario: req.session.scenario
    })
  } else {
    res.redirect('/start')
  }
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

// Choose appeal reason
router.get('/choose-appeal-reason', function (req, res) {
  if (req.session.scenario != null) {
    var backLink = ''

    if (req.session.appealReasons.length > 0) {
      backLink = 'add-appeal-reason'
    } else {
      backLink = 'review-penalty'
    }
    res.render('choose-appeal-reason', {
      scenario: req.session.scenario,
      backLink: backLink
    })
  } else {
    res.redirect('/start')
  }
})
router.post('/choose-appeal-reason', function (req, res) {
  if (req.session.scenario != null) {
    req.session.appealReason = req.body.appealReason
    req.session.otherReason = req.body.otherReason
    var reasonObject = {}
    var errorFlag = false
    var appealReasonErr = {}
    var errorList = []
    var backLink = ''

    if (req.session.appealReasons.length > 0) {
      backLink = 'add-appeal-reason'
    } else {
      backLink = 'review-penalty'
    }

    if (typeof req.body.appealReason === 'undefined') {
      appealReasonErr.type = 'blank'
      appealReasonErr.text = 'You must tell us the reason for your appeal'
      appealReasonErr.href = '#appeal-reason'
      appealReasonErr.flag = true
    }
    if (req.body.appealReason === 'other' && req.session.otherReason === '') {
      appealReasonErr.type = 'invalid'
      appealReasonErr.text = 'You must describe the reason for your appeal'
      appealReasonErr.href = '#other-reason'
      appealReasonErr.flag = true
    }
    if (appealReasonErr.flag) {
      errorList.push(appealReasonErr)
      errorFlag = true
    }

    if (errorFlag === true) {
      res.render('choose-appeal-reason', {
        scenario: req.session.scenario,
        errorList: errorList,
        appealReasonErr: appealReasonErr,
        backLink: backLink
      })
    } else {
      switch (req.session.appealReason) {
        case 'health':
          reasonObject.reason = req.session.appealReason
          req.session.appealReasons.push(reasonObject)
          res.redirect('/ill-health/who-was-ill')
          break
        case 'disaster':
          reasonObject.reason = req.session.appealReason
          req.session.appealReasons.push(reasonObject)
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
          reasonObject.appealReason = req.session.appealReason
          reasonObject.otherReason = req.session.otherReason
          req.session.appealReasons.push(reasonObject)
          console.log(req.session.appealReasons)
          res.redirect('/other-appeal')
          break
      }
    }
  } else {
    res.redirect('/start')
  }
})

// ILLNESS
// Who was ill
router.get('/ill-health/who-was-ill', function (req, res) {
  if (req.session.scenario != null) {
    res.render('ill-health/who-was-ill', {
      scenario: req.session.scenario
    })
  } else {
    res.redirect('/start')
  }
})
router.post('/ill-health/who-was-ill', function (req, res) {
  if (req.session.scenario != null) {
    req.session.illPerson = req.body.illPerson
    req.session.otherIllPerson = req.body.otherIllPerson
    var reasonObject = {}
    var errorFlag = false
    var illPersonErr = {}
    var errorList = []

    if (typeof req.body.illPerson === 'undefined') {
      illPersonErr.type = 'blank'
      illPersonErr.text = 'You must tell us who was ill'
      illPersonErr.href = '#ill-person'
      illPersonErr.flag = true
    }
    if (req.body.illPerson === 'someoneElse' && req.session.otherIllPerson === '') {
      illPersonErr.type = 'invalid'
      illPersonErr.text = 'You must tell us who was ill'
      illPersonErr.href = '#other-ill-person'
      illPersonErr.flag = true
    }
    if (illPersonErr.flag) {
      errorList.push(illPersonErr)
      errorFlag = true
    }

    if (errorFlag === true) {
      res.render('ill-health/who-was-ill', {
        scenario: req.session.scenario,
        errorList: errorList,
        illPersonErr: illPersonErr
      })
    } else {
      reasonObject = req.session.appealReasons.pop()
      reasonObject.illPerson = req.session.illPerson
      reasonObject.otherIllPerson = req.session.otherIllPerson
      req.session.appealReasons.push(reasonObject)
      console.log(req.session.appealReasons)
      res.redirect('/ill-health/date-illness-started')
    }
  } else {
    res.redirect('/start')
  }
})

// Date illness started
router.get('/ill-health/date-illness-started', function (req, res) {
  if (req.session.scenario != null) {
    res.render('ill-health/date-illness-started', {
      scenario: req.session.scenario
    })
  } else {
    res.redirect('/start')
  }
})
router.post('/ill-health/date-illness-started', function (req, res) {
  if (req.session.scenario != null) {
    req.session.illnessStartDate = {}
    req.session.illnessStartDate.day = req.body['illnessStart-day']
    req.session.illnessStartDate.month = req.body['illnessStart-month']
    req.session.illnessStartDate.year = req.body['illnessStart-year']
    var reasonObject = {}
    var errorFlag = false
    var startDateErr = {}
    var errorList = []

    if (req.session.illnessStartDate.day === '' || req.session.illnessStartDate.month === '' || req.session.illnessStartDate.year === '') {
      startDateErr.type = 'invalid'
      startDateErr.text = 'You must tell us when the illness started'
      startDateErr.href = '#illness-start'
      startDateErr.flag = true
    }
    if (startDateErr.flag) {
      errorList.push(startDateErr)
      errorFlag = true
    }

    if (errorFlag === true) {
      res.render('ill-health/date-illness-started', {
        scenario: req.session.scenario,
        errorList: errorList,
        startDateErr: startDateErr,
        startDate: req.session.illnessStartDate
      })
    } else {
      reasonObject = req.session.appealReasons.pop()
      reasonObject.illnessStartDate = req.session.illnessStartDate
      req.session.appealReasons.push(reasonObject)
      console.log(req.session.appealReasons)
      res.redirect('/ill-health/continued-illness')
    }
  } else {
    res.redirect('/start')
  }
})

// Continued illness
router.get('/ill-health/continued-illness', function (req, res) {
  if (req.session.scenario != null) {
    var reasonObject = req.session.appealReasons[req.session.appealReasons.length - 1]
    res.render('ill-health/continued-illness', {
      scenario: req.session.scenario,
      startDate: reasonObject.illnessStartDate
    })
  } else {
    res.redirect('/start')
  }
})
router.post('/ill-health/continued-illness', function (req, res) {
  if (req.session.scenario != null) {
    req.session.continuedIllness = req.body.continuedIllness
    var errorFlag = false
    var continuedIllnessErr = {}
    var errorList = []

    if (typeof req.session.continuedIllness === 'undefined') {
      continuedIllnessErr.type = 'blank'
      continuedIllnessErr.text = 'You must tell us if this person is still ill'
      continuedIllnessErr.href = '#continued-illness'
      continuedIllnessErr.flag = true
    }
    if (continuedIllnessErr.flag) {
      errorList.push(continuedIllnessErr)
      errorFlag = true
    }

    // TEST ERROR FLAG
    if (errorFlag === true) {
      var reasonObject = req.session.appealReasons[req.session.appealReasons.length - 1]
      res.render('ill-health/continued-illness', {
        scenario: req.session.scenario,
        errorList: errorList,
        continuedIllnessErr: continuedIllnessErr,
        startDate: reasonObject.illnessStartDate
      })
    } else {
      reasonObject = req.session.appealReasons.pop()
      reasonObject.continuedIllness = req.session.continuedIllness
      req.session.appealReasons.push(reasonObject)
      console.log(req.session.appealReasons)
      if (req.session.continuedIllness === 'no') {
        res.redirect('/ill-health/date-illness-ended')
      } else {
        res.redirect('/ill-health/about-the-illness')
      }
    }
  } else {
    res.redirect('/start')
  }
})

// Date illness ended
router.get('/ill-health/date-illness-ended', function (req, res) {
  if (req.session.scenario != null) {
    var reasonObject = req.session.appealReasons[req.session.appealReasons.length - 1]
    res.render('ill-health/date-illness-ended', {
      scenario: req.session.scenario,
      startDate: reasonObject.illnessStartDate
    })
  } else {
    res.redirect('/start')
  }
})
router.post('/ill-health/date-illness-ended', function (req, res) {
  if (req.session.scenario != null) {
    req.session.illnessEndDate = {}
    req.session.illnessEndDate.day = req.body['illnessEnd-day']
    req.session.illnessEndDate.month = req.body['illnessEnd-month']
    req.session.illnessEndDate.year = req.body['illnessEnd-year']
    var reasonObject = {}
    var errorFlag = false
    var endDateErr = {}
    var errorList = []

    if (req.session.illnessEndDate.day === '' || req.session.illnessEndDate.month === '' || req.session.illnessEndDate.year === '') {
      endDateErr.type = 'invalid'
      endDateErr.text = 'You must tell us when the illness ended'
      endDateErr.href = '#illness-end'
      endDateErr.flag = true
    }
    if (endDateErr.flag) {
      errorList.push(endDateErr)
      errorFlag = true
    }

    if (errorFlag === true) {
      reasonObject = req.session.appealReasons[req.session.appealReasons.length - 1]
      res.render('ill-health/date-illness-ended', {
        scenario: req.session.scenario,
        errorList: errorList,
        endDateErr: endDateErr,
        endDate: req.session.illnessEndDate,
        startDate: reasonObject.illnessStartDate
      })
    } else {
      reasonObject = req.session.appealReasons.pop()
      reasonObject.illnessEndDate = req.session.illnessEndDate
      req.session.appealReasons.push(reasonObject)
      console.log(req.session.appealReasons)
      res.redirect('/ill-health/about-the-illness')
    }
  } else {
    res.redirect('/start')
  }
})

// Tell us about the illness
router.get('/ill-health/about-the-illness', function (req, res) {
  if (req.session.scenario != null) {
    var backLink = ''
    if (req.session.continuedIllness === 'no') {
      backLink = 'date-illness-ended'
    } else {
      backLink = 'continued-illness'
    }
    res.render('ill-health/about-the-illness', {
      scenario: req.session.scenario,
      backLink: backLink
    })
  } else {
    res.redirect('/start')
  }
})
router.post('/ill-health/about-the-illness', function (req, res) {
  if (req.session.scenario != null) {
    req.session.provideDetail = req.body.provideDetail
    var errorFlag = false
    var provideDetailErr = {}
    var errorList = []
    var reasonObject = {}
    var backLink = ''

    if (req.session.continuedIllness === 'no') {
      backLink = 'date-illness-ended'
    } else {
      backLink = 'continued-illness'
    }

    if (typeof req.session.provideDetail === 'undefined') {
      provideDetailErr.type = 'blank'
      provideDetailErr.text = 'You must tell us if you want to give us more information'
      provideDetailErr.href = '#about-the-illness'
      provideDetailErr.flag = true
    }
    if (provideDetailErr.flag) {
      errorList.push(provideDetailErr)
      errorFlag = true
    }

    // TEST ERROR FLAG
    if (errorFlag === true) {
      res.render('ill-health/about-the-illness', {
        scenario: req.session.scenario,
        errorList: errorList,
        provideDetailErr: provideDetailErr,
        backLink: backLink
      })
    } else {
      reasonObject = req.session.appealReasons.pop()
      reasonObject.provideDetail = req.session.provideDetail
      req.session.appealReasons.push(reasonObject)
      console.log(req.session.appealReasons)
      if (req.session.provideDetail === 'no') {
        res.redirect('/supporting-evidence')
      } else {
        res.redirect('/ill-health/nature-of-illness')
      }
    }
  } else {
    res.redirect('/start')
  }
})

// Nature of illness
router.get('/ill-health/nature-of-illness', function (req, res) {
  if (req.session.scenario != null) {
    res.render('ill-health/nature-of-illness', {
      scenario: req.session.scenario,
      natureOfIllness: req.session.natureOfIllness
    })
  } else {
    res.redirect('/start')
  }
})
router.post('/ill-health/nature-of-illness', function (req, res) {
  if (req.session.scenario != null) {
    req.session.natureOfIllness = req.body.natureOfIllness
    var errorFlag = false
    var natureOfIllnessErr = {}
    var errorList = []
    var reasonObject = {}

    if (req.session.natureOfIllness === '') {
      natureOfIllnessErr.type = 'blank'
      natureOfIllnessErr.text = 'You haven\'t told us more about the illness'
      natureOfIllnessErr.href = '#nature-of-illness'
      natureOfIllnessErr.flag = true
    }
    if (natureOfIllnessErr.flag) {
      errorList.push(natureOfIllnessErr)
      errorFlag = true
    }

    // TEST ERROR FLAG
    if (errorFlag === true) {
      res.render('ill-health/nature-of-illness', {
        scenario: req.session.scenario,
        errorList: errorList,
        natureOfIllnessErr: natureOfIllnessErr
      })
    } else {
      reasonObject = req.session.appealReasons.pop()
      reasonObject.natureOfIllness = req.session.natureOfIllness
      req.session.appealReasons.push(reasonObject)
      console.log(req.session.appealReasons)
      res.redirect('/supporting-evidence')
    }
  } else {
    res.redirect('/start')
  }
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
  if (req.session.scenario != null) {
    var backLink = ''
    /*
    if (req.session.continuedIllness === 'no') {
      backLink = ''
    } else {
      backLink = ''
    }
    */
    res.render('supporting-evidence', {
      scenario: req.session.scenario,
      backLink: backLink
    })
  } else {
    res.redirect('/start')
  }
})
router.post('/supporting-evidence', function (req, res) {
  if (req.session.scenario != null) {
    req.session.supportingEvidence = req.body.supportingEvidence
    var errorFlag = false
    var supportingEvidenceErr = {}
    var errorList = []
    var reasonObject = {}
    var backLink = ''

    /*
    if (req.session.continuedIllness === 'no') {
      backLink = 'date-illness-ended'
    } else {
      backLink = 'continued-illness'
    }
    */

    if (typeof req.session.supportingEvidence === 'undefined') {
      supportingEvidenceErr.type = 'blank'
      supportingEvidenceErr.text = 'You must tell us if you want to provide supporting evidence'
      supportingEvidenceErr.href = '#supporting-evidence'
      supportingEvidenceErr.flag = true
    }
    if (supportingEvidenceErr.flag) {
      errorList.push(supportingEvidenceErr)
      errorFlag = true
    }

    // TEST ERROR FLAG
    if (errorFlag === true) {
      res.render('supporting-evidence', {
        scenario: req.session.scenario,
        errorList: errorList,
        supportingEvidenceErr: supportingEvidenceErr,
        backLink: backLink
      })
    } else {
      reasonObject = req.session.appealReasons.pop()
      reasonObject.supportingEvidence = req.session.supportingEvidence
      req.session.appealReasons.push(reasonObject)
      console.log(req.session.appealReasons)
      if (req.session.supportingEvidence === 'no') {
        res.redirect('/add-appeal-reason')
      } else {
        res.redirect('/add-supporting-evidence')
      }
    }
  } else {
    res.redirect('/start')
  }
})

// Add supporting evidence
router.get('/add-supporting-evidence', function (req, res) {
  res.render('add-supporting-evidence')
})

// Add another appeal reason
router.get('/add-appeal-reason', function (req, res) {
  if (req.session.scenario != null) {
    var backLink = ''
    /*
    if (req.session.continuedIllness === 'no') {
      backLink = ''
    } else {
      backLink = ''
    }
    */
    res.render('add-appeal-reason', {
      scenario: req.session.scenario,
      backLink: backLink
    })
  } else {
    res.redirect('/start')
  }
})
router.post('/add-appeal-reason', function (req, res) {
  if (req.session.scenario != null) {
    req.session.addAppealReason = req.body.addAppealReason
    var errorFlag = false
    var addAppealReasonErr = {}
    var errorList = []
    var backLink = ''
    var lastStep = req.session.appealReasons[req.session.appealReasons.length - 1].supportingEvidence

    if (lastStep === 'no') {
      backLink = 'supporting-evidence'
    } else {
      backLink = 'add-supporting-evidence'
    }

    if (typeof req.session.addAppealReason === 'undefined') {
      addAppealReasonErr.type = 'blank'
      addAppealReasonErr.text = 'You must tell us if you have another reason for this appeal'
      addAppealReasonErr.href = '#add-appeal-reason'
      addAppealReasonErr.flag = true
    }
    if (addAppealReasonErr.flag) {
      errorList.push(addAppealReasonErr)
      errorFlag = true
    }

    // TEST ERROR FLAG
    if (errorFlag === true) {
      res.render('add-appeal-reason', {
        scenario: req.session.scenario,
        errorList: errorList,
        addAppealReasonErr: addAppealReasonErr,
        backLink: backLink
      })
    } else {
      console.log(req.session.appealReasons)
      if (req.session.addAppealReason === 'no') {
        res.redirect('/check-your-answers')
      } else {
        res.redirect('/choose-appeal-reason')
      }
    }
  } else {
    res.redirect('/start')
  }
})

// Check your answers
router.get('/check-your-answers', function (req, res) {
  res.render('check-your-answers', {
    scenario: req.session.scenario,
    appealReasons: req.session.appealReasons,
    email: req.session.email,
    penaltyReference: req.session.penaltyReference,
    companyNumber: req.session.companyNumber
  })
})

// Confirmation
router.get('/confirmation', function (req, res) {
  res.render('confirmation')
})

module.exports = router
