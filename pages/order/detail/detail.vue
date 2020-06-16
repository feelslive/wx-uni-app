<template>
	<view class="order-detail" v-if="result.pay_actual">
	    <!-- 订单金额 -->
	    <view class="order-price" >
			<!-- :style="background:{{themeColor.linear}}" -->
	        <view class="order-price-key">
	            {{result.order_status_name}}：
	        </view>
	        <view class="order-price-val">
	            ¥{{result.pay_actual}}
	        </view>
	    </view>
	    <!-- 地址 -->
	    <view class="order-card" v-if="result.address">
	        <view class="order-card-info">
	            <view class="order-card-icon">
	                <van-icon name="location-o" :color="themeColor" size="36rpx" />
	            </view>
	            <view class="order-card-right">
	                <view class="order-card-right-name">
	                    {{result.user_name}} {{result.user_mobile}}
	                </view>
	                <view class="order-card-right-site">
	                    {{result.address}}
	                </view>
	            </view>
	        </view>
	    </view>
	
	    <!-- 项目信息 -->
	    <view class="order-card" v-if="result.product_name">
	        <view class="order-card-title border_solid">
	            项目信息
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                项目名称
	            </view>
	            <view class="order-card-right">
	                <view class="order-card-right-vals">
	                    <view>
	                        {{result.product_name}}
	                    </view>
	                </view>
	            </view>
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                数量
	            </view>
	            <view class="order-card-right">
	                <view class="order-card-right-vals">
	                    <view>
	                        {{result.product_unit}}
	                        {{result.product_unit_name}}
	                    </view>
	                    <view class="order-card-right-tag">{{result.product_type_name}}</view>
	                    <view class="order-card-right-tag">{{result.service_type}}</view>
	                </view>
	            </view>
	        </view>
	        <view class="order-card-info" v-if="result.product_type == '2' && result.service_expire_time">
	            <view class="order-card-left">
	                有效期
	            </view>
	            <view class="order-card-right">
	                <view class="order-card-right-vals">
	                    <view style="display:flex;align-items:center;">
	                        <text>{{result.service_start_time}}</text> 
	                        <text>至{{result.service_expire_time}}</text>
	                    </view>
	                </view>
	            </view>
	        </view>
	    </view>
	    <!-- 结算信息 -->
	    <view class="order-card" v-if="result.pay_actual || result.pay_money">
	        <view class="order-card-title border_solid">
	            结算信息
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                现价
	            </view>
	            <view class="order-card-right">
	                {{result.pay_money == '' ? '无' : '¥'+ result.pay_money}}
	            </view>
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                优惠券
	            </view>
	            <view class="order-card-right" v-if="result.coupon_limit === '0.00'">
	                <text>无</text>
	            </view>
	            <view class="order-card-right" v-else>
	                {{result.coupon_type}} - ¥{{result.coupon_limit}}
	            </view>
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                支付备注
	            </view>
	            <view class="order-card-right">
	                {{result.pay_remark =='' ? '无': result.pay_remark}}
	            </view>
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                购买金额
	            </view>
	            <view class="order-card-right">
	                ¥{{result.pay_actual}}
	            </view>
	        </view>
	    </view>
	    <!-- 其他 -->
	    <view class="order-card" v-if="result.order_number">
	        <view class="order-card-title border_solid">
	            其他
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                购买时间
	            </view>
	            <view class="order-card-right">
	                <view class="order-card-right-vals">
	                    <view class="">{{result.create_time}}</view>
	                </view>
	            </view>
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                支付方式
	            </view>
	            <view class="order-card-right">
	                <view class="order-card-right-vals">
	                    <view class="">{{result.order_status == '1' ? '无' : result.pay_type}}</view>
	                </view>
	            </view>
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                支付时间
	            </view>
	            <view class="order-card-right">
	                <view class="order-card-right-vals">
	                    <view class="">{{result.order_status == '1' ? '无' :result.pay_time}}</view>
	                </view>
	            </view>
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                订单编号
	            </view>
	            <view class="order-card-right">
	                <view class="order-card-right-vals">
	                    <view class="">{{result.order_number}}</view>
	                    <view class="order-card-right-func" :data-id="result.order_number" @click="onCopy">
	                        <view class="order-card-right-func-text" style="margin-left: 20rpx;">
	                            复制
	                        </view>
	                    </view>
	                </view>
	            </view>
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                购买门店
	            </view>
	            <view class="order-card-right">
	                <view class="order-card-right-vals">
	                    <view class="">{{result.store_name}}</view>
	                </view>
	            </view>
	        </view>
	        <view class="order-card-info">
	            <view class="order-card-left">
	                门店客服
	            </view>
	            <view class="order-card-right">
	                <view class="order-card-right-vals">
	                    <view class="">{{result.customer_mobile}}</view>
	                    <view class="order-card-right-func" @click="makePhone">
	                        <van-icon style="margin-left: 20rpx" name="phone-o" size="34rpx" />
	                        <view class="order-card-right-func-text">
	                            联系
	                        </view>
	                    </view>
	                </view>
	
	            </view>
	        </view>
	    </view>
	    <view class="handle-btns" v-if="result.order_status == '2' && result.remaining_time >= 1">
	        <!-- wx:if="{{result.order_status == '2' && result.remaining_time >= 1}}" -->
	        <van-button type="default" :data-type="result.product_type" :data-name="result.product_name"
	            :data-id="result.order_number" :data-num="result.remaining_time" :data-unit="result.product_unit_name" round @click="onMakeOrder">预约项目
	        </van-button>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				result:{}
			};
		}
	}
