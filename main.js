import Vue from 'vue'
import App from './App'
import './iconfont.css';
import store from './store/index.js'
import {
	COLOR,
	ICON
} from './theme/theme.js'
import {URL} from './BASE_URL.js'

Vue.config.productionTip = false
const ENV = 'dev'	// 开发环境：dev；正式环境：prod
uni.setStorageSync('env',URL[ENV])
Vue.prototype.$setTabBar = function(index) {
	if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
		var theme = uni.getStorageSync("theme");
		this.$mp.page.getTabBar().setData({
			selected: index,
			selectedColor: COLOR[theme],
			list: [{
					pagePath: '/pages/index/index',
					iconPath: './static/tab_home.png',
					selectedIconPath: ICON[theme].home,
					text: '首页'
				},
				{
					pagePath: '/pages/serve/serve',
					iconPath: './static/tab_order.png',
					selectedIconPath: ICON[theme].order,
					text: '服务'
				},
				{
					pagePath: '/pages/mine/mine',
					iconPath: './static/tab_member.png',
					selectedIconPath: ICON[theme].member,
					text: '我的'
				}
			]
		});
	}
};
//把vuex定义成全局组件
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
