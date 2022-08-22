// pages/trips/landing.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    loadingHidden: false,
    tag: '',
    trips: [
      {
        title: "Yoga retreat",
        description: "Come to the shelter and meet your new best friend. Snacks and drinks provided!",
        date: "August 2nd",
        time: "15:00",
        location: "Bali",
        image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
      },
      {
        title: "End-of-Summer Party",
        description: "Come along with your fur baby! Good food and great company all in support of HiPaw. If you don't have a pet, there will be some there for you to meet too!",
        date: "August 28th",
        time: "14:00",
        location: "Bali",
        image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
      }
    ],
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
    if (app.globalData.header) {
      // proceed to fetch api
      this.getNewData()
    } else {
      // wait until loginFinished, then fetch API
      wx.event.on('loginFinished', this, this.getNewData)
    }
    page.setData({
      // loadingHidden: true
      tags: app.globalData.tags
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