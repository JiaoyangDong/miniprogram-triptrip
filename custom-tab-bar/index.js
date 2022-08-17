// custom-tab-bar/index.js
let app = getApp();
Component({
  data: {
    selected: 0,
    color: "#FFD6E0",
    selectedColor: "#E15B99",
    list: [{
      pagePath: "/pages/trips/landing",
      iconPath: "/images/homeempty-lightpink.png",
      selectedIconPath: "/images/homefill-pink.png",
      text: "Home"
    }, {
      pagePath: "/pages/users/mytrips",
      iconPath: "/images/mytrips-lightpink.png",
      selectedIconPath: "/images/mytrips-pink.png",
      text: "My Trips"
      }, {
      pagePath: "/pages/users/profile",
      iconPath: "/images/meempty-lightpink.png",
      selectedIconPath: "/images/mefill-pink.png",
      text: "Me"
      }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})