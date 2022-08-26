// pages/trips/landing.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    tags: app.globalData.tags,
    loadingHidden: false,
    tag: '',
    trips: [],
    selectedTagIndex: '',
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
    // const tags = app.globalData.tags
    // tags[0]['activeindex'] = true
    // this.setData({tags})
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()){
      this.getTabBar().setData({
        selectedTabIndex: 0
      })
    }
    if (app.globalData.header) {
      // proceed to fetch api
      const tags = app.globalData.tags
      this.setData({tags})
      this.getNewData()

    } else {
      // wait until loginFinished, then fetch API
      wx.event.on('loginFinished', this, this.pleaseShowTags)
    }
  },

  pleaseShowTags(){
    const tags = app.globalData.tags
    this.setData({tags})
    this.getNewData()
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

  onReachBottom() {

  },
  onShareAppMessage() {

  },
  selectTag(e) {
    if (this.data.tag !== e.currentTarget.dataset.tag) {
      this.setData({
        tag: e.currentTarget.dataset.tag
      })
      this.getNewData()
    }
  },

  getNewData() {
    const page = this
    const searchTag = page.data.tag
    // if (searchTag === '') {
      wx.request({
        url: `${app.globalData.baseURL}/trips`,
        method: "GET",
        header: app.globalData.header,
        data: { tag: `${searchTag}` },
        success(res) {
          let trips = res.data
          trips.map((trip) => {
            trip.start_date = wx.se.prettyDate(trip.start_date)
          })
          page.setData({
            trips,
            loadingHidden: true,
          })
        }
      })
  },
  goToTrip(e) {
    const tripId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/trips/show?id=${tripId}`,
    })
  }
})