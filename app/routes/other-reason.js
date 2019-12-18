module.exports = function (router) {
  router.get('/other/other-reason-entry', function (req, res) {
    res.render('other/other-reason-entry', {
      scenario: req.session.scenario
    })
  })
  router.get('/other/reason-other', function (req, res) {
    var id = 0
    var otherReason = ''
    var otherInformation = ''
    if (req.query.id) {
      id = req.query.id
      otherReason = req.session.appealReasons[id].otherReason
      otherInformation = req.session.appealReasons[id].otherInformation
      res.render('other/reason-other', {
        id: id,
        otherReason: otherReason,
        otherInformation: otherInformation
      })
    } else {
      res.render('other/reason-other')
    }
  })
  router.post('/other/reason-other', function (req, res) {
    var otherInformation = req.body.otherInformation
    var otherReason = req.body.otherReason
    var editId = req.body.editId
    var errTitle = {}
    var errDescription = {}
    var errorList = []

    if (otherInformation === '') {
      errDescription.type = 'blank'
      errDescription.text = 'You must give us more information'
      errDescription.href = '#other-information'
      errDescription.flag = true
      errorList.push(errDescription)
    }

    if (otherReason === '') {
      errTitle.type = 'blank'
      errTitle.text = 'You must give your reason a title'
      errTitle.href = '#other-reason'
      errTitle.flag = true
      errorList.push(errTitle)
    }

    if (errorList.length > 0) {
      res.render('other/reason-other', {
        errorList: errorList,
        errTitle: errTitle,
        errDescription: errDescription,
        id: editId,
        otherReason: otherReason,
        otherInformation: otherInformation
      })
    } else {
      if (editId !== '') {
        req.session.appealReasons[editId].otherReason = req.body.otherReason
        req.session.appealReasons[editId].otherInformation = req.body.otherInformation
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.appealReasons.pop()
        reasonObject.otherReason = req.body.otherReason
        reasonObject.otherInformation = req.body.otherInformation
        req.session.appealReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
