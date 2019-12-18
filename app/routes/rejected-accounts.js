module.exports = function (router) {
  router.get('/rejected-accounts/rejected-accounts-information', function (req, res) {
    res.render('rejected-accounts/rejected-accounts-information', {
      scenario: req.session.scenario
    })
  })
  router.post('/rejected-accounts/rejected-accounts-information', function (req, res) {
    var authCodeRequested = req.body.authCodeRequested
    var authCodeRequestedFlag = true
    var authCodeFlag = true
    var errorFlag = false
    var Err = {}
    var errorList = []
    var reasonObject = {}
    var id = req.body.id

    if (typeof authCodeRequested === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you\'ve requested a new code'
      Err.href = '#auth-code-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('rejected-accounts', {
        scenario: req.session.scenario,
        errorList: errorList,
        Err: Err
      })
    } else {
      res.render('auth-code/change-address')
      reasonObject = req.session.appealReasons.pop()
      req.session.appealReasons.push(reasonObject)
      reasonObject.nextStep = '/auth-code/address'
    }
  })
}
