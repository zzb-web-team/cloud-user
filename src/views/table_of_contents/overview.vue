<template>
	<div class="content">
		<!-- <div class="top_title"></div> -->
		<!-- 主体内容 -->
		<div class="con_flex">
			<div class="con_flex_left">
				<div class="swiper_con">
					<div class="left_img">
						<img src="../../assets/img/bangong.png" alt="" />
					</div>
					<div class="roll" :class="{ marquee_con: con_animate }">
						<ul :class="{ marquee_top: animate }">
							<li
								v-for="(item, index) in msg"
								:key="index"
								v-show="index <= 3"
							>
								<span class="txtWrap">
									<span class="txt"
										>{{ item.name }}抢得商品{{
											item.goods
										}}</span
									>
									<span class="txt"
										>已有{{
											parseInt(Math.random() * 100)
										}}人购买</span
									>
									<el-button type="text" @click="go_buy(item)"
										>立即购买</el-button
									>
								</span>
							</li>
						</ul>
					</div>
					<div class="go_shang" @click="go_commodity_list()">
						<img src="../../assets/img/s_sahngcheng.png" alt="" />
						<span>商城</span>
					</div>
				</div>
				<div class="content_top">
					<div class="content_top_title">
						<span></span>
						<span @click="godosage" class="astyle">More ></span>
					</div>
					<div class="content_top_con">
						<el-row
							type="flex"
							justify="space-between"
							:gutter="20"
						>
							<el-col :span="6" class="tit_item">
								<p>今天使用流量</p>
								<p>
									<span
										style="font-size: 32px;color: #333333;"
										>{{ dataL }}</span
									>{{ unitdata }}
								</p>
							</el-col>
							<el-col :span="6" class="tit_item">
								<p>昨天使用流量</p>
								<p>
									<span
										style="font-size: 32px;color: #333333;"
										>{{ dataL }}</span
									>{{ unitdata }}
								</p>
							</el-col>
							<el-col :span="6" class="tit_item">
								<p>本月已使用流量</p>
								<p>
									<span
										style="font-size: 32px;color: #333333;"
										>{{ dataL }}</span
									>{{ unitdata }}
								</p>
								<p>更新时间2020.07.20</p>
							</el-col>
							<el-col :span="6" class="tit_item">
								<p>{{ new Date().getMonth() + 1 }}月总用量</p>
								<p>
									<span
										style="font-size: 32px;color: #333333;"
										>{{ dataL }}</span
									>{{ unitdata }}
								</p>
							</el-col>
						</el-row>
					</div>
				</div>
				<div class="content_bottom">
					<div class="content_bottom_title">
						<span>用量趋势</span>
						<span @click="godosage" class="astyle">More ></span>
					</div>
					<div style="padding-left:40px;">
						<Radio @settab="settab" ref="child_radio"></Radio>
					</div>
					<div style="padding:0 43px 0 40px;">
						<div
							id="myChart3"
							:style="{
								height: clientHeight - 650 + 'px',
								fontSize: '16px',
							}"
						></div>
					</div>
				</div>
			</div>
			<div class="con_flex_right">
				<div class="right_top">
					<div class="right_top_title">
						资源包<span
							>(当前资源包<i>{{ order_list.length }}</i
							>个)</span
						>
					</div>
					<ol class="right_top_con">
						<li
							v-for="(item, index) in order_list"
							:key="index"
							@click="go_traffic_list(item)"
						>
							<span>{{ item.name }}</span>
							<span>使用 {{ item.use }}</span>
							<span>剩余 {{ item.rem }}</span>
							<el-button type="text">></el-button>
						</li>
					</ol>
					<div class="right_top_btn">
						<el-button
							type="primary"
							plain
							@click="go_commodity_list()"
							>购买流量包</el-button
						>
						<el-button
							type="primary"
							plain
							class="go_up"
							@click="go_traffic_list()"
							>流量包管理</el-button
						>
					</div>
				</div>
				<div
					class="right_bottom"
					:style="{
						height: clientHeight - 540 + 'px',
					}"
				>
					<div class="right_bottom_title">帮助文档</div>
					<ol class="right_bottom_con">
						<li
							v-for="(item, index) in help_list"
							:key="index"
							@click="show_popups(item)"
						>
							{{ item.name }}
						</li>
					</ol>
				</div>
			</div>
		</div>
		<PopUps ref="popups" :con_text="con_text"></PopUps>
	</div>
