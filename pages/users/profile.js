// pages/users/profile.js
let app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    active_tab: "upcoming",
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()){
      this.getTabBar().setData({
        selectedTabIndex: 2
      })
    }
    if (app.globalData.header) {
      // proceed to fetch api
      this.getData()
    } else {
      // wait until loginFinished, then fetch API
      wx.event.on('loginFinished', this, this.getData)
    }
  }, 
  getData(){
    const user_id = app.globalData.user.id
    const page = this
    wx.request({
      url: `${app.globalData.baseURL}/admins/${user_id}`,
      method: "GET",
      header: app.globalData.header,
      success(res) {
        console.log("From profile.js: onshow request succesfully")
        console.log("From profile.js: res",res)
        if (res.statusCode === 200) {
          page.setData({
            past_trips: res.data.past,
            upcoming_trips: res.data.upcoming
            // user_id: user_id
          })
        } else {
          console.log("From profile.js: status code is", res.statusCode)
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
  active_upcoming(){
    this.setData({
      active_tab: "upcoming"
    })
  },
  active_past(){
    this.setData({
      active_tab: "past"
    })
  }
})