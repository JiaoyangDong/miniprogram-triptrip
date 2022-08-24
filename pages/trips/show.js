// pages/trips/show.js
const app = getApp()
Page({
  data: {
    booking: {},
    latitude: 0,
    longitude: 0,
    name: ""
  },
  onLoad(options) {
  },
  onReady() {
  },
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
    console.log('From show.js - onshow: options trip_id ', page.options)
    let id = page.options.id
    // console.log('From show.js - onshow: options ', page.options)
    // let id = this.data.id
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${id}`,
      success(res) {
        console.log("From show.js - onshow: res",res)
        if (res.statusCode === 200) {
          // console.log("From show.js - onshow: booking", res.data.my_booking);
          // console.log("From show.js - onshow: trip's user_id", res.data.trip.user_id)
          const trip = res.data.trip;
          const isBooker = res.data.is_booker;
          const isSaved = res.data.is_saved;
          // const booking = res.data.my_booking;
          page.setData({
            trip: trip,
            isBooker: isBooker, 
            isSaved: isSaved,
            bookmarkId: res.data.bookmark_id, 
            bookingId: res.data.booking_id, 
            hasSurvey: res.data.has_survey,
            longitude: parseFloat(trip.longitude),
            latitude: parseFloat(trip.latitude), 
            name: trip.location
          });
          console.log("From show.js: status code is", res.statusCode)
        }
      }
    })
  },

  submitBooking(e){
    console.log("From show.js - submitBooking: e", e)
    let page = this
    // get user profile and update user info in the backend
    wx.getUserProfile({
      desc: 'User Profile for submitting',
      lang: 'en',
      success: (res) => {
        page.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.request({
          url: `${app.globalData.baseURL}/users/${app.globalData.user.id}`,
          method: 'PUT',
          header: app.globalData.header,
          data: {name: res.userInfo.nickName, image: res.userInfo.avatarUrl},
          success(res) {
            console.log('user info update success?', res)
          }
        })
        console.log("getUserProfile complete res:",res)
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
              // console.log(page)
              page.setData({
                isBooker: true,
                bookingId: res.data.id
              })
              // wx.redirectTo({
              //   url: `/pages/users/profile?id=${page.options.id}`,
              // })
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
      fail(res){
        page.setData({
          userInfo: res.userInfo,
          hasUserInfo: false
        })
        console.log("getUserProfile fails")
      },
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
    console.log(this.options)
    return {
      title: this.data.trip.title,
      imgaUrl: this.data.trip.image,
      path: `pages/trips/show?id=${this.options.id}`
    }
  }, 
  toggleBookmark(e) {
    console.log("From toggleBookmark e", e)
    let page = this 
    if (page.data.isSaved){
      wx.request({
        url: `${app.globalData.baseURL}/bookmarks/${page.data.bookmarkId}`,
        method: 'DELETE',
        header: app.globalData.header,
        success(res) {
          console.log("From toggleBookmark res",res)
          if (res.statusCode === 200) {
            console.log("bookmark removed")
            page.setData({
              isSaved: false,
              bookmarkId: null
            })
            wx.showToast({
              title: "remove successfully",
              duration: 1000
            })  
          } else {
            console.log("bookmark remove failed")
            // wx.showToast({
            //   title: "remove fails",
            //   icon: "warn",
            //   duration: 2000
            // })  
            // wx.reLaunch
            // wx.navigateTo({
            //   url: '',
            // })
          }
        }
      })
    } else {
      wx.request({
        url: `${app.globalData.baseURL}/trips/${page.data.trip.id}/bookmarks`,
        method: 'POST',
        header: app.globalData.header,
        success(res) {
          console.log("From toggleBookmark res",res)
          if (res.statusCode === 201) {
            console.log("bookmark added")
            let bookmark = res.data
            page.setData({
              isSaved: true,
              bookmarkId: bookmark.id
            })
            wx.showToast({
              title: "save successfully",
              duration: 1000
            })            
          } else {
            console.log("bookmark saved failed")
          }
        }
      })
    }
  },
  share(e){
    console.log("From share")
    wx.showShareMenu({
      withShareTicket: true,
      // menus: [],
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
  goToTripSurvey(e) {
    let page = this
    console.log("bookingid:",page.data.bookingId)
    wx.redirectTo({
      url: `/pages/bookings/form?bookingId=${page.data.bookingId}&tripId=${page.data.trip.id}&tripTitle=${page.data.trip.title}`,
    })
  }, 
  goToMyTrip(e) {
    wx.switchTab({
        url: `/pages/users/mytrips`,
      })
  }, 
  goToSurvey(e) {
    const id = this.options.id
    wx.redirectTo({
      url: `/pages/bookings/form?tripid=${id}`,
    })
  },
  openMap(e) {
    console.log("from open map", e)
    const page = this
    const latitude = page.data.latitude
    const longitude = page.data.longitude
    const name = page.data.name

    wx.openLocation({
      latitude,
      longitude,
      name
    })
  }
})