</template>

<script>
var _this;
import {
	dataflow_curve,
	manage_dataflow_curve,
	ipfs_flow_summay,
} from '../../servers/api';
import {
	dateToMs,
	getymdtime,
	getlocaltimesformatBytes,
	formatBkb,
	getlocaltimes,
	formatBytes,
	splitTimes,
	getymdtime1,
} from '../../servers/sevdate';
import echarts from 'echarts';
import PopUps from '../../components/pop_ups';
import Radio from '../../components/radio';
export default {
	data() {
		return {
			dataL: 0,
			dataFlowArray: [],
			timeArray: [],
			chanid: '',
			unitdata: 'B',
			clientHeight: document.body.clientHeight,
			msg: [
				{
					name: '【新用户体验】',
					goods:
						'点播流量包新用户限时体验，新注册用户每人可限时体验 ',
				},
				{
					name: '【限时秒杀】',
					goods: '点播流量包1.25元/GB起，还有多种优惠等你来',
				},
				{
					name: '【促销优惠】',
					goods:
						'云点播提供媒资管理+短视频SDK+小程序插件等丰富的产品能力，9.9元起',
				},
				{
					name: '【春季新特惠】',
					goods: '点播流量包1元/GB起，还有存储、转码多种优惠等你来 ',
				},
				{
					name: '【超值特惠】',
					goods:
						'点播流量包0.09元/GB起，还有存储、转码、加速多种优惠等你来 ',
				},
			],
			animate: false,
			con_animate: true,
			setInTime: '', // 定时器
			order_list: [
				{
					name: '点播 100GB流量包',
					use: '30.25GB',
					rem: '69.75GB',
				},
				{
					name: '点播 500GB流量包',
					use: '0GB',
					rem: '500GB',
				},
				{
					name: '点播 100GB流量包',
					use: '30.25GB',
					rem: '69.75GB',
				},
				{
					name: '点播 500GB流量包',
					use: '0GB',
					rem: '500GB',
				},
				{
					name: '点播 100GB流量包',
					use: '30.25GB',
					rem: '69.75GB',
				},
				{
					name: '点播 500GB流量包',
					use: '0GB',
					rem: '500GB',
				},
				{
					name: '点播 100GB流量包',
					use: '30.25GB',
					rem: '69.75GB',
				},
				{
					name: '点播 500GB流量包',
					use: '0GB',
					rem: '500GB',
				},
			],
			help_list: [
				{
					name: '产品介绍',
					con:
						'<h4>提问前，先确定是：</h4><ul><li>自己无法独立解决，已经做过很多尝试</li><li>搜索引擎没有满意答案（google 起码过四页）</li><li>本站站内搜索不到满意答案</li></ul><p>自己解决问题的独立性一定要培养出来，多做尝试以避免其他人在你的问题上可能浪费的时间，同时请不要轻易放弃 Google。</p><h4>提问时，按提示来提问，以快速高效地得到解答</h4><ul><li>简要并突出主旨的标题，不要使用无意义的“求助高手”之类的词汇，否则可能会被认为恶意问题而删帖；</li><li>正例：“一个函数在 setTimeout 里调用自身会造成递归吗？”——突出关键词的标题</li><li>反例：“小白求教语言问题，高手请进教”——这个问题本身范围很大，过于模糊</li></ul><h4>尽量清楚地描述问题</h4><ul><li>要善于利用编辑器，有良好的排版以提高可读性（参考&nbsp;<a href="https://segmentfault.com/markdown" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 154, 97); background-color: transparent;">Markdown 编辑器语法指南</a>）</li><li>同时可以根据其他用户的评论内容，对自己的提问「修改」完善</li><li>问题描述，尽可能提供问题所需的主要配置文件及程序源代码</li><li>明确错误提示信息，如果可以，直接上错误码更好</li><li>一图胜千言，如果有图片请贴上图片（但不要把代码放在图片中，请使用 Markdown 的代码格式对代码进行排版，以便他人调试）</li></ul><p><strong>尽量使用网站提供的功能，让你的问题对他人有价值</strong>——使用 tag 准确地标记你的问题，可以让你的问题更快的被人关注，而且也更好地被搜索定位。</p>',
				},
				{
					name: '购买指南',
					con:
						'<h4>大而空的问题：</h4><ul><li>如“XX语言的未来发展如何”之类的，可以先去新手问答板块看看；</li><li>而“XX语言在设计和性能上有哪些优势”就是一个比较具体化的问题，但这类讨论性的问题可以先表明自己的观点。</li></ul><h4>任何与编程开发无关问题：</h4><ul><li>软件程序评比投票</li><li>无法获得确切结果、没有结论的观点讨论</li></ul><h4>主观色彩太明确的问题：</h4><ul><li>比如“XX语言真让人不爽，你怎么看”等等，这可能会引发口水战；</li></ul><p><strong>尽量避免可能引发长篇论战的提问，应以具体化问题解决为基准。</strong></p>',
				},
				{
					name: '点播控制台操作指南',
					con:
						'<h4>受欢迎的文章应该是</h4><ul><li>具有原创性、对他人有启发性且行文排版优雅的文章</li><li>与开发相关的技术分享、开发技巧、工具介绍、技术设想、业界评论、职业心得等</li><li>认真或有趣的交流与分享</li></ul><h4>具有原创和启发性</h4><p>原创的文章是自己学习和探索的结果，独立的思考会给他人更大的启发，会引导他人去发现、实现可能更加有趣的事。所以，如果是翻译或转载的文章，可以在文章标题最前面注明 [译] [转]，并在文章显要位置注明原作出处。</p>',
				},
				{
					name: '点播有哪些计费项组成',
					con:
						'<h2>冲鸭</h2><p><a href="http://www.baidu.com/#/ibose.html" rel="noopener noreferrer" target="_blank">http://www.baidu.com/#/ibose.html</a></p><ul><li>adad </li><li>dada</li><li>daa</li></ul><p>打卡铺扩扩扩扩扩扩铺铺铺铺铺铺铺</p><p><br></p>',
				},
				{
					name: '点播的计费方式是指什么',
					con:
						'<p><span style="color: rgb(51, 51, 51);">自己比较感兴趣，想持续关注。在你关注问题后，当有新的答案产生时，您将及时获得通知。如果您不想收到通知，可以取消关注该问题</span></p>',
				},
				{
					name: '如何对点播流量进行预估',
					con:
						'<p><strong style="color: rgb(255, 153, 0);"><em>哈利路亚</em></strong></p><p><br></p><p><strong style="color: rgb(230, 0, 0);">你好呀</strong></p><p>大排档考考点怕</p><p>酷狗</p><p>概括为贫困。买哦地哦哦，【分秒完全】：大揭秘积极</p><ol><li>方法发送到</li><li>方式</li><li>思否s</li><li>思否萨达FWF</li><li>GEA GEA</li></ol><h2>国防生、服务生</h2><p><br></p><h6>大啊啊啊啊啊啊啊啊阿</h6><p><br></p><p><br></p><blockquote>大大</blockquote><p>打卡贫困的【安排】</p><p>多考考</p><pre class="ql-syntax" spellcheck="false">d达大厦多</pre><p><s>哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒得到</s></p><p><br></p><p><br></p><p><br></p><p><br></p>',
				},
			],
			con_text: {},
		};
	},
	components: {
		PopUps,
		Radio,
	},
	watch: {
		clientHeight(val) {
			// 为了避免频繁触发resize函数导致页面卡顿，使用定时器
			if (!this.timer) {
				// 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
				this.clientHeight = val;
				this.timer = true;
				let that = this;
				setTimeout(function() {
					// 打印screenWidth变化的值
					that.timer = false;
				}, 400);
			}
		},
	},
	created() {},
	mounted() {
		this.setInTime = setInterval(this.showMarquee, 3000);
		if (this.$cookies.get('id')) {
			this.chanid = this.$cookies.get('id') * 1;
		} else {
			this.$router.push({ path: '/' });
		}
		window.addEventListener(
			'resize',
			() => (this.clientHeight = document.body.clientHeight),
			false
		);
		// this.getlist();
		// this.get_data();
	},
	methods: {
		get_data() {
			let params = {
				startTs: 1617984000,
				endTs: 1618018645,
				urlName: '*',
				channelId: '*',
				ipfsChanel: '*',
				domain: '*',
				timeUnit: 120,
				useCache: 0,
			};
			ipfs_flow_summay(params)
				.then((res) => {
					console.log(res);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		show_popups(data) {
			this.$refs.popups.show();
			this.con_text = data;
		},
		go_buy(row) {
			console.log(row);
		},
		settab(data) {
			console.log(data);
		},
		// 滚动栏滚动
		showMarquee() {
			this.animate = true;
			this.con_animate = true;
			setTimeout(() => {
				this.msg.push(this.msg[0]);
				this.msg.shift();
				this.animate = false;
				this.con_animate = false;
			}, 3000);
		},
		// 本月第一天
		getCurrentMonthFirst() {
			var date = new Date();
			date.setDate(1);
			return (
				new Date(new Date(date).toLocaleDateString()).getTime() / 1000
			);
		},
		go_traffic_list(data) {
			if (data) {
				this.$router.push({
					path: '/traffic_detil',
					query: { data: JSON.stringify(data) },
				});
			} else {
				this.$router.push({ path: '/traffic_list' });
			}
		},
		go_commodity_list() {
			this.$router.push({ path: '/commodity_list' });
		},
		//请求数据
		getlist() {
			// let params = new Object();
			let starttime = this.getCurrentMonthFirst();
			let endtime = Date.parse(new Date()) / 1000;
			// params.start_ts = starttime;
			// params.end_ts = endtime;
			// params.chanId = this.chanid + '';
			// params.fileName = '*';
			// params.timeUnit = 1440;
			// params.acce = '*';

			let arr = [];
			arr.push(this.chanid + '');
			let params = new Object();
			params.startTs = starttime;
			params.endTs = endtime;
			params.channelId = arr;
			params.urlName = '*';
			params.domain = '*';
			params.timeUnit = 1440;
			params.terminalName = -1;
			params.pageNo = 0;
			params.pageSize = 10;
			manage_dataflow_curve(params)
				.then((res) => {
					if (res.status == 0) {
						if (res.data.total == 0) {
							this.dataL = 0;
							this.unitdata = 'B';
						} else {
							this.unitdata = formatBytes(res.data.total);
							this.dataL = formatBkb(
								res.data.total,
								this.unitdata
							);
						}
						if (res.data.data[0].dataflowArray.length == 0) {
							let arr = splitTimes(starttime, endtime, 1440);
							arr.forEach((item, index) => {
								this.timeArray.push(getymdtime1(item));
							});
							this.dataFlowArray = _.fill(Array(arr.length), 0);
						} else {
							res.data.data[0].dataflowArray.forEach(
								(item, index) => {
									this.dataFlowArray.push(
										formatBkb(item, this.unitdata)
									);
								}
							);
							this.dataFlownum =
								res.data.data[0].dataflowArray.length - 1;
							res.data.data[0].timeArray.forEach(
								(item, index) => {
									this.timeArray.push(getymdtime1(item));
								}
							);
						}
						// res.data.data[0].dataflowArray.forEach((item) => {
						// 	this.dataFlowArray.push(
						// 		formatBkb(item, this.unitdata)
						// 	);
						// });
						// res.data.data[0].timeArray.forEach((item, index) => {
						// 	this.timeArray.push(getlocaltimes(item));
						// });

						this.configure();
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((err) => {});
		},
		//跳转页面
		godosage() {
			this.$router.push({ path: '/dosage_query' });
		},
		//绘图
		configure() {
			var _this = this;
			let myChart = echarts.init(document.getElementById('myChart3')); //这里是为了获得容器所在位置
			window.onresize = myChart.resize;
			let options = {
				title: {
					text: '流量趋势',
					itemGap: 10,
					textStyle: {
						//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
						fontSize: 14,
						color: '#666666',
						fontStyle: 'normal',
						fontWeight: '400',
					},
				},
				grid: {
					left: '3%', //距离左边的距离
					right: '6%', //距离右边的距离
					bottom: '8%', //距离下边的距离
					top: '12%', //距离上边的距离
				},
				toolbox: {
					//show: true,
					itemSize: 20,
					itemGap: 30,
					right: 50,
					feature: {
						// mark: { show: true },
						// dataView: { show: true, readOnly: false },
						// magicType: { show: true, type: ['line', 'bar'] },
						// restore: { show: true },
						// saveAsImage: { show: false },
						// mydow: {
						// 	show: true,
						// 	title: '导出',
						// 	icon:'path://M552 586.178l60.268-78.53c13.45-17.526 38.56-20.83 56.085-7.38s20.829 38.56 7.38 56.085l-132 172c-16.012 20.863-47.454 20.863-63.465 0l-132-172c-13.45-17.526-10.146-42.636 7.38-56.085 17.525-13.45 42.635-10.146 56.084 7.38L472 586.177V152c0-22.091 17.909-40 40-40s40 17.909 40 40v434.178zM832 512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 61.856-50.144 112-112 112H224c-61.856 0-112-50.144-112-112V512c0-22.091 17.909-40 40-40s40 17.909 40 40v288c0 17.673 14.327 32 32 32h576c17.673 0 32-14.327 32-32V512z',
						// 	onclick: function() {
						// 		alert('myToolHandler1');
						// 	},
						// },
					},
				},
				tooltip: {
					trigger: 'axis',
					formatter: function(params) {
						return (
							params[0].name +
							'<br>' +
							params[0].seriesName +
							':' +
							params[0].data +
							_this.unitdata
						);
					},
				},
				xAxis: {
					type: 'category',
					data: this.timeArray,
				},
				yAxis: {
					type: 'value',
					name: _this.unitdata,
				},
				series: [
					{
						name: '流量',
						data: this.dataFlowArray,
						type: 'line',
						symbol: 'none',
						smooth: true,
						itemStyle: {
							normal: {
								color: '#A7D5FF', //#09b0f5
							},
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{ offset: 0, color: '#A7D5FF' },
										{ offset: 0.5, color: '#D0E8FF' },
										{ offset: 1, color: '#A7D5FF' },
									]
								),
							},
						}, //填充区域样式
					},
				],
				backgroundColor: '#FFFFFF',
			};
			myChart.setOption(options);
		},
	},
	destroyed() {
		clearInterval(this.setInTime); // 页面销毁时清除定时器
	},
};
</script>
<style lang="scss" scoped>
.content {
	.con_flex {
		display: flex;
		align-items: center;
		background-color: #fff;
		min-width: 1500px;
		.con_flex_left {
			width: 65%;
			.swiper_con {
				display: flex;
				justify-content: space-around;
				margin: 0 24px 15px 25px;
				background-color: #f8fafef2;
				box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
				.left_img {
					width: 80px;
					display: flex;
					justify-content: center;
					// align-items: center;
					padding-top: 40px;
					img {
						width: 36px;
						height: 36px;
					}
				}
				.roll {
					width: 80%;
					text-align: left;
					box-sizing: border-box;
					padding: 30px 0 20px;
					.marquee_con {
						padding-top: 26px;
					}
					.marquee_top {
						transition: all 1s;
						margin-top: 0px; /* 容器高度 */
						// visibility: hidden;
					}
					li {
						position: relative;
						padding-left: 10px;
						margin-bottom: 16px;
						white-space: nowrap;
						overflow-y: hidden;
						&:before {
							top: 8px;
							left: 0;
							position: absolute;
							display: block;
							width: 6px;
							height: 6px;
							border-radius: 50%;
							background: #8e8e8e;
							content: '';
						}
						.txtWrap {
							display: flex;
							align-items: center;
						}
						.txt:first-child {
							display: inline-block;
							width: 75%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}
				.go_shang {
					flex: 1;
					box-sizing: border-box;
					padding-right: 40px;
					margin: auto;
					display: flex;
					// flex-direction: column;
					flex-direction: column;
					align-items: center;
					cursor: pointer;
					span {
						margin-top: 10px;
						color: #297aff;
					}
				}
			}
			.content_top {
				// padding: 15px 0 25px;
				margin: 0 24px 15px 25px;
				// width: 100%;
				background: #ffffff;
				box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
				border-radius: 2px;
				// border: 1px solid #000;
				.content_top_title {
					margin: auto;
					margin-right: 45px;
					margin-left: 45px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					line-height: 45px;
					span:nth-child(1) {
						color: #202020;
						font-weight: 400;
						font-size: 16px;
					}
					span:nth-child(2) {
						color: #297aff;
						font-weight: 400;
						font-size: 14px;
					}
				}
				.content_top_con {
					margin: 0 40px;
					color: #333333;
					padding-bottom: 25px;
					.tit_item {
						background: #f5f5f5;
						border-radius: 4px;
						margin-right: 26px;
						text-align: left;
						padding-left: 20px !important;
						p {
							line-height: 65px;
							font-size: 14px;
							color: #9e9e9e;
						}
						p:nth-child(2) {
							line-height: 16px;
							color: #333333;
						}
						p:nth-child(3) {
							font-size: 12px;
							line-height: 32px;
						}
					}
					.tit_item:last-child {
						margin-right: 0;
					}
				}
			}
			.content_bottom {
				margin-top: 70px;
				margin: auto;
				margin-left: 25px;
				margin-right: 24px;
				background: #ffffff;
				box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
				.content_bottom_title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					line-height: 75px;
					margin: 15px 45px 0 40px;
					span:nth-child(1) {
						color: #202020;
						font-weight: 400;
						font-size: 16px;
					}
					span:nth-child(2) {
						color: #297aff;
						font-weight: 400;
						font-size: 14px;
					}
				}
				// padding: 10px;
				p {
					text-align: right;
					color: #1296db;
				}
			}
			.astyle:hover {
				cursor: pointer;
			}
		}
		.con_flex_right {
			flex: 1;
			text-align: left;
			height: 100%;
			display: flex;
			flex-direction: column;
			margin-right: 25px;
			.right_top {
				height: 390px;

				box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
				background-color: #fff;
				margin-top: 30px;
				margin-bottom: 15px;
				overflow: hidden;
				.right_top_title {
					box-sizing: border-box;
					padding: 20px 40px;
					padding-bottom: 0;
					font-size: 16px;
					font-weight: 600;
					span {
						font-weight: 400;
						font-size: 12px;
						margin-left: 10px;
						i {
							font-style: normal;
							color: #f85555;
						}
					}
				}
				.right_top_con {
					height: 240px;
					overflow-y: scroll;
					box-sizing: border-box;
					padding-bottom: 20px;
					li {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 16px;
						margin-right: 20px;
						span {
							display: inline-block;
							min-width: 100px;
							overflow: hidden;
							text-overflow: ellipsis; //文本溢出显示省略号
							white-space: nowrap; //文本不会换行
						}
					}
				}
				.right_top_con::-webkit-scrollbar {
					display: none;
				}
				.right_top_btn {
					display: flex;
					justify-content: center;
					padding: 0 20px;
					align-items: center;
					margin-top: 40px;
					.go_up {
						margin-left: 30px;
					}
				}
			}
			.right_bottom {
				box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
				background-color: #fff;
				margin-bottom: 30px;
				.right_bottom_title {
					box-sizing: border-box;
					padding: 20px 40px;
					padding-bottom: 0;
					font-weight: 600;
					font-size: 16px;
				}
				li {
					line-height: 32px;
					position: relative;
					padding-left: 16px;
					&:before {
						top: 12px;
						left: 0;
						position: absolute;
						display: block;
						width: 6px;
						height: 6px;
						border-radius: 50%;
						background: #8e8e8e;
						content: '';
					}
				}
			}
		}
	}
}
</style>
