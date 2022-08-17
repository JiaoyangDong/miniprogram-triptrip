// pages/trips/form.js
const app = getApp()
Page({
  data: {
    location: '',
    formData: {},
    resetForm: true,
    src: "/images/image-icon.png", 
    start_date: '',
    end_date: '',
    location: ''
  },
  onLoad(options) {
  },
  onReady() {
  },
  onShow: function () {
    console.log("form onshow")
    const page = this
    if (page.data.resetForm) this.resetForm();
    const id = wx.getStorageSync('editedId')
    if (id) {
      console.log('id found -> update')
      wx.request({
        header: app.globalData.header,
        url: `${app.globalData.baseURL}/pets/${id}`,
        success(res) {
          let data = page.data
          page.setData({
            locationsIndex: data.locations.findIndex(el => (el === res.data.locations)),
            formData: res.data,
            editedId: id
          })
          wx.removeStorageSync('editedId')
        }

      })
    }
  },
  setInputData(e) {
    console.log(e)
    let { formData } = this.data
    formData[e.currentTarget.dataset.field] = e.detail.value
    this.setData({formData})
  },
  resetForm() {
    this.setData({formData: {}})
  },
  bindRegionChange: function (e) {
    console.log('picker sends selection change, carries value of ', e.detail.value)
    let { formData } = this.data
    const { field } = e.currentTarget.dataset
    if (field == 'location') {
      formData.location = e.detail.value
      this.setData({ formData,
        location: e.detail.value
      })
    }
  },
  bindDateChange: function(e) {
    console.log('picker sends selection change, carries value of ', e.detail.value)
    let { formData } = this.data
    const { field } = e.currentTarget.dataset
    if ( field == 'start_date') {
      formData.start_date = e.detail.value,
      this.setData({ formData, start_date: e.detail.value })
    } else if ( field == 'end_date') {
      formData.end_date = e.detail.value,
      this.setData({ formData, end_date: e.detail.value })
    }
  },
  listenerBtnChooseImage: function () {
    const page = this
    page.setData({resetForm: false})
    // Upload an image
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('img successfully uploaded', res)
        page.setData({
          src: res.tempFilePaths
        })
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

  create(e) {
    console.log('from create button --->',e)
    const page = this
    let trip = this.data.formData
    console.log(trip)
    this.setData({trip})
    if (this.data.editedId !== undefined && this.data.editedId !== null) {
      wx.request({
        header: app.globalData.header,
        url: `${app.globalData.baseURL}/trips/${page.data.editedId}`,
        method: 'PUT',
        data: {trip: trip},
        success(res) {
          console.log('update success?', res)
          page.setData({resetForm: true})
          wx.switchTab({
            url: '/pages/tris/landing',
          })
        }
      })
    } else {
      wx.request({
        header: app.globalData.header,
        url: `${app.globalData.baseURL}/trips`,
        method: 'POST',
        data: { trip: trip },
        success(res) {
          console.log('update success?', res)
          if (res.statusCode === 422) {
            wx.showModal({
              title: 'Error!',
              content: res.data.errors.join(', '),
              showCancel: false,
              confirmText: 'OK'
            })
          } else {
            // call the upload
            const id = res.data.trip.id
            page.setData({resetForm: true})
            page.upload(id)
              wx.switchTab({
                url: '/pages/trips/landing'
            })
          }
        },
        fail(error) {
          console.log({error})
        }
      })
    }
  },
  upload(id) {
    const page = this
    wx.uploadFile({
      url: `${app.globalData.baseURL}/trips/${id}/upload`,
      filePath: page.data.src[0],
      header: app.globalData.header,
      name: 'image',
      success (res){
        page.setData({resetForm: true})
        console.log(res)
      }
    })
  }, 
})