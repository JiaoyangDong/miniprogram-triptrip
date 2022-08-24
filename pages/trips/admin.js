import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

//  testing only 
// data = [{name: 'A1', value: 3}, {name: 'A2', value: 5}]
function setOption(chart, data) {
  console.log("from setOptions")
  let options =  {
    backgroundColor: "#ffffff",
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['10%', '40%'],
      data: data
    }]
  } 
  chart.setOption(options);
}

// pages/trips/admin.js
Page({

  /**
   * Page initial data
   */
  data: {
    ec: {
      lazyLoad: true
    },
    ecAll: {
      ec1: {
        lazyLoad: true
      },
      ec2: {
        lazyLoad: true
      },
      ec3: {
        lazyLoad: true
      }
    }
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
    if (app.globalData.header) {
      // proceed to fetch api
      this.getData()
    } else {
      // wait until loginFinished, then fetch API
      wx.event.on('loginFinished', this, this.getData)
    }
  },
  getData() {
    let page = this
    let tripId = page.options.tripId
    // console.log('page options ->', page.options)
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${tripId}/stats`,
      success(res) {
        console.log("From admin.js: res", res)
        if (res.statusCode === 200) {
          const questions = res.data.questions;
          const attendees = res.data.attendees;
          const trip = res.data.trip;
          page.setData({
            questions,
            attendees,
            trip,
            hasSurvey: res.data.has_survey
          });
          // page.setEC(questions[0].clean_answers)
          if (res.data.has_survey){
            let ecComponent = page.selectComponent('#mychart-dom-bar');
            page.init(ecComponent, questions[0].clean_answers)
            // console.log()
            // for loop
            // page.data.questions.forEach((q,index)=> {
            //   let ecComponent = page.selectComponent(`#mychart-dom-bar-${index}`);
            //   page.init(ecComponent, q.clean_answers)
            // })
          }
        } else {
          console.log("request fails: res ",res)
          console.log("From admin.js: status code is", res.statusCode)
        }
      }
    })
  },


  goToShow(e) {
    const tripId = e.currentTarget.dataset.id
    // console.log(e.currentTarget)
    wx.navigateTo({
      url: `/pages/trips/show?id=${tripId}`,
    })
  },

  goToEdit(e) {
    const tripId = e.currentTarget.dataset.id
    wx.setStorageSync('tripId', tripId)
    wx.navigateTo({
      header: app.globalData.header,
      url: `/pages/trips/form`,
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
  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
  goToSurvey() {
    const tripId = this.data.trip.id
    wx.navigateTo({
      url: `survey?id=${tripId}`,
    })
  },
  init: function (ecComponent, data) {
    console.log("from page.init")

    ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setOption(chart, data);
      // barChart.setOption(getRadioOptions(ecData))

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      this.setData({
        // isLoaded: true,
        // isDisposed: false
      });
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
})
