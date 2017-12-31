const Account = require('../models/account')
// services for week

const utlIntv = require('../util/interval')
const Week = require('../models/week')
const pix = require('../util/pixels')

const durations = [ {selected : "no", value : 45, },
                    {selected : "yes",value : 60, },
                    {selected : "no", value : 75, },
                    {selected : "no", value : 90, },
                    {selected : "no", value : 105,},
                    {selected : "no", value : 120 }
                  ]

// reads coaches from the DB
const getCoaches = function () {

}

// prepare week for rendering
// finally calls _done(data) or _err(err)

const getWeekEditor = function (week, _done, _err) {

  const weekEnr = utlIntv.enrichWeek(week)
  const freeBlocks = utlIntv.calculateFreeBlocks(weekEnr)
  const freeBlocksWeek = utlIntv.calculateFreeBlocksForWeek(weekEnr)
  const ruler = pix.calculateRuler(weekEnr)
  const coachesPromise = Account.findCoaches().exec()
  const url = "/tyden/" + week._id + "/editor"

  coachesPromise.then(function(accounts) {
    const coaches = accounts.map(a => {
      return {
        id : a.username,
        name : (a.fullname) ? a.fullname : a.username,
        selected : "no"
      }
    })
    coaches.push({ id : "", name : "", selected : "yes"})
    _done({ weekEnr: weekEnr,
           name : week.id,
           ruler : ruler,
           tableWidth : 1000,
           editor : {
             freeBlocks : freeBlocks,
             freeBlocksWeek : freeBlocksWeek,
             durations : durations,
             coaches : coaches,
             url : url
           }
         }
    )
  }).catch(function(err) {
    _err(err)
  })
}
module.exports.getWeekEditor = getWeekEditor
