<template>
	<div class="content">
		<div class="top_title">点播加速日志</div>
		<!-- 主体表格 -->
		<div class="log_download_con">
			<div class="log_download_con_top">
				<span>日期：</span>
				<el-date-picker
					style="margin-left:10px;"
					v-model="value2"
					type="datetimerange"
					:picker-options="pickerOptions"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					align="left"
					@change="gettimes"
				></el-date-picker>
			</div>

			<el-table
				:data="tablecdn"
				stripe
				style="width: 100%;"
				:cell-style="rowClass"
				:header-cell-style="headClass"
			>
				<el-table-column
					prop="fileName"
					label="日志数据包"
					width="360px"
				></el-table-column>
				<el-table-column prop="startTS" label="开始时间">
					<template slot-scope="scope">
						<span>{{ scope.row.startTS | settimes }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="endTS" label="结束时间">
					<template slot-scope="scope">
						<span>{{ scope.row.endTS | settimes }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button
							@click.native.prevent="dloadRow(scope.row)"
							type="text"
							size="small"
							>下载</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<div
				style="display: flex;justify-content: space-between;align-items: center;"
			>
				<div class="log_download_con_bot">
					<el-button
						type="text"
						size="small"
						@click="dloadRow()"
						v-if="tablecdn.length > 0"
						>全部下载</el-button
					>
				</div>
				<fenye
					style="text-align:right;margin:20px 0 0 0;"
					@fatherMethod="getpage"
					@fathernum="gettol"
					:pagesa="total_cnt"
					:currentPage="currentPage"
				></fenye>
			</div>
		</div>
	</div>
</template>

<script>
import { query_logfile_table, download_logfile } from '../../servers/api';
import fenye from '@/components/fenye';
import { dateToMs, getymdtime } from '../../servers/sevdate';
export default {
	data() {
		return {
			currentPage: 1,
			tolpage: 1,
			total_cnt: 1,
			pagesize: 10,
			tablecdn: [],
			value2: '',
			chanid: '',
			pickerOptions: {
				shortcuts: [
					{
						text: '昨天',
						onClick(picker) {
							const end = new Date(
								new Date(
									new Date().toLocaleDateString()
								).getTime()
							);
							const start =
								new Date(
									new Date(
										new Date().toLocaleDateString()
									).getTime()
								) -
								3600 * 1000 * 24 * 1;
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '今天',
						onClick(picker) {
							const end = new Date();
							const start = new Date(
								new Date(
									new Date().toLocaleDateString()
								).getTime()
							);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date(
								new Date(
									new Date().toLocaleDateString()
								).getTime()
							);
							start.setTime(
								start.getTime() - 3600 * 1000 * 24 * 6
							);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date(
								new Date(
									new Date().toLocaleDateString()
								).getTime()
							);
							start.setTime(
								start.getTime() - 3600 * 1000 * 24 * 29
							);
							picker.$emit('pick', [start, end]);
						}
					}
				],
				disabledDate(time) {
					return time.getTime() > Date.now();
				}
			}
		};
	},
	filters: {
		settimes(data) {
			var stat = getymdtime(data);
			return stat;
		}
	},
	components: {
		fenye
	},
	mounted() {
		if (this.$cookies.get('id')) {
			this.chanid = this.$cookies.get('id') * 1;
		} else {
			this.$router.push({ path: '/' });
		}
		this.gettablecdn();
	},
	methods: {
		gettablecdn() {
			let parmas = new Object();
			if (this.value2) {
				parmas.start_ts = parseInt(dateToMs(this.value2[0]));
				parmas.end_ts = parseInt(dateToMs(this.value2[1]));
			} else {
				let times =
					new Date(new Date().toLocaleDateString()).getTime() / 1000;
				parmas.start_ts = times - 24 * 60 * 60 * 6;
				parmas.end_ts = Date.parse(new Date()) / 1000;
			}
			parmas.pageNo = Math.abs(this.tolpage - 1);
			parmas.pageSize = this.pagesize;
			parmas.chanId = this.chanid + '';
			query_logfile_table(parmas)
				.then(res => {
					if (res.status == 0) {
						this.total_cnt = res.data.totalCnt;
						this.tablecdn = res.data.list;
					}
				})
				.catch(error => {});
		},
		//获取页码
		getpage(pages) {
			this.tolpage = pages;
			this.gettablecdn();
		},
		//获取每页数量
		gettol(pagetol) {
			this.pagesize = pagetol;
			// this.gettablecdn();
		},
		//下载
		dloadRow(data) {
			let parmas = new Object();
			parmas.chanId = this.chanid + '';
			if (data) {
				parmas.fileName = data.fileName;
			} else {
				parmas.fileName = '*';
			}
			if (this.value2) {
				parmas.start_ts = parseInt(dateToMs(this.value2[0]));
				parmas.end_ts = parseInt(dateToMs(this.value2[1]));
			} else {
				let times =
					new Date(new Date().toLocaleDateString()).getTime() / 1000;
				parmas.start_ts = times - 24 * 60 * 60 * 6;
				parmas.end_ts = Date.parse(new Date()) / 1000;
			}
			download_logfile(parmas)
				.then(res => {
					if (res.status == 0) {
						window.open(res.msg, '_blank');
						// window.location.href = res.msg;
					}
				})
				.catch(error => {});
		},
		//自定义时间
		gettimes(val) {
			this.gettablecdn();
		},
		// 表头样式设置
		headClass() {
			return 'text-align: center;background:#F3F6FB;';
		},
		// 表格样式设置
		rowClass() {
			return 'text-align: center;';
		}
	}
};
</script>

<style lang="scss" scoped>
.log_download_con {
	width: auto;
	margin: auto;
	margin-top: 19px;
	margin-left: 45px;
	margin-right: 45px;
	background: #ffffff;
	padding: 37px 37px 20px 37px;
	box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
	border-radius: 2px;
	text-align: left;
	.log_download_con_top {
		margin: 2px 0 18px 0;
		span {
			color: #999999;
			font-size: 14px;
			margin-left: 10px;
		}
	}
	.log_download_con_bot {
		padding-left: 10px;
	}
}
</style>
