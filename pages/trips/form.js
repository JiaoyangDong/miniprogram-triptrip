const app = getApp()
const chooseLocation = requirePlugin('chooseLocation');
Page({
  data: {
    resetForm: true,
    src: "/images/image-icon.png", 
    start_date: '',
    end_date: '',
    address: '',
    location: '',
    formData: {}, 
    longitude: '',
    latitude: ''
    // TODO: set tags into form data
    // tags: []
    // formData: {tags: []}
  },
  onLoad(options) {
    let tags = app.globalData.tags.
      filter(tag => tag.name).
      map(function(tag) {
      return {
        name: tag.name, 
        show: tag.show,
        active: false
      }
    })
    console.log({tags})
    this.setData({tags})
  },
  onReady() {
  },
  onShow: function () {
    console.log("form onshow")
    const page = this
    let { formData } = page.data
    const current_location = chooseLocation.getLocation();
    console.log({current_location})
    if(current_location){
      const address = current_location.address
      const location = current_location.name
      const longitude = current_location.longitude
      const latitude = current_location.latitude
      formData = {...formData, address, location, longitude, latitude}
      page.setData({formData})
    }
    // if (page.data.resetForm) page.resetForm();
    const id = wx.getStorageSync('tripId')
    if (id) {
      console.log('id found -> update')
      // page.data.resetForm = false
      wx.request({
        header: app.globalData.header,
        url: `${app.globalData.baseURL}/trips/${id}`,
        success(res) {
          let data = res.data
          console.log(data)
          page.setData({
            // locationsIndex: data.locations.findIndex(el => (el === res.data.locations)),
            formData: res.data.trip,
            tripId: id
          })
          wx.removeStorageSync('tripId')
        }
      })
    } 
  },
  setInputData(e) {
    let { formData } = this.data
    formData[e.currentTarget.dataset.field] = e.detail.value
    this.setData({formData})
  },
  resetForm() {
    this.setData({formData: {}})
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
    console.log("Update: trip", trip)
    this.setData({trip})
    if (this.data.editedId !== undefined && this.data.editedId !== null) {
      // edit form
      wx.request({
        header: app.globalData.header,
        url: `${app.globalData.baseURL}/trips/${page.data.editedId}`,
        method: 'PUT',
        data: {trip: trip},
        success(res) {
          console.log('update success?', res)
          page.setData({resetForm: true})
          wx.switchTab({
            url: '/pages/trips/landing',
          })
        }
      })
    } else {
      // new form
      console.log("Create: trip", trip)
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
            wx.showToast({
              title: "Trip created successfully",
              duration: 2000
            })  
            // call the upload
            const id = res.data.trip.id
            page.setData({resetForm: true})
            page.upload(id)
            wx.switchTab({
                url: 'landing'
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

  showMap(e) {
    const key = 'VP6BZ-FMPCR-U4SWP-WQTQI-BGOQE-RLF3L'//使用在腾讯位置服务申请的key
    const referer = 'triptrip' //调用插件的app的名称
    // const location = JSON.stringify({
      // latitude: 39.89631551,
      // longitude: 116.323459711
      // });
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=',
    })

    // let { formData } = this.data
    // let location = e.detail.value
    // let address = e.detail.

    // formData = {...formData, location, }
    // const { field } = e.currentTarget.dataset
    // this.setData({ formData, location: e.detail.value })
  },
  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
  selectTag(e) {
    const page = this
    const currentTag = e.currentTarget.dataset.tag
    let tags = page.data.tags
    tags.forEach((tag) => { 
      if (tag.name === currentTag) tag.active = !tag.active
      page.setData({tags})
    })
    let { formData } = this.data
    formData = {...formData, tags}
    page.setData({formData})
  },
  goToSurvey(e) {
    console.log('From form.js - goToSurvey: e', e)
    wx.navigateTo({
        url: `/pages/trips/survey`,
      })
  }
})
