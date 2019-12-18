module.exports = function (router) {
  router.get('/rejected-accounts/rejected-accounts-information', function (req, res) {
    res.render('rejected-accounts/rejected-accounts-information', {
      scenario: req.session.scenario
    })
  })
  router.post('/rejected-accounts/rejected-accounts-information', function (req, res) {
    var rejectedAccounts = req.body.rejectedAccounts
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (rejectedAccounts === '') {
      Err.type = 'blank'
      Err.text = 'You must tell us more information'
      Err.href = '#rejected-accounts'
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
      if (req.body.editId !== '') {
        req.session.appealReasons[editId].rejectedAccounts = rejectedAccounts
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.appealReasons.pop()
        reasonObject.rejectedAccounts = req.body.rejectedAccounts
        reasonObject.nextStep = 'evidence'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
