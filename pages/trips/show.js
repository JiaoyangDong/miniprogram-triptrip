// pages/trips/show.js
const app = getApp()
Page({
  data: {
    booking: {},
    id: options.id
  },
  onLoad(options) {


  },
  onReady() {

  },
  onShow() {
    let page = this
    console.log('From show.js - onshow: options ', this.options)
    let id = this.data.id
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${id}`,
      success(res) {
        console.log("From show.js - onshow: res",res)
        if (res.statusCode === 200) {
          console.log("From show.js - onshow: booking", res.data.my_booking);
          console.log("From show.js - onshow: trip's user_id", res.data.trip.user_id)
          const trip = res.data.trip;
          const booking = res.data.my_booking;
          page.setData({
            trip: trip,
            isCreater: app.globalData.user.id === trip.user_id,
            isBooker: booking, 
            booking: booking,
          });
          console.log("From show.js: status code is", res.statusCode)
        }
      }
    })
  },
  submitBooking(e){
    console.log("From show.js - submitBooking: e", e)
    let page = this
    wx.request({
      url: `${app.globalData.baseURL}/trips/${this.data.trip.id}/bookings`,
      header: app.globalData.header,
      method: "POST",
      data: {
        // date_and_time: dateAndTime
      },
      success(res){
        console.log("From show.js - submit booking: res",res)
        if (res.statusCode === 201) {
          console.log("From show.js - booking submit successfully!")
          console.log("From show.js : res.data", res.data)
          const booking = res.data.booking;
          console.log(page)
          wx.redirectTo({
            url: `/pages/users/profile?id=${page.options.id}`,
          })
        } else {
          console.log("From show.js: status code is", res.statusCode)
          console.log("From show.js: error message", res.data.errors)
          // const bookingId = res.data.booking.id
          wx.showModal({
            title: 'Error!',
            content: res.data.errors.join(', '),
            cancelText: "OK",
            confirmText: 'Details',
            success(res) {
              console.log(res)
              if (res.confirm) {
                wx.redirectTo({
                  url: `../booking/show?id=${bookingId}`,
                })
              }
            }
          })
        }
      }
    })
  },
  onHide() {

  },
  onUnload() {

  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  onShareAppMessage() {

  }, 
  book(e) {
    console.log("book ", e)
    wx.switchTab({
      header: app.globalData.header,
      url: 'pages/users/form',
    })
  },
  edit(e) {
    wx.setStorageSync('editedId', this.data.trip.id)
    console.log(this.data.trip)
    wx.switchTab({
      header: app.globalData.header,
      url: 'pages/trips/form',
    })
  },
  delete(e) {
    let id = this.data.pet.id
    wx.showModal({
      title: 'Are you sure?',
      content: 'Are you sure to delete this trip?',
      success(res) {
        if (res.confirm) {
          wx.request({
            header: app.globalData.header,
            url: `${app.globalData.baseURL}/trips/${id}`,
            method: 'DELETE',
            success(res){
              wx.switchTab({
                url: '/pages/trips/landing',
              })
            }
          })
        } else {
        }
      }
    })
  },
})