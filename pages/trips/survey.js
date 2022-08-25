// pages/trips/survey.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    formData: {},
    resetForm: true,
    // tripId: 117, // testing only
    // tripId:  137, // testing only
    yes:'/images/minus-2.png',
    no:'/images/addsurvey.png',
    questions: {
      "room": {name: "Room type", active: false},
      "food": {name: "Food preference", active: false},
      "pickup": {name: "Do you need pick up?", active: false}
    },

    finalSurvey : ['','',''],
    // This is a data structure example to build while submitting to the back end.
    questionsToSubmit: [
      {
        "content": "What kind of room do you want?",
        "question_type": "single-choice",
        "options": [
          "Private room",
          "Shared room",
          "No preference"
        ],
      },
      {
        "content": "Any food preferences?",
        "question_type": "single-choice",
        "options": [
          "Vegetarian",
          "Vegan",
          "None"
        ]
      },
      {
        "content": "Do you need to be picked up?",
        "question_type": "single-choice",
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },

  resetForm() {
    this.setData({formData: {}})
  },

  selectQuestion(e) {
    console.log("toggle questions:", e)
    const page = this
    // const tag = e.currentTarget.dataset.tag

    const { tag, index } = e.currentTarget.dataset
    // console.log("toggle questions ", tag)
    let questions = page.data.questions
    // questions[tag].active = !questions[tag].active
    page.setData({questions})
    // const index = e.currentTarget.dataset.index
    // let finalSurvey = page.data.finalSurvey
    // const questionsToSubmit = page.data.questionsToSubmit

    let { finalSurvey, questionsToSubmit } = page.data
    if (!questions[tag].active) {
      // if its inactive -> make it active -> add it to finalSurvey
      questions[tag].active = true
      finalSurvey[index] = questionsToSubmit[index]
      page.setData({finalSurvey, questions})
    } else {
      // if its active -> removing from finalSurvey -> make inactive
      finalSurvey[index] = ''
      questions[tag].active = false
      page.setData({finalSurvey, questions})
    }
    console.log(page.data)
  },
 
  // this page is not a usual form. maybe it's better to use custom function rather than form-type="submit" functions. replace
  submitSurveyCustom(){
    let page = this
    console.log(page.data.finalSurvey)
    const finalSurvey = page.data.finalSurvey.filter(question => question)
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${page.data.tripId}/survey`,
      method: "POST",
      data: {
        "trip_id": page.data.tripId,
        // finalSurvey
        "questions": finalSurvey
        // "questions": finalSurvey
      },
      success(res) {
        console.log("From survey.js - submitSurveyCustom: res",res)
        if (res.statusCode === 201) {
          wx.navigateBack({
            delta: 0,
          })
        } else if (res.statusCode === 404)  {
            wx.showModal({
              title: "Survey cannot be empty!",
              showCancel: false,
              confirmText: 'OK'
            })
        }
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    console.log('options ->', options.id)
    this.setData({tripId: options.id})
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
    // TODO: 
    // need to page.setData tripId when first load
    // const page = this
    // if (app.globalData.header) {
    //   // proceed to fetch api
    //   page.getData()
    // }
    console.log('survey onShow')
    // const page = this
    // console.log(this)
    // const tripId = this.data.
    // page.setData({tripId : page})
  },
  getData() {
    let page = this
    let tripId = page.options.tripId
    console.log(tripId)
    console.log(page.options)
  },
  
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

  goToHome() {
    wx.switchTab({
      url: 'landing',
    })
  },

  goBack() {
    wx.navigateBack({
      delta: 0,
    })
  },
})