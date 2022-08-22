// pages/bookings/form.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
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
  getSurveyCustom(){
    let page = this
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${page.data.tripId}/survey`,
      success(res) {
        console.log("From booking/form.js - getSurveyCustom: res",res)
        // if (res.statusCode === 200) {
        // }
      }
    })
  }
})