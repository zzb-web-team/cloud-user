<template>
	<div class="money_management">
		<div class="top">
			<div>您好，{{ remove_marks(name) }}</div>
			<p>账号ID：{{ remove_marks(id) }}</p>
		</div>
		<div class="con">
			<div class="con_left">
				<div class="con_left_title">
					<h4>可用额度</h4>
					<div class="second_btn">
						<span>￥ 315.17</span>
						<el-button type="primary" size="mini">充值</el-button>
						<el-button size="mini">收支明细</el-button>
					</div>
					<div>
						可以额度预警&nbsp;&nbsp;&nbsp;&nbsp;
						<el-switch v-model="value"> </el-switch>
					</div>
				</div>
				<div class="con_echarts">
					<div
						id="myChart"
						:style="{ height: clientHeight - 493 + 'px' }"
					></div>
					<el-switch
						v-model="value1"
						active-text="按量月结"
						inactive-text="按量日结"
						active-color="#13ce66"
						inactive-color="#ff4949"
						class="echarts_switch"
					>
					</el-switch>
				</div>
			</div>
			<div class="con_right">
				<div class="con_right_top">
					<h4>待办提醒</h4>
					<div class="con_right_top_item">
						<p>待支付</p>
						<div>￥100.00</div>
					</div>
				</div>
				<div class="con_right_bottom">
					<h4>公告</h4>
					<ol class="right_bottom_con">
						<li
							v-for="(item, index) in help_list"
							:key="index"
							@click="show_popups(item)"
						>
							{{ item.type }}{{ item.name }}
						</li>
					</ol>
				</div>
			</div>
		</div>
		<PopUps ref="popups" :con_text="con_text"></PopUps>
	</div>
