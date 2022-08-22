// pages/trips/survey.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    resetForm: true,
    // tripId: , // testing only
    questions: {
      "room": {name: "Room type", active: true},
      "food": {name: "Food preference", active: false},
      "pickup": {name: "Do you need pick up?", active: false}
    },
    // This is a data structure example to build while submitting to the back end.
    questionsToSubmit: [
      {
        "content": "What room type do you want to live in?",
        "question_type": "single-choice",
        "options": [
          "Private Room",
          "Shared Room",
          "no preference"
        ]
      },
      {
        "content": "Dietary requirements?",
        "question_type": "single-choice",
        "options": [
          "Vegetarian",
          "Vegan",
          "None"
        ]
      },
      {
        "content": "Do you need pick up?",
        "question_type": "single-choice",
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },

  resetForm() {
    this.setData({formData: {}})
  },

  selectQuestion(e) {
    console.log("toggle questions:", e)
    const page = this
    const currentTag = e.currentTarget.dataset.tag
    console.log("toggle questions ", currentTag)
    let questions = page.data.questions
    questions[currentTag].active = !questions[currentTag].active
    page.setData({questions})
    console.log(page.data)
  },
 

  submitSurvey: function (event) {
    var status = event.detail.value.status;

  },
  // this page is not a usual form. maybe it's better to use custom function rather than form-type="submit" functions. replace
  submitSurveyCustom(){
    let page = this
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${page.data.tripId}/survey`,
      method: "POST",
      data: {
        "trip_id": page.data.tripId,
        "questions": page.data.questionsToSubmit
      },
      success(res) {
        console.log("From survey.js - submitSurveyCustom: res",res)
        // if (res.statusCode === 201) {
        // }
      }
    })
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
    // TODO: 
    // need to page.setData tripId when first load
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

  goToForm(e) {
    console.log('From survey.js - goToFrom: e', e)
    wx.navigateTo({
        url: `/pages/trips/form`,
      })
  }
})