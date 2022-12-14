// pages/bookings/form.js
const app = getApp()

Page({
  data: {
    finalAnswer: [],
    answerSample: {
      "booking_id": 15,
      "questions":
        [{
            "id": 10,
            "answer": "Private Room"
          },
          {
            "id": 11,
            "answer": "Vegetarian"
          },
          {
            "id": 12,
            "answer": "Yes"
          }]
    },
    disabled: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    console.log("options-> ", options)
    this.setData({
      tripId: options.tripId,
      name: options.tripTitle
    })

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    this.getData()
  },

  getData() {
    let page = this
    let options = page.options
    console.log({options})
    const bookingId = page.options.bookingId
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${options.tripId}/survey`,
      success(res) {
        console.log("From booking/form.js - getSurveyCustom: res",res)
        if (res.statusCode === 200) {
          // const booking_id = options.booking_id
          const questions = res.data
          page.setData({
            questions,
            bookingId
          })
          // console.log(questions[0].options[0])
        }
      }
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },

  radioChange(e) {
    // console.log('radio change: ', e)
    const answer = e.detail.value
    const id = e.target.dataset.id
    let { finalAnswer } = this.data
    // console.log('answer: ', answer)
    // console.log('id: ', id)

    const oldAnswer = finalAnswer.find((answer) => answer.id === id)

    if (oldAnswer) {
      oldAnswer.answer = answer
    } else {
      let tempAnswer = { id: id, answer: answer }
      finalAnswer = [...finalAnswer, tempAnswer]
    }
    this.setData({finalAnswer})
  },
 
  formSubmit(e) {
    console.log('from formSubmit --->',e)
    const page = this
    page.setData({disabled: true})
    console.log('header:', app.globalData.header)
    let answer = this.data.finalAnswer
    let bookingId = this.data.bookingId
    console.log("answer:", answer)
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${page.data.tripId}/answer`,
      method: "POST",
      data: {
        booking_id : bookingId,
        questions: answer
      },
      success(res) {
        console.log("From survey.js - submitSurveyCustom: res",res)
        if (res.statusCode === 201) {
          wx.showToast({
            title: 'Success!',
            duration: 1000,
            success(resolve) {
             setTimeout(() => {
              wx.navigateTo({
                url: `/pages/trips/show?id=${page.data.tripId}`,
              })
              }, 1000)
            }
          })
       } else if (res.statusCode === 404)  {
           wx.showModal({
             title: "Survey cannot be empty!",
             showCancel: false,
             confirmText: 'OK'
           })
       }
      }
    })
  },
  goBack() {
    let page = this
    let options = page.options
    const TripId = options.tripId
    wx.navigateTo({
      url: `/pages/trips/show?id=${TripId}`,
    })
  }
})