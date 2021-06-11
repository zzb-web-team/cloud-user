<template>
	<div class="order_list_com">
		<div class="con_top">
			<div class="t_title">流量包管理</div>
			<div class="title_seach">
				<div class="search_left">
					<el-input
						v-model="val_name"
						placeholder="请输入资源包名称"
						size="medium"
						@change="onChanges"
						style="width:40%;max-width:190px;"
					></el-input>
					<span class="item_title">添加时间</span>
					<el-date-picker
						size="medium"
						v-model="search_time"
						type="daterange"
						placeholder="选择日期"
						range-separator="~"
						start-placeholder="开始时间"
						end-placeholder="截止时间"
                        value-format="timestamp"
						style="width:40%;max-width:220px;"
					>
					</el-date-picker>
					<el-select
						size="medium"
						v-model="pay_type"
						placeholder="请选择活动区域"
						style="width:40%;max-width:190px;margin-left:20px;"
					>
						<el-option label="全部" value="0"></el-option>
						<el-option label="未使用" value="1"></el-option>
						<el-option label="使用中" value="2"></el-option>
                        <el-option label="过期" value="3"></el-option>
                        <el-option label="使用完" value="4"></el-option>
					</el-select>
				</div>
				<div class="search_right">
					<el-button type="primary" size="small" @click="onChanges"
						>查询</el-button
					>
					<el-button size="small" @click="reset">重置</el-button>
				</div>
			</div>
		</div>
		<div class="con_table" ref="box_rHeight">
			<el-table
				:data="tableData"
				style="width: 100%"
				:cell-style="rowClass"
				:header-cell-style="headClass"
                :row-class-name='tableRowClassName'
			>
				<el-table-column type="index" width="55" label="序号"> </el-table-column>
				</el-table-column>
				<el-table-column prop="product_name" label="资源包名">
				</el-table-column>
                <el-table-column prop="product_type" label="产品类型">
				</el-table-column>
				<el-table-column prop="size_spec" label="资源流量" width="120">
                    <template slot-scope="scope">{{(scope.row.size_spec) |set_gb}}</template>
				</el-table-column>
				<el-table-column
					prop="product_type"
					label="金额"
					width="80"
				>
				</el-table-column>
				<el-table-column prop="num" label="数量" width="80">
				</el-table-column>
				<el-table-column prop="used_flow" label="已使用" width="100">
				</el-table-column>
				<el-table-column label="剩余" prop="tel"  width="120">
                    <template slot-scope="scope">{{(scope.row.total_flow-scope.row.used_flow) |set_bkb}}</template>
				</el-table-column>
				<el-table-column
					prop="create_time"
					label="购买日期"
					width="150"
				>
                <template slot-scope="scope">{{common.getTimess(scope.row.create_time*1000)}}</template>
				</el-table-column>
				<el-table-column
					prop="user_time"
					label="使用日期"
					width="150"
				>
                 <template slot-scope="scope"><span v-if="scope.row.start_limittm==0">无期限</span><span v-else>{{common.getTimess(scope.row.start_limittm*1000)}}</span></template>
				</el-table-column>
                	<el-table-column
					prop="end_time"
					label="到期时间"
					width="150"
				>
                <template slot-scope="scope"><span v-if="scope.row.end_limittm==0">无期限</span><span v-else>{{common.getTimess(scope.row.end_limittm*1000)}}</span></template>
				</el-table-column>
				<el-table-column prop="order_type" label="状态" width="100">
					<template slot-scope="scope">
						<span
                        class="used"
							v-if="scope.row.state == 1"
                        >未使用</span>
						<span v-else-if="scope.row.state == 2" class="using">使用中</span>
                        <span v-else-if="scope.row.state == 3" class="completed">过期</span>
						<span v-else class="completed">使用完</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="160">
					<template slot-scope="scope">
						<el-button
							@click="handleClick(scope.row)"
							type="text"
							size="small"
							>查看详情</el-button
						>
						<!-- <el-button
							@click="deleteRow(scope.row)"
							type="text"
							size="small"
							>删除</el-button
						> -->
					</template>
				</el-table-column>
			</el-table>
			<div class="content_bottom">
				<fenye
					:currentPage="pageNo"
					@handleCurrentChange="handleCurrentChange"
					@handleSizeChange="handleSizeChange"
					:pagesa="total_cnt"
				></fenye>
			</div>
		</div>
	</div>
</template>

