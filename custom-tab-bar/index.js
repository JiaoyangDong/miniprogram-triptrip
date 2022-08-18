// custom-tab-bar/index.js
let app = getApp();
Component({
  data: {
    selectedID: 0,
    color: "#E15B99",
    selectedColor: "#E15B99",
    list: [{
      pagePath: "/pages/trips/landing",
      iconPath: "/images/explorefill-pink.png",
      selectedIconPath: "/images/exploreempty-pink.png",
      text: "Explore"
    }, {
      pagePath: "/pages/users/mytrips",
      iconPath: "/images/mytripsfill-pink.png",
      selectedIconPath: "/images/mytripsempty-pink.png",
      text: "My Trips"
      }, {
      pagePath: "/pages/users/profile",
      iconPath: "/images/mefill-pink.png",
      selectedIconPath: "/images/meempty-pink.png",
      text: "Me"
      }]
  },
  attached() {
    this.loadFonts();
  },

  methods: {
    switchTab: function (e) {
      console.log('selectedTabIndex: ', this.data.selectedTabIndex)
      const data = e.currentTarget.dataset
      console.log('switching to tab ',data)
      const url = data.path
      this.setData({
        selectedTabIndex: data.index
      })
      wx.switchTab({url: url})
    }, 
    loadFonts: function () {
      wx.loadFontFace({
        family: 'Fira Sans',
        source: 'https://fonts-triptrip.oss-cn-shanghai.aliyuncs.com/fira-sans/FiraSans-Regular.otf',
      })
    }
  }
})