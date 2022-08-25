// pages/users/profile.js
let app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    loadingHidden: false,
    active_tab: "upcoming"
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
          let upcoming_trips = res.data.upcoming
          upcoming_trips.map((trip) => {
            trip.start_date = wx.se.prettyDate(trip.start_date)
          })
        if (res.statusCode === 200) {
          let past_trips = res.data.past
          past_trips.map((trip) => {
            trip.start_date = wx.se.prettyDate(trip.start_date)
          })
          page.setData({
            loadingHidden: true,
            past_trips,
            upcoming_trips
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
  },
  goToNewTrip() {
    wx.navigateTo({
      url: '/pages/trips/form',
    })
  },
  goToAdmin(e) {
    const tripId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/trips/admin?tripId=${tripId}`,
    })
  }
})