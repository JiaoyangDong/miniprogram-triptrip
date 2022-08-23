// app.js
import event from './utils/event';
wx.event = event;

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    const app = this
    wx.login({
      success: res => {
        console.log("Hello from app.js: res",res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: `${app.globalData.baseURL}/login`,
          method: 'post',
          data: { code: res.code }, // pass code in request body
          success(loginRes) {
            console.log("Hello from app.js: loginRes",loginRes) 
            app.globalData.user = loginRes.data.user // save in globalData, so we can use them throughout the MP
            app.globalData.header = loginRes.data.headers
            console.log("Hello from app.js: app.globalData",app.globalData)
            event.emit('loginFinished')
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null, 
    header: null, 
    user: null,
    tags: [
      {
        index: 0,
        name: "",
        show: "All",
        icon: "/images/tags/all.png",
        style: "height:70rpx;width:70rpx;margin-top: 11rpx;"
      },
      {
        index: 1,
        name: "oneday",
        show: "Day trips",
        icon: "/images/tags/oneday.png",
        style: ""
      },
      {
        index: 2,
        name: "weekend",
        show: "Weekend",
        icon: "/images/tags/weekend.png",
        style: ""
      },
      {
        index: 3,
        name: "petfriendly",
        show: "Pet-friendly",
        icon: "/images/tags/petfriendly.png",
        style: ""
      },
      {
        index: 4,
        name: "hiking",
        show: "Hiking",
        icon: "/images/tags/hiking.png",
        style: "height:70rpx;width:70rpx;margin-top: 11rpx;"
      },
      {
        index: 5,
        name: "relaxing",
        show: "Relaxing",
        icon: "/images/tags/relaxing.png",
        style: "height:65rpx;width:65rpx;margin-top:17rpx;"
      },
      {
        index: 6,
        name: "family",
        show: "Family",
        icon: "/images/tags/family.png",
        style: "height:70rpx;width:70rpx;margin-top: 11rpx;"
      },
      {
        index: 7,
        name: "adventure",
        show: "Adventure",
        icon: "/images/tags/adventure.png",
        style: "height:70rpx;width:70rpx;margin-top: 11rpx;"
      },
      {
        index: 8,
        name: "biking",
        show: "Biking",
        icon: "/images/tags/biking.png",
        style: "height:70rpx;width:70rpx;margin-top: 11rpx;"
      }
    ],
    // tagList: ["oneday", "weekend", "petfriendly", "hiking", "relaxing", "family", "adventure", "biking"],
    // baseURL: "http://localhost:3000/api/v1"
    baseURL: "https://triptrip.wogengapp.cn/api/v1"
  }
})
