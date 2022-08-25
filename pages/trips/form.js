const app = getApp()
const chooseLocation = requirePlugin('chooseLocation');
Page({
  data: {
    // tags: app.globalData.showTags,
    resetForm: true,
    src: "/images/image-icon.png", 
    start_date: '',
    end_date: '',
    address: '',
    location: '',
    formData: {}, 
    longitude: '',
    latitude: '',
    formTags: {}
    // TODO: set tags into form data
    // tags: []
    // formData: {tags: []}
  },
  onLoad(options) {
    this.loadTags()
  },
  loadTags() {
    const id = wx.getStorageSync('tripId')
    if (!id) {
      let tags = app.globalData.showTags
      tags.map((tag) => { tag.active = false})
    this.setData({tags})
    } else {

    }
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
            tripId: id,
            tags: res.data.trip.tags
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
    console.log('header:', app.globalData.header)
    let trip = page.data.formData
    const tags = page.data.formTags
    // console.log('trip:', trip)
    console.log("Update: trip", trip)
    page.setData({trip})
    console.log("this data to send -> ", page.data.trip)
    // if (page.data.editedId !== undefined && page.data.editedId !== null) {
    if (page.data.trip.id !== undefined && page.data.trip.id !== null) {
      // edit form
      wx.request({
        header: app.globalData.header,
        url: `${app.globalData.baseURL}/trips/${page.data.trip.id}`,
        method: 'PUT',
        data: {
          trip: trip,
          tags: tags
        },
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
        data: {
          trip: trip,
          tags: tags
        },
        success(res) {
          console.log('update success?', res)
          if (res.statusCode === 422) {
            wx.showModal({
              title: 'Error!',
              content: res.data.errors.join(', '),
              showCancel: false,
              confirmText: 'OK'
            })
          } else if (res.statusCode === 500) {
            wx.showModal({
              title: "Trip cannot be empty!",
              showCancel: false,
              confirmText: 'OK'
            })
          } else {
            wx.showToast({
              title: "Trip created!",
              duration: 2000
            })  
            // call the upload
            const id = res.data.trip.id
            page.setData({resetForm: true})
            page.upload(id)
            wx.navigateTo({
              url: `/pages/trips/admin?tripId=${id}`,
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
    let { formData, formTags } = this.data
    let tagsToAdd = []
    tags.forEach((tag) => { if (tag.active === true) {tagsToAdd = [...tagsToAdd, tag.id]}})
    console.log('tagstoadd)', tagsToAdd)
    // formData = {...formData, tags: tagsToAdd}
    // page.setData({formData})
    formTags = {...formTags, tags: tagsToAdd}
    page.setData({formTags})
  },
  goToSurvey(e) {
    console.log('From form.js - goToSurvey: e', e)
    wx.navigateTo({
        url: `/pages/trips/survey`,
      })
  }
})
