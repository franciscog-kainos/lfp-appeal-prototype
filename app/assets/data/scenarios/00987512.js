module.exports = {
  company: {
    name: 'KEYSTONE CONSTRUCTION LIMITED',
    number: '00987512',
    authCode: 'KCL00987512'
  },
  penalties: [
    {
      pen1: 'B00000001',
      pen2: 'B00000001',
      periodStart: '1 May 2014',
      periodEnd: '30 April 2015',
      due: '20 October 2019',
      filed: '25 October 2019',
      overdue: '14 days',
      band: 'Up to 1 month overdue',
      value: 150,
      fees: {
        solicitor: [
          {
            name: 'Solicitor fee',
            date: '23 April 2016',
            value: 50.00
          }
        ],
        court: [
          {
            name: 'Court fee',
            date: '23 April 2016',
            value: 25.00
          },
          {
            name: 'Hearing fee',
            date: '23 April 2016',
            value: 22.00
          }
        ]
      },
      totalFees: 0
    },
    {
      pen1: 'PEN1A/12345672',
      pen2: '',
      periodStart: '1 May 2015',
      periodEnd: '30 April 2016',
      due: '1 January 2017',
      filed: '15 January 2017',
      overdue: '14 days',
      band: 'Up to 1 month overdue',
      value: 300,
      fees: {},
      totalFees: 0
    }
  ]
}
