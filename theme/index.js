import Vue from 'vue'
import {COLOR,ICON } from './theme.js'
export const SETBAR = function(index,theme) {
	console.log("index", index)
	if (typeof this.$mp.page.getTabBar === 'function' &&
		this.$mp.page.getTabBar()) {
		this.$mp.page.getTabBar().setData({
			selected: index,
			selectedColor: COLOR[theme],
			list: [{
				pagePath: "../index/index",
				iconPath: 'http://media.jiazhengye.cn/baseFile/miniPro/phpS87SBf',
				selectedIconPath: ICON[theme].home,
				text: "首页"
			}, {
				pagePath: "../order/index",
				iconPath: 'http://media.jiazhengye.cn/baseFile/miniPro/phpydy35r',
				selectedIconPath: ICON[theme].order,
				text: "订单"
			}, {
				pagePath: "../mine/index",
				iconPath: 'http://media.jiazhengye.cn/baseFile/miniPro/phpj7l0zr',
				selectedIconPath: ICON[theme].member,
				text: "我的"
			}]
		})
	}
}
