Component({
	data: {
		active: 0,
		selected: 0,
		color: "#7A7E83",
		selectedColor: "#3cc51f",
		list: [{
			pagePath: "/pages/index/index",
			iconPath: './static/tab_home.png',
			selectedIconPath: './static/tab_home.png',
			text: "首页"
		}, {
			pagePath: "/pages/serve/serve",
			iconPath: './static/tab_order.png',
			selectedIconPath: './static/tab_order.png',
			text: "服务"
		}, {
			pagePath: "/pages/mine/mine",
			iconPath: './static/tab_member.png',
			selectedIconPath: './static/tab_member.png',
			text: "我的"
		}]
	},
	properties: {
		selectedColor: {
			type: String
		}
	},
	lifetimes: {
		attached: function() {
			// 在组件实例进入页面节点树时执行
			this.setData({
				iphonex: wx.getStorageSync('iphoneX')
			})
		},
		detached: function() {
			// 在组件实例被从页面节点树移除时执行
		},
		ready: function() {}
	},
	methods: {
		switchTab(e) {
			console.log(e)
			const data = e.currentTarget.dataset
			const url = data.path
			console.log("wx.", wx)
			wx.switchTab({
				url: data.path,
				success: function(e) {
					console.log(e)
				},
				fail: function(err) {
					console.log(err)
				}
			})
			this.setData({
				selected: data.index
			})
			console.log(this.data.selected, "selected")
		}
	}
})
