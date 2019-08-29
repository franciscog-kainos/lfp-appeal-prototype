const del = require('del')

module.exports = function (router) {
  router.get('/choose-reason', function (req, res) {
    var companyNumber = req.session.scenario.company.number
    var id = 0
    var reasonObject = {}
    var checkedIllness = false
    var checkedAuthCode = false
    var checkedDamage = false
    var checkedComputer = false
    var checkedAccounts = false
    var checkedCompany = false
    var checkedDisaster = false

    if (req.query.restart === 'yes') {
      req.session.appealReasons = []
      del('public/saved-sessions/' + companyNumber + '.json')
      res.render('choose-reason')
    } else if (req.query.id) {
      id = req.query.id
      console.log(req.session.appealReasons)
      reasonObject = req.session.appealReasons[id]
      switch (reasonObject.reason) {
        case 'illness':
          checkedIllness = true
          break
        case 'authCode':
          checkedAuthCode = true
          break
        case 'damage':
          checkedDamage = true
          break
        case 'computerProblem':
          checkedComputer = true
          break
        case 'accounts':
          checkedAccounts = true
          break
        case 'companyChanges':
          checkedCompany = true
          break
        case 'disaster':
          checkedDisaster = true
          break
      }
      res.render('choose-reason', {
        checkedIllness: checkedIllness,
        checkedAuthCode: checkedAuthCode,
        checkedDamage: checkedDamage,
        checkedComputer: checkedComputer,
        checkedAccounts: checkedAccounts,
        checkedCompany: checkedCompany,
        checkedDisaster: checkedDisaster,
        id: id
      })
    } else {
      res.render('choose-reason')
    }
  })
  router.post('/choose-reason', function (req, res) {
    var reasonObject = {}
    var appealReason = req.body.appealReason
    var otherReason = req.body.otherReason
    var editId = req.body.editId
    var errorFlag = false
    var appealReasonErr = {}
    var otherReasonErr = {}
    var errorList = []
    reasonObject.documents = []

    if (typeof appealReason === 'undefined') {
      appealReasonErr.type = 'blank'
      appealReasonErr.text = 'You must select a reason'
      appealReasonErr.href = '#choose-reason-1'
      appealReasonErr.flag = true
    }
    if (appealReason === 'other' && otherReason === '') {
      appealReasonErr.type = 'invalid'
      appealReasonErr.text = 'You must tell us the reason'
      appealReasonErr.href = '#other-reason'
      appealReasonErr.flag = true
    }
    if (appealReasonErr.flag) {
      errorList.push(appealReasonErr)
      errorFlag = true
    }
    if (otherReasonErr.flag) {
      errorList.push(otherReasonErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.appealReasons.push(reasonObject)
      res.render('choose-reason', {
        errorList: errorList,
        appealReasonErr: appealReasonErr,
        otherReasonErr: otherReasonErr,
        appealReason: appealReason,
        otherReason: otherReason
      })
    } else {
      reasonObject.reason = req.body.appealReason
      reasonObject.complete = false
      switch (req.body.appealReason) {
        case 'illness':
          if (editId !== '') {
            req.session.appealReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = 'illness/who-was-ill'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/illness/who-was-ill')
          break
        case 'authCode':
          if (editId !== '') {
            req.session.appealReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/auth-code/address'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/auth-code/address')
          break
        case 'damage':
          if (editId !== '') {
            req.session.appealReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/theft-criminal-damage/damage-date'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/theft-criminal-damage/damage-date')
          break
        case 'disaster':
          if (editId !== '') {
            req.session.appealReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/natural-disaster/disaster-date'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/natural-disaster/disaster-date')
          break
        case 'accounts':
          if (editId !== '') {
            req.session.appealReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/accounts/accounts-date'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/accounts/accounts-date')
          break
        case 'companyChanges':
          if (editId !== '') {
            req.session.appealReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/company-changes/change-happened'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/company-changes/change-happened')
          break
        case 'computerProblem':
          if (editId !== '') {
            req.session.appealReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/computer-problem/choose-computer-problem'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/computer-problem/choose-computer-problem')
          break
        case 'death':
          if (editId !== '') {
            req.session.appealReasons[editId].reason = reasonObject.reason
          } else {
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/death/reason-death')
          break
        case 'other':
          reasonObject.otherReason = req.body.otherReason
          reasonObject.nextStep = 'other/reason-other'
          req.session.appealReasons.push(reasonObject)
          res.redirect('other/reason-other')
          break
      }
    }
  })
  router.get('/add-appeal-reason', function (req, res) {
    res.render('add-appeal-reason')
  })
  router.post('/add-appeal-reason', function (req, res) {
    var addAppealReason = req.body.addAppealReason
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (typeof addAppealReason === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if there is another reason for your appeal'
      Err.href = '#add-appeal-reason-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('add-appeal-reason', {
        errorList: errorList,
        Err: Err
      })
    } else {
      switch (req.body.addAppealReason) {
        case 'yes':
          res.redirect('/choose-reason')
          break
        case 'no':
          res.redirect('/check-your-answers')
          break
      }
    }
  })

  router.get('/evidence', function (req, res) {
    res.render('evidence')
  })
  router.post('/evidence', function (req, res) {
    var supportingEvidence = req.body.supportingEvidence
    var errorFlag = false
    var Err = {}
    var errorList = []
    var reasonObject = {}

    if (typeof supportingEvidence === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you want to upload evidence'
      Err.href = '#supporting-evidence-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('evidence', {
        errorList: errorList,
        Err: Err
      })
    } else {
      reasonObject = req.session.appealReasons.pop()
      reasonObject.supportingEvidence = req.body.supportingEvidence
      req.session.appealReasons.push(reasonObject)
      switch (req.body.supportingEvidence) {
        case 'yes':
          reasonObject.nextStep = 'evidence-upload'
          res.redirect('/evidence-upload')
          break
        case 'no':
          if (req.session.appealReasons.length > 1) {
            reasonObject.nextStep = 'check-your-answers'
            res.redirect('/check-your-answers')
          } else {
            reasonObject.nextStep = 'add-appeal-reason'
            res.redirect('/add-appeal-reason')
          }
          break
      }
    }
  })
  router.get('/evidence-upload', function (req, res) {
    var reasonObject = {}
    var id = req.query.id
    var continueLink = ''

    console.log(id)

    if (req.query.id) {
      reasonObject = req.session.appealReasons[id]
      continueLink = 'check-your-answers'
    } else {
      reasonObject = req.session.appealReasons.pop()
      req.session.appealReasons.push(reasonObject)
      if (req.session.appealReasons.length > 1) {
        continueLink = 'check-your-answers'
      } else {
        continueLink = 'add-appeal-reason'
      }
    }

    res.render('evidence-upload', {
      reasonObject: reasonObject,
      id: id,
      continueLink: continueLink
    })
  })
  router.post('/evidence-upload', function (req, res) {
    var reasonObject = {}
    var doc = req.body.fileUpload
    var id = req.body.id
    var fileName = []
    var errorFlag = false
    var Err = {}
    var errorList = []
    var continueLink = ''

    console.log(id)

    fileName = doc.split('.').pop()

    if (fileName === 'txt') {
      Err.type = 'unsupported'
      Err.text = 'We don\'t support files with an appeal of \'.' + fileName + '\''
      Err.href = '#file-upload'
      Err.flag = true
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      if (req.body.id) {
        reasonObject = req.session.appealReasons[id]
        continueLink = 'check-your-answers'
      } else {
        reasonObject = req.session.appealReasons.pop()
        req.session.appealReasons.push(reasonObject)
        if (req.session.appealReasons.length > 1) {
          continueLink = 'check-your-answers'
        } else {
          continueLink = 'add-appeal-reason'
        }
      }
      res.render('evidence-upload', {
        errorList: errorList,
        Err: Err,
        doc: doc.split('\\'),
        reasonObject: reasonObject,
        id: id,
        continueLink: continueLink
      })
    } else {
      if (req.body.id) {
        reasonObject.nextStep = 'check-your-answers'
        req.session.appealReasons[id].documents.push(doc)
        res.redirect('/evidence-upload?id=' + id)
      } else {
        reasonObject.nextStep = 'evidence-upload'
        reasonObject = req.session.appealReasons.pop()
        reasonObject.documents.push(doc)
        req.session.appealReasons.push(reasonObject)
        res.redirect('/evidence-upload')
      }
    }
  })
  router.get('/remove-document', function (req, res) {
    var documentID = req.query.documentID
    var reasonID = req.query.reasonID
    var reasonObject = {}

    if (reasonID === '') {
      reasonObject = req.session.appealReasons.pop()
      req.session.appealReasons.push(reasonObject)
    } else {
      reasonObject = req.session.appealReasons[reasonID]
    }

    res.render('remove-document', {
      documentID: documentID,
      reasonID: reasonID,
      fileName: reasonObject.documents[documentID]
    })
  })
  router.post('/remove-document', function (req, res) {
    var documentID = req.body.documentID
    var reasonID = req.body.reasonID
    var reasonObject = {}
    var removeDocument = req.body.removeDocument
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (reasonID === '') {
      reasonObject = req.session.appealReasons.pop()
    } else {
      reasonObject = req.session.appealReasons[reasonID]
    }

    if (typeof removeDocument === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you want to remove the document'
      Err.href = '#remove-document-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      if (reasonID === '') {
        req.session.appealReasons.push(reasonObject)
      }
      res.render('remove-document', {
        errorList: errorList,
        Err: Err,
        documentID: documentID,
        reasonID: reasonID,
        fileName: reasonObject.documents[documentID]
      })
    } else {
      switch (removeDocument) {
        case 'yes':
          if (reasonID === '') {
            reasonObject.documents.splice(documentID, 1)
            req.session.appealReasons.push(reasonObject)
          } else {
            reasonObject.documents.splice(documentID, 1)
            req.session.appealReasons[reasonID] = reasonObject
          }
          break
        case 'no':
          if (reasonID === '') {
            req.session.appealReasons.push(reasonObject)
          }
          break
      }
      if (reasonID === '') {
        res.redirect('/evidence-upload')
      } else {
        res.redirect('/evidence-upload?id=' + reasonID)
      }
    }
  })
  router.get('/accountsnotdue', function (req, res) {
    res.render('accountsnotdue', {
      scenario: req.session.scenario
    })
  })
  router.post('/accountsnotdue', function (req, res) {
    res.redirect('accountsnotdue')
  })
  router.get('/accountsnotneeded', function (req, res) {
    res.render('accountsnotneeded', {
      scenario: req.session.scenario
    })
  })
  router.post('/accountsnotneeded', function (req, res) {
    res.redirect('accountsnotneeded')
  })
  router.get('/account-reference-date', function (req, res) {
    res.render('account-reference-date', {
      scenario: req.session.scenario
    })
  })
  router.post('/account-reference-date', function (req, res) {
    res.redirect('/choose-reason')
  })
  router.get('/ptf/ptf', function (req, res) {
    res.render('ptf/ptf', {
      scenario: req.session.scenario
    })
  })
  router.post('/ptf/ptf', function (req, res) {
    var ptfConfirm = req.body.ptfConfirm
    var errorFlag = false
    var Err = {}
    var errorList = []
    if (ptfConfirm === '_unchecked') {
      Err.type = 'blank'
      Err.text = 'You must declare the company is still active and will file its accounts before continuing'
      Err.href = '#ptfConfirm'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('ptf/ptf', {
        errorList: errorList,
        Err: Err
      })
    } else {
      res.redirect('/ptf/ptfconfirm')
    }
  })
  router.get('/ptf/ptfconfirm', function (req, res) {
    res.render('ptf/ptfconfirm', {
      scenario: req.session.scenario
    })
  })
  router.post('/ptf/ptfconfirm', function (req, res) {
    res.redirect('ptfconfirm')
  })
  router.get('/filing-deadline', function (req, res) {
    res.render('filing-deadline')
  })
  router.post('/filing-deadline', function (req, res) {
    req.session.appealApply = req.body.appealApply

    switch (req.session.appealApply) {
      case 'yes':
        res.redirect('choose-reason')
        break
      case 'no':
        res.redirect('start')
        break
    }
  })
  router.get('/remove-reason', function (req, res) {
    var id = req.query.id
    var reasonObject = {}
    reasonObject = req.session.appealReasons[id]
    res.render('remove-reason', {
      scenario: req.session.scenario,
      appealReasons: req.session.appealReasons,
      reason: reasonObject,
      id: id
    })
  })
  router.post('/remove-reason', function (req, res) {
    var id = req.body.id
    var reasonObject = {}
    var removeReason = req.body.removeReason
    var errorFlag = false
    var Err = {}
    var errorList = []

    reasonObject = req.session.appealReasons[id]

    if (typeof removeReason === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you want to remove this reason'
      Err.href = '#remove-reason-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('remove-reason', {
        errorList: errorList,
        Err: Err,
        reason: reasonObject,
        appealReasons: req.session.appealReasons
      })
    } else {
      switch (removeReason) {
        case 'yes':
          req.session.appealReasons.splice(id, 1)
          if (req.session.appealReasons.length === 0) {
            res.redirect('/choose-reason')
          } else {
            res.redirect('/check-your-answers')
          }
          break
        case 'no':
          res.redirect('/check-your-answers')
          break
      }
    }
  })
}
