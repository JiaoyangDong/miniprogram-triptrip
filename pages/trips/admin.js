import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

//  testing only 
// data = [{name: 'A1', value: 3}, {name: 'A2', value: 5}]
function setOption(chart, title, data) {
  console.log("calling setOptions")
  let name = data.map(item => item.name)
  let value = data.map(item => item.value)
  console.log("name", name)
  console.log("value", value)
  let backgroundColor = '#eee'
  let options =  {
    // For pie chart
    // backgroundColor: "#eee",
    // series: [{
    //   label: {
    //     normal: {
    //       fontSize: 14
    //     }
    //   },
    //   type: 'pie',
    //   center: ['50%', '50%'],
    //   radius: ['10%', '40%'],
    //   data: data
    // }]
  // for bar chat
    backgroundColor: backgroundColor,
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    title: {
      text: title
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: backgroundColor,
            width: 0 
          }
        },
        axisLabel: {
          color: backgroundColor
        },
        showGriid: false,
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: name,
        axisLine: {
          lineStyle: {
            color: backgroundColor
          }
        },
        axisLabel: {
          color: '#666'
        },
        nameTextStyle: {
          overflow: 'break'
        },
        nameRotate: 45,
        splitNumber: 1,
        minInterval: 1,
        showGriid: false,
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: name,
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: value
      }
    ]
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
            console.log("number of answers:" ,questions[0].clean_answers.length)
            if (questions[0].clean_answers.length === 0) {
              console.log("no answer yet")
            } else {
              console.log("has answers")
              // let ecComponent = page.selectComponent('#mychart-dom-bar');
              // console.log("ecComponent",ecComponent)
              // page.init(ecComponent, questions[0].clean_answers)
              questions.forEach((question, index) =>{
                let ecComponent1 = page.selectComponent(`#mychart-dom-bar-${index}`);
                page.init(ecComponent1, question.content, question.clean_answers)
              })
            }
            // for loop
            // page.data.questions.forEach((q,index)=> {
            //   let ecComponent = page.selectComponent(`#mychart-dom-bar-${index}`);
            //   console.log(ecComponent)
            //   console.log(q.clean_answers)
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
  init: function (ecComponent, title, data) {
    console.log("calling page.init")
    ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setOption(chart, title, data);
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
  togglePublic(e){
    let page = this
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${page.data.trip.id}/toggle_public`,
      method: "POST",
      success(res) {
        console.log("From admin.js - togglePublic: res", res)
        if (res.statusCode === 200) {
          // const public = res.data.status === 'public';
          const trip = res.data.trip;
          page.setData({
            trip,
          });
          wx.showToast({
            title: `Set as ${res.data.status}`,
            duration: 1000
          })  
        } else {
          console.log(res.data.errors.join(" & "))
          wx.showModal({
            title: 'Note!',
            content: res.data.errors.join(" & "), 
            confirmText: 'OK',
            showCancel: false
          })
        }
      }
    })
  }
})
