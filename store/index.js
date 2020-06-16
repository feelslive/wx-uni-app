import Vue from 'vue';
import Vuex from 'vuex';
import * as TYPES from './types.js'
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		login: false,
		token: '',
		color:'',
		appInfo: {},
		userInfo: {}
	},
	mutations: {
		[TYPES.LOGIN](state, payload) {
			state.userInfo = payload.userInfo;
			state.token = payload.token;
		},
		[TYPES.SETAPPINFO](state, payload) {
			state.appInfo = payload;
		},
		[TYPES.SETCOLOR](state, payload) {
			state.color = payload;
		},
		[TYPES.SETSTOREID](state, payload) {
			state.appInfo.store_id = payload;
		},
	},
	actions: {
		login({
			commit
		}, payload) {
			commit(TYPES.LOGIN, payload)
		},
		setAppInfo({
			commit
		}, payload) {
			commit(TYPES.SETAPPINFO, payload)
		},
		setColor({
			commit
		}, payload) {
			commit(TYPES.SETCOLOR, payload)
		},
		setStoreId({
			commit
		}, payload) {
			commit(TYPES.SETSTOREID, payload)
		}
	}
})
export default store