</template>
<script>
import echarts from 'echarts';
import PopUps from '../../components/pop_ups';
export default {
	data() {
		return {
			clientHeight: '',
			value: true,
			value1: true,
			con_text: {},
			name: sessionStorage.getItem('user'),
			id: sessionStorage.getItem('id'),
			help_list: [
				{
					name: '产品介绍',
					type: '【公告】',
					con:
						'<h4>提问前，先确定是：</h4><ul><li>自己无法独立解决，已经做过很多尝试</li><li>搜索引擎没有满意答案（google 起码过四页）</li><li>本站站内搜索不到满意答案</li></ul><p>自己解决问题的独立性一定要培养出来，多做尝试以避免其他人在你的问题上可能浪费的时间，同时请不要轻易放弃 Google。</p><h4>提问时，按提示来提问，以快速高效地得到解答</h4><ul><li>简要并突出主旨的标题，不要使用无意义的“求助高手”之类的词汇，否则可能会被认为恶意问题而删帖；</li><li>正例：“一个函数在 setTimeout 里调用自身会造成递归吗？”——突出关键词的标题</li><li>反例：“小白求教语言问题，高手请进教”——这个问题本身范围很大，过于模糊</li></ul><h4>尽量清楚地描述问题</h4><ul><li>要善于利用编辑器，有良好的排版以提高可读性（参考&nbsp;<a href="https://segmentfault.com/markdown" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 154, 97); background-color: transparent;">Markdown 编辑器语法指南</a>）</li><li>同时可以根据其他用户的评论内容，对自己的提问「修改」完善</li><li>问题描述，尽可能提供问题所需的主要配置文件及程序源代码</li><li>明确错误提示信息，如果可以，直接上错误码更好</li><li>一图胜千言，如果有图片请贴上图片（但不要把代码放在图片中，请使用 Markdown 的代码格式对代码进行排版，以便他人调试）</li></ul><p><strong>尽量使用网站提供的功能，让你的问题对他人有价值</strong>——使用 tag 准确地标记你的问题，可以让你的问题更快的被人关注，而且也更好地被搜索定位。</p>',
				},
				{
					name: '购买指南',
					type: '【公告】',
					con:
						'<h4>大而空的问题：</h4><ul><li>如“XX语言的未来发展如何”之类的，可以先去新手问答板块看看；</li><li>而“XX语言在设计和性能上有哪些优势”就是一个比较具体化的问题，但这类讨论性的问题可以先表明自己的观点。</li></ul><h4>任何与编程开发无关问题：</h4><ul><li>软件程序评比投票</li><li>无法获得确切结果、没有结论的观点讨论</li></ul><h4>主观色彩太明确的问题：</h4><ul><li>比如“XX语言真让人不爽，你怎么看”等等，这可能会引发口水战；</li></ul><p><strong>尽量避免可能引发长篇论战的提问，应以具体化问题解决为基准。</strong></p>',
				},
				{
					name: '点播控制台操作指南',
					type: '【升级】',
					con:
						'<h4>受欢迎的文章应该是</h4><ul><li>具有原创性、对他人有启发性且行文排版优雅的文章</li><li>与开发相关的技术分享、开发技巧、工具介绍、技术设想、业界评论、职业心得等</li><li>认真或有趣的交流与分享</li></ul><h4>具有原创和启发性</h4><p>原创的文章是自己学习和探索的结果，独立的思考会给他人更大的启发，会引导他人去发现、实现可能更加有趣的事。所以，如果是翻译或转载的文章，可以在文章标题最前面注明 [译] [转]，并在文章显要位置注明原作出处。</p>',
				},
				{
					name: '点播有哪些计费项组成',
					type: '【升级】',
					con:
						'<h2>冲鸭</h2><p><a href="http://www.baidu.com/#/ibose.html" rel="noopener noreferrer" target="_blank">http://www.baidu.com/#/ibose.html</a></p><ul><li>adad </li><li>dada</li><li>daa</li></ul><p>打卡铺扩扩扩扩扩扩铺铺铺铺铺铺铺</p><p><br></p>',
				},
				{
					name: '点播的计费方式是指什么',
					type: '【升级】',
					con:
						'<p><span style="color: rgb(51, 51, 51);">自己比较感兴趣，想持续关注。在你关注问题后，当有新的答案产生时，您将及时获得通知。如果您不想收到通知，可以取消关注该问题</span></p>',
				},
				{
					name: '如何对点播流量进行预估',
					type: '【公告】',
					con:
						'<p><strong style="color: rgb(255, 153, 0);"><em>哈利路亚</em></strong></p><p><br></p><p><strong style="color: rgb(230, 0, 0);">你好呀</strong></p><p>大排档考考点怕</p><p>酷狗</p><p>概括为贫困。买哦地哦哦，【分秒完全】：大揭秘积极</p><ol><li>方法发送到</li><li>方式</li><li>思否s</li><li>思否萨达FWF</li><li>GEA GEA</li></ol><h2>国防生、服务生</h2><p><br></p><h6>大啊啊啊啊啊啊啊啊阿</h6><p><br></p><p><br></p><blockquote>大大</blockquote><p>打卡贫困的【安排】</p><p>多考考</p><pre class="ql-syntax" spellcheck="false">d达大厦多</pre><p><s>哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒得到</s></p><p><br></p><p><br></p><p><br></p><p><br></p>',
				},
			],
		};
	},
	components: {
		PopUps,
	},
	filters: {},
	watch: {},
	created() {},
	mounted() {
		let that = this;
		that.clientHeight = `${document.documentElement.clientHeight ||
			document.documentElement.offsetHeight}`; //获取浏览器可视区域高度
		window.onresize = function() {
			that.clientHeight = `${document.documentElement.clientHeight ||
				document.documentElement.offsetHeight}`;
		};
		console.log(that.clientHeight);
		setTimeout(() => {
			this.set_echarts();
		}, 500);
	},
	methods: {
		show_popups(data) {
			this.$refs.popups.show();
			this.con_text = data;
		},
		remove_marks(str) {
			return str.replace('"', '').replace('"', '');
		},
		set_echarts() {
			let _this = this;
			// 基于准备好的dom，初始化echarts实例
			let myChart = this.$echarts.init(
				document.getElementById('myChart')
			);
			myChart.off('click');
			window.onresize = myChart.resize;
			// 绘制图表
			let options = {
				title: {
					text: '费用趋势',
					subtext: '(单位：元)',
					x: 0,
					y: 30,
				},
				grid: {
					// 间距是 根据x、y轴计算的；假如都是0，x、y轴的label汉字就隐藏掉了。
					left: '5%', // 默认10%，给24就挺合适的。
					top: 110, // 默认60
					right: '6%', // 默认10%
					bottom: 60, // 默认60
				},
				color: '#297AFF',
				tooltip: {
					trigger: 'axis',
					formatter: function(params) {
						return (
							params[0].name +
							'<br>' +
							params[0].seriesName +
							':' +
							params[0].data
						);
					},
				},
				xAxis: {
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					axisTick: {
						show: false,
					},
				},
				yAxis: {
					name: _this.unitdata,
				},
				series: [
					{
						name: '费用',
						type: 'line',
						// barWidth: 30, //柱图宽度
						barMaxWidth: 30,
						data: [150, 230, 224, 218, 135, 147, 260],
						smooth: false, //设置折线图的弧度
						itemStyle: {
							normal: {
								lineStyle: {
									color: '#297AFF', //线的颜色
								},
							},
							color: '#00FF00',
						},
					},
				],
				backgroundColor: '#FFFFFF',
			};
			myChart.clear();
			myChart.setOption(options);
		},
	},
};
</script>
<style lang="scss" scoped>
ol {
	padding: 0;
	list-style: none;
	counter-reset: sectioncounter;
}
.money_management {
	text-align: left;
	background-color: rgb(255, 255, 255);
	margin: 30px 25px;
	.top {
		text-align: left;
		font-size: 16px;
		box-sizing: border-box;
		padding: 30px 25px;
		box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
		p {
			font-size: 14px;
			color: #8e8e8e;
			margin-top: 10px;
		}
	}
	.con {
		display: flex;
		margin-top: 15px;
		.con_left {
			width: 70%;
			.con_left_title {
				box-sizing: border-box;
				padding: 30px 25px;
				margin-right: 15px;
				box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
				h4 {
					font-size: 18px;
					margin-bottom: 10px;
				}
				.second_btn {
					margin-bottom: 20px;
					span {
						font-size: 20px;
						color: #ff6a00;
						margin-right: 50px;
					}
				}
			}
			.con_echarts {
				margin-top: 15px;
				box-sizing: border-box;
				padding: 30px 25px;
				margin-right: 15px;
				box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
				position: relative;
				.echarts_switch {
					position: absolute;
					top: 62px;
					left: 110px;
				}
			}
		}
		.con_right {
			flex: 1;
			display: flex;
			flex-direction: column;
			.con_right_top {
				height: 250px;
				box-sizing: border-box;
				padding: 30px 25px;
				box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
				h4 {
					font-size: 18px;
					margin-bottom: 10px;
				}
				.con_right_top_item {
					padding-top: 15px;
					p {
						margin-bottom: 10px;
					}
					div {
						font-size: 20px;
						color: #ff6a00;
					}
				}
			}
			.con_right_bottom {
				flex: 1;
				margin-top: 15px;
				box-sizing: border-box;
				padding: 30px 25px;
				box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
				h4 {
					font-size: 18px;
					margin-bottom: 10px;
				}
				li {
					line-height: 32px;
					position: relative;
					padding-left: 16px;
				}
			}
		}
	}
}
</style>
