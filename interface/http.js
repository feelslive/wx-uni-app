// request.js
import Vue from 'vue'

export const HTTP = function(url, params = {}, method = "GET", loading = false) {
	var _self = this,
		url = url,
		method = method,
		header = {},
		data = params,
		token = "",
		hideLoading = loading;
	const BaseUrl = uni.getStorageSync('env') ? uni.getStorageSync('env') : 'https://appapi.jiazhengye.cn'
	//"https://bj-api.jiazhengye.cn"
	// https://appapi.jiazhengye.cn

	//拼接完整请求地址
	let requestUrl = BaseUrl + url;
	data.xmjz_time = new Date().getTime()
	let localToken = uni.getStorageSync("token"); //参数中无token时在本地缓存中获取
	//固定参数:仅仅在小程序绑定页面通过code获取token的接口默认传递了参数token = login
	// if (!localToken) {
	// 	console.log("当前token:", localToken);
	// 	uni.redirectTo({
	// 		url: '/pages/login/login'
	// 	});
	// 	return false;
	// }
	const extConfig = uni.getExtConfigSync ? uni.getExtConfigSync() : {};
	header = {
		'xmjzplatform': 'wx_client',
		'xmjzsign': "",
		'xmjztoken': wx.getStorageSync('token'),
		'xmjzlng': '',
		'xmjzlat': '',
		'xmjzdevice': '',
		'xmjzversion': '1.1.0',
		'xmjzplatform': 'wx_client',
		'xmjzappid': extConfig.appid,
		'xmjzclientopenid': wx.getStorageSync('openId')
	}
	//请求方式:GET或POST(POST需配置header: {'content-type' : "application/x-www-form-urlencoded"},)
	if (method) {
		method = method.toUpperCase(); //小写改为大写
		if (method == "POST") {
			console.log("method1")
			header['content-type'] = "application/x-www-form-urlencoded; charset=UTF-8"
		} else {
			console.log("method2")
			header['content-type'] = "application/json"
		}
	}
	//用户交互:加载圈
	if (!hideLoading) {
		uni.showLoading({
			title: '加载中...'
		});
	}
	return new Promise((resolve, reject) => {
		//网络请求
		uni.request({
			url: requestUrl,
			method: method,
			header: header,
			data: data,
			success: res => {
				console.log("网络请求success:", res);
				if (res.statusCode && res.statusCode != 200) { //api错误
					uni.showModal({
						content: "" + res.errMsg
					});
					return;
				}
				// if (res.data.code) { //返回结果码code判断:0成功,1错误,-1未登录(未绑定/失效/被解绑)
				// 	if (res.data.code == "-1") {
				// 		return;
				// 	}
				// 	if (res.data.code != "0") {
				// 		uni.showModal({
				// 			showCancel: false,
				// 			content: "" + res.data.msg
				// 		});
				// 		return;
				// 	}
				// } else {
				// 	uni.showModal({
				// 		showCancel: false,
				// 		content: "No ResultCode:" + res.data.msg
				// 	});
				// 	return;
				// }
				resolve(res.data)
				// typeof params.success == "function" && params.success(res.data);
			},
			fail: (e) => {
				console.log("网络请求fail:", e);
				uni.showModal({
					content: "" + e.errMsg
				});
				reject(e.data)
				// typeof params.fail == "function" && params.fail(e.data);
			},
			complete: (res) => {
				console.log("网络请求complete", res);
				if (res.data && res.data.code && res.data.code === 4) {
					uni.removeStorageSync('token');
					wx.navigateTo({
						url: '/pages/login/login',
						events: {
							// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							acceptDataFromOpenedPage: function(data) {
								console.log(data)
							},
							someEvent: function(data) {
								console.log(data)
							}
						},
						success: function(res) {
							// 通过eventChannel向被打开页面传送数据
							res.eventChannel.emit('acceptDataFromOpenerPage', {
								data: 'test'
							})
						}
					})
				}
				if (!hideLoading) {
					uni.hideLoading();
				}
				// typeof params.complete == "function" && params.complete();
				return;
			}
		});
	})
}


// getMachineNum:function(){
//     this.sendRequest({
//         url : "machine/index",
//         success : function(res){
//         },
//         fail:function(e){
//         }
//     },'../myhome/myhome','2')
// }


// initData:function () {
//     this.sendRequest({
//         url : "CompanyTeam/teamInfo",
//         method : "POST",
//         data : {ct_id : ct_id},
//         hideLoading : true,
//         success:function (res) {
//             console.log("获取数据:" + JSON.stringify(res));
//         }
//     },"/pages/machineGroupOutput/machineGroupOutput","1")
// },
