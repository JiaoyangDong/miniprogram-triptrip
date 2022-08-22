// pages/trips/survey.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    resetForm: true,
    questions: {
      "room": {name: "Room type", active: false},
      "food": {name: "Food preference", active: false},
      "pickup": {name: "Do you need pickup?", active: false}
    },
    yes:'/images/minus-2.png',
    no:'/images/addsurvey.png'
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