// pages/bookings/form.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    // tripId:  137,
    formData: {}
    // tripId:  74, // testing only

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

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
    const page = this
    if (app.globalData.header) {
      // proceed to fetch api
      this.getData()
    } else {
      // wait until loginFinished, then fetch API
      wx.event.on('loginFinished', this, this.getData)
    }
  },

  getData() {
    let page = this
    let options = page.options
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

  // formSubmit: function (e) {
  //   console.loh('form is submitted: ', e.detail.value);
  //   let { attendee } = e.detail.value
  //   this.setData({
  //     attendee
  //   })
  // },
  radioChange(e) {
    console.log('radio change ', e)
    const questions = this.data.questions
    // question = 
    // questions.forEach((question) => {
    // })
    for (let i = 0, len = questions.length; i < len; ++i) {
      questions[i].checked = questions[i].answer === e.detail.value
    }
    console.log(answers)
    this.setData({answers})
  },
 
  formSubmit (e) {
    const page = this
    // let formData = this.data.questions
    // let answer = this.data.formData
    // console.log(page.data.answer)
    // this.setData({questions})
    // const finalSurvey = page.data.finalSurvey.filter(question => question)
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${page.data.tripId}/answer`,
      method: "POST",
      data: {
        "answer": answer

      },
      success(res) {
        console.log("From survey.js - submitSurveyCustom: res",res)
        wx.switchTab({
          url: '/pages/users/profile',
        })
        // if (res.statusCode === 201) {
        // }
      }
    })
  },

  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
})