<script>
import fenye from '@/components/fenye';
import {query_user_pkt} from "../../servers/api"
export default {
	data() {
		return {
			clientHeight: '',
			val_name: '',
			pay_type: '0',
			search_time: '',
			starttime: '',
            endtime: '',
            user_id: JSON.parse(sessionStorage.getItem('id')),
			pageNo: 0, //当前页码
			pageSize: 10, //每页数量
			total_cnt: 0, //数据总量
			tableData: [
				// {
				// 	order_id: 15049156033,
				// 	visit_cnt: 32,
				// 	name: '国庆超值包',
				// 	user_information: '王小虎',
				// 	tel: 15913124680,
				// 	product_type: '流量包',
				// 	num: 12,
				// 	money: 10,
				// 	specification: 3,
				// 	pay_type: '微信',
				// 	create_time: '2021-08-03 11:30:00',
				// 	order_type: 2,
				// },
			],
		};
	},
	components: {
		fenye,
	},
	filters: {
		formatTel(iphone) {
			let tel = String(iphone);
			var reg = /^(\d{3})\d{4}(\d{4})$/;
			return tel.replace(reg, '$1****$2');
        },
        set_bkb(data){
            function bytesToSize(bytes) {
                if (bytes === 0) return '0 B';
                var k = 1024, // or 1024
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            }
            return bytesToSize(data*1024*1024);
        },
        set_gb(data){
             function bytesToSize(bytes) {
                if (bytes === 0) return '0 B';
                var k = 1024, // or 1024
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                    console.log(i);
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            }
            return bytesToSize(data*1024*1024*1024);
        }
	},
	watch: {
		clientHeight() {
			//如果clientHeight 发生改变，这个函数就会运行
			this.changeFixed(this.clientHeight);
		},
	},
	mounted() {
		this.starttime =
			new Date(new Date().toLocaleDateString()).getTime() / 1000;
		this.endtime = Date.parse(new Date()) / 1000;
		let that = this;
		that.clientHeight = `${document.documentElement.clientHeight ||
			document.documentElement.offsetHeight}`; //获取浏览器可视区域高度
		window.onresize = function() {
			that.clientHeight = `${document.documentElement.clientHeight ||
				document.documentElement.offsetHeight}`;
		};
		if (that.$refs.box_rHeight) {
			that.$refs.box_rHeight.style.height =
				that.clientHeight - 334 + 'px';
			that.$refs.box_rHeight.style.minHeight = 500 + 'px';
        }
        this.onChanges();
	},
	methods: {
		onChanges() {
            let params = {
				product_name: this.val_name,
				start_time: this.search_time[0], //创建开始时间 单位:秒
				end_time: this.search_time[1],
                page: this.pageNo,
                user_id:this.user_id,
                 state:Number(this.pay_type), //0:全部 1:未使用 2:使用中 3:过期 4:使用完
                // user_id:"158000000011"
                };
			query_user_pkt(params)
				.then((res) => {
					if (res.status == 0) {
						this.tableData = res.data.data;
						this.total_cnt = res.data.total;
					}
				})
				.catch((error) => {});
        },
		reset() {
            this.val_name= '';
			this.pay_type= '0';
            this.search_time= [];
            this.pageNo=0;
            this.onChanges();
        },
		handleClick(row) {
			this.$router.push({
				path: '/traffic_detil',
				query: {
					data: JSON.stringify(row),
				},
			});
		},
		//删除
		/**
		 * 修改按钮样式，设计图左边是确定，右边是取消，
		 */
		deleteRow(rows) {
			this.$confirm(
				`<p>是否删除订单${rows.order_id}</p><p>删除后无法查看订单信息</p>`,
				'提示',
				{
					cancelButtonText: '确定',
					confirmButtonText: '取消',
					type: 'warning',
					dangerouslyUseHTMLString: true,
					center: true,
					cancelButtonClass: 'no_btn',
					confirmButtonClass: 'ok_btn',
				}
			)
				.then(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				})
				.catch(() => {
					this.$message({
						type: 'success',
						message: '删除成功!',
					});
				});
		},
		//获取页码
		handleCurrentChange(pages) {
			this.pageNo = pages;
			this.onChanges();
		},
		handleSizeChange(pagesize) {
			this.pageSize = pagesize;
		},
		//查询屏幕高度自适应
		changeFixed(data) {
			if (this.$refs.box_rHeight) {
				this.$refs.box_rHeight.style.height = data - 295 + 'px';
				this.$refs.box_rHeight.style.minHeight = 500 + 'px';
			}
		},
		// 表头样式设置
		headClass() {
			return 'text-align: center;background:#E8F3FF;';
		},
		// 表格样式设置
		rowClass() {
			return 'text-align: center;';
        },
        //过期样式设置
        tableRowClassName(row){
            if (row.row.order_type ==1||row.row.order_type ==2) {
 		        return 'yu-row';
            }
            else{
                return 'info-row';
            }
        }
	},
};
</script>

<style lang="scss" scoped>
.order_list_com {
	width: 100%;
	text-align: left;
	box-sizing: border-box;
	padding: 30px 25px;
	background-color: #fff;
	.con_top {
		box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
		box-sizing: border-box;
		padding: 20px 30px;
		.t_title {
			// margin-bottom: 20px;
			font-size: 16px;
            font-weight: 500;
            width: 100%;
            height: 60px;
            line-height: 70px;
            text-align: left;
            font-size: 18px;
            color: #202020;
		}
		.title_seach {
			display: flex;
			justify-content: start;
			align-items: center;
			white-space: nowrap;
			.search_left {
				width: 65%;
				padding-bottom: 20px;
				.item_title {
                        margin-right: 5px;
                        margin-left: 20px;
						font-size: 14px;
					}
			}
			.search_right {
				flex: 1;
				padding-bottom: 20px;
				text-align: right;
			}
		}
	}
	.con_table {
		margin-top: 15px;
		flex: 1;

		box-shadow: 0px 0px 6px 0px rgba(51, 51, 51, 0.16);
		padding: 40px;
		.content_top {
			text-align: right;
			img {
				width: 80%;
			}
		}
		.content_bottom {
			margin-top: 20px;
			text-align: right;
        }
        .used{
            color: #EE9415;
            background: #FFF3E2;
            padding: 5px 10px;
            border-radius: 2px;
        }
        .using{
            color: #297AFF;
            background: #E8F3FF;
            padding: 5px 10px;
            border-radius: 2px;
        }
        .completed{
            color: #999999;
        }
        .expired{
            color: #999999;
        }
       

	}
}
</style>
