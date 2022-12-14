// pages/users/mytrips.js
let app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    loadingHidden: false,
    active_tab: "upcoming",
    indicatorDots: false,
    activeIndex: 0,
  },

  // changeIndicatorDots() {
  //   this.setData({
  //     indicatorDots: !this.data.indicatorDots
  //   })
  // }
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
        selectedTabIndex: 1
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
      url: `${app.globalData.baseURL}/attendees/${user_id}`,
      method: "GET",
      header: app.globalData.header,
      success(res) {
        console.log("From mytrips.js: onshow request succesfully")
        console.log("From mytrips.js: res",res)
        if (res.statusCode === 200) {
          let past_trips = res.data.past
          past_trips.map((trip) => {
            trip.start_date = wx.se.prettyDate(trip.start_date)
          })
          let upcoming_trips = res.data.upcoming
          upcoming_trips.map((trip) => {
            trip.start_date = wx.se.prettyDate(trip.start_date)
          })
          page.setData({
            past_trips,
            loadingHidden: true,
            upcoming_trips,
            bookmarked_trips: res.data.bookmarks
            // pets: res.data.pets,
            // booked_pets: res.data.booked_pets,
            // user_id: user_id
          })
        } else {
          console.log("From mytrips.js: status code is", res.statusCode)
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
  goToTrip(e) {
    console.log('From mytrips.js - goToTrip: e', e)
    const id = e.currentTarget.dataset.id
    console.log('From mytrips.js - goToTrip: tripid: ",id')
    wx.navigateTo({
        url: `/pages/trips/show?id=${e.currentTarget.dataset.id}`,
      })
  },
  switchCard(e) {
    let current = e.detail.current;
    this.setData({ activeIndex: current });
  }
})