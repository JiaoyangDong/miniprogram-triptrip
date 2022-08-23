// pages/trips/landing.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    // tags: app.globalData.tags,
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
    const page = this
    const tags = app.globalData.tags
    tags[0]['activeindex'] = true
    this.setData({tags})
    if (app.globalData.header) {
      // proceed to fetch api
      this.getNewData()

    } else {
      // wait until loginFinished, then fetch API
      wx.event.on('loginFinished', this, this.getNewData)
    }
    // page.setData({
    //   // loadingHidden: true
    //   tags: app.globalData.tags
    // })
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
  selectTag(e) {
    if (this.data.tag !== e.currentTarget.dataset.tag) {
      this.setData({
        tag: e.currentTarget.dataset.tag
      })
      this.getNewData()
    }
    //   console.log(e.currentTarget)
    //   this.setData({
    //     tag: e.currentTarget.dataset.tag
    //   })
    // }
    // this.getNewData()
  },

  getNewData() {
    const page = this
    const searchTag = page.data.tag
    if (searchTag === '') {
      wx.request({
        url: `${app.globalData.baseURL}/trips`,
        method: "GET",
        header: app.globalData.header,
        success(res) {
          page.setData({
            trips: res.data,  
            loadingHidden: true
          })
        }
      })
    } else {
      wx.request({
        url: `${app.globalData.baseURL}/tags/${searchTag}`,
        method: "get",
        header: app.globalData.header,
        success(res) {
          // console.log('res from getting trips with tags: ', res)
          const trips = res.data
          // let filteredTrips = res.data.where({tag: ${selectedTagIndex}})
          page.setData({
            trips: res.data,
            loadingHidden: true
          })
        }
      })
    }
  },
  // getData(){
  //   const page = this
  //   wx.request({
  //     url: `${app.globalData.baseURL}/trips`,
  //     method: "GET",
  //     header: app.globalData.header,
  //     success(res) {
  //       page.setData({
  //         trips: res.data,
  //         // loadingHidden: true,

  //       })
  //     }
  //   })
  // },
  goToTrip(e) {
    const tripId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/trips/show?id=${tripId}`,
    })
  }
})