</script>

<style lang="scss">
page {
    background-color: #F2F3F5;
    .order-detail {
        padding-bottom: 100rpx;
        .border_solid::after {
            content: ' ';
            position: absolute;
            pointer-events: none;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            top: -50%;
            left: -50%;
            right: -50%;
            bottom: -50%;
            -webkit-transform: scale(.5);
            transform: scale(.5);
            border-bottom: 1px solid #D7D7DB;
        }

        .order-price {
            color: #fff;
            height: 148rpx;
            display: flex;
            align-items: center;

            &-key {
                font-size: 32rpx;
                margin-left: 32rpx;
            }

            &-val {
                font-size: 40rpx;
            }
        }

        .order-card {
            margin-bottom: 32rpx;
            background-color: #fff;
            padding-bottom: 32rpx;
        }

        .order-card-title {
            color: #333;
            font-size: 30rpx;
            height: 80rpx;
            line-height: 80rpx;
            margin-left: 30rpx;
            font-weight: bold;
            // border-bottom: 1rpx solid #D7D7DB;
            position: relative;
        }

        .order-card-info {
            display: flex;
            align-items: center;
            padding: 32rpx 32rpx 0 0;
            color: #333;
            font-size: 28rpx;
            line-height: 1;
            .order-card-icon {
                width: 92rpx;
                text-align: center;
            }

            .order-card-left {
                color: #8D8E99;
                font-size: 28rpx;
                width: 180rpx;
                margin-left: 30rpx;
            }

            .order-card-right {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                &-name {
                    margin-bottom: 24rpx;
                    line-height: 1;
                }

                &-vals {
                    display: flex;
                    align-items: center;
                }

                &-tag {
                    height: 40rpx;
                    line-height: 40rpx;
                    padding: 0 16rpx;
                    margin-left: 16rpx;
                    color: #FF801A;
                    font-size: 24rpx;
                    background: rgba(255, 128, 26, 0.1);
                    border-radius: 4px;
                }

                &-func {
                    position: relative;
                    margin-left: 20rpx;
                    display: flex;
                    align-items: center;
                    line-height: 1;
                    color: #2B87EA;

                    &-text {
                        font-size: 28rpx;

                    }
                }

                &-func::before {
                    content: '|';
                    color: #999999;
                    position: absolute;
                    pointer-events: none;
                    top: 0;
                    left: -50%;
                    right: -50%;
                    bottom: -50%;
                    -webkit-transform: scale(.5, 0.8);
                    transform: scale(.5, 0.8);
                }

            }
        }

        .handle-btns {
            height: 108rpx;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            position: fixed;
            bottom: 0;
            width: 100%;

            .van-button {
                font-size: 28rpx;
                color: #666;
                margin-right: 30rpx;
                height: 56rpx !important;
                line-height: 56rpx;
            }
        }
    }
}
</style>
