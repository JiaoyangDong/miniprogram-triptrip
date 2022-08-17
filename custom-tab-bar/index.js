// custom-tab-bar/index.js
let app = getApp();
Component({
  data: {
    selectedID: 0,
    color: "#E15B99",
    selectedColor: "#E15B99",
    list: [{
      pagePath: "/pages/trips/landing",
      iconPath: "/images/exploreempty-pink.png",
      selectedIconPath: "/images/explorefill-pink.png",
      text: "Explore"
    }, {
      pagePath: "/pages/users/mytrips",
      iconPath: "/images/mytrips-pink.png",
      selectedIconPath: "/images/mytrips-pink.png",
      text: "My Trips"
      }, {
      pagePath: "/pages/users/profile",
      iconPath: "/images/meempty-pink.png",
      selectedIconPath: "/images/mefill-pink.png",
      text: "Me"
      }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      console.log('selectedTabIndex: ', this.data.selectedTabIndex)
      const data = e.currentTarget.dataset
      console.log('switching to tab ',data)
      const url = data.path
      this.setData({
        selectedTabIndex: data.index
      })
      wx.switchTab({url: url})
    }
  }
})