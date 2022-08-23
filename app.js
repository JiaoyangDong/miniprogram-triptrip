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
            console.log('tags', loginRes.data.tags)
            app.globalData.showTags = loginRes.data.tags
            loginRes.data.tags.forEach((tag) => {
              app.globalData.tags.push(tag)
            })
            // console.log("Hello from app.js: app.globalData",app.globalData)
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
      }],
    // tagList: ["oneday", "weekend", "petfriendly", "hiking", "relaxing", "family", "adventure", "biking"],
    // baseURL: "http://localhost:3000/api/v1",
    baseURL: "https://triptrip.wogengapp.cn/api/v1"
  }
})
