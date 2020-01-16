<template>
	<div class="hello">
		<div class="top_title">
			<span @click="goback" style="font-size: 24px;color: #202020;"
				><i
					class="el-icon-arrow-left"
					style="color:#297AFF;font-size: 18px;margin-right:23px;font-weight: 600;"
				></i>
				批量导入URL</span
			>
		</div>
		<uploader
			:options="options"
			:autoStart="false"
			:file-status-text="statusText"
			class="uploader-example"
			@file-success="onFileSuccess"
			@file-added="filesAdded"
		>
			<uploader-unsupport></uploader-unsupport>
			<uploader-drop class="upload">
				<uploader-btn :single="true" :attrs="attrs"
					>上传Excel表格</uploader-btn
				>
				<button @click="dolow" class="dol_btn">下载模板</button>
			</uploader-drop>
			<uploader-list></uploader-list>
		</uploader>
		<el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
			<div v-for="item in message" class="cerr">
				<span>{{ item.url }}</span
				><span>{{ item.state }}</span>
			</div>
			<span slot="footer" class="dialog-footer">
				<!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
				<el-button type="primary" @click="dialogVisible = false"
					>确 定</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import SparkMD5 from 'spark-md5';

export default {
	name: 'HelloWorld',
	data() {
		return {
			dialogVisible: false,
			title: '',
			message: [],
			options: {
				target: 'http://39.100.131.247/url_mgmt/excel_url', //SpringBoot后台接收文件夹数据的接口
				testChunks: false, //是否测试分片
				fileParameterName: 'excel'
			},
			attrs: {
				accept: 'document/*'
			},
			statusText: {
				success: '上传成功',
				error: '上传错误',
				uploading: '上传中',
				paused: '暂停中',
				waiting: '等待中'
			}
		};
	},
	props: {
		msg: String
	},
	methods: {
		dolow() {
			var url = 'http://39.100.131.247/static/url.xls';
			window.location.href = url;
		},
		//
		goback() {
			this.$router.go(-1);
		},
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},
		onFileSuccess: function(rootFile, file, response, chunk) {
			let res = JSON.parse(response);
			this.message = [];
			this.title = '';
			if (res.status == 0) {
				if (res.data.failed_count == 0) {
					this.$message({
						showClose: true,
						message: '全部插入成功',
						type: 'success'
					});
				} else {
					this.dialogVisible = true;
					this.title = res.data.failed_count + '条数据插入失败';
					res.data.res_data.forEach((item, index) => {
						let curl = {};
						curl.url = item[0];
						if (this.message.push(item[1]) == false) {
							curl.state = '插入失败';
						}
						this.message.push(curl);
					});
				}
			} else {
				this.$message({
					showClose: true,
					message: '服务器响应超时',
					type: 'error'
				});
			}
		},
		/**
		 * 计算md5，实现断点续传及秒传
		 * @param file
		 */
		computeMD5(file) {
			//大文件的md5计算时间比较长，显示个进度条
			const loading = this.$loading({
				lock: true,
				text: '正在计算MD5',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
			let fileReader = new FileReader();
			let time = new Date().getTime();
			let blobSlice =
				File.prototype.slice ||
				File.prototype.mozSlice ||
				File.prototype.webkitSlice;
			let currentChunk = 0;
			const chunkSize = 10 * 1024 * 1000;
			let chunks = Math.ceil(file.size / chunkSize);
			let spark = new SparkMD5.ArrayBuffer();
			file.pause();

			loadNext();

			fileReader.onload = e => {
				spark.append(e.target.result);
				if (currentChunk < chunks) {
					currentChunk++;
					loadNext();
					// 实时展示MD5的计算进度
					this.$nextTick(() => {
						// console.log(
						//   "校验MD5 " + ((currentChunk / chunks) * 100).toFixed(0) + "%"
						// );
					});
				} else {
					let md5 = spark.end();
					loading.close();
					this.computeMD5Success(md5, file);
					// console.log(
					//   `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
					//     file.size
					//   } 用时：${new Date().getTime() - time} ms`
					// );
				}
			};
			fileReader.onerror = function() {
				this.error(`文件${file.name}读取出错，请检查该文件`);
				loading.close();
				file.cancel();
			};
			function loadNext() {
				let start = currentChunk * chunkSize;
				let end =
					start + chunkSize >= file.size
						? file.size
						: start + chunkSize;
				fileReader.readAsArrayBuffer(
					blobSlice.call(file.file, start, end)
				);
			}
		},

		computeMD5Success(md5, file) {
			file.uniqueIdentifier = md5; //把md5值作为文件的识别码
			file.resume(); //开始上传
		},
		/**
		 * 添加文件后触发
		 * @param file
		 * @param event
		 */
		filesAdded(file, event) {
			this.computeMD5(file);
		}
	}
};
</script>

<style>
.uploader-example {
	width: 90%;
	padding: 15px 37px;
	margin: 40px auto 0;
	font-size: 12px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.uploader-example .uploader-btn:nth-child(1) {
	margin-right: 4px;
	width: 115px;
	height: 28px;
	color: #fff;
	line-height: 28px;
	background: #297aff;
	border: #297aff;
	text-align: center;
	border-radius: 2px;
}

.uploader-example .uploader-list {
	max-height: 343px;
	overflow: auto;
	overflow-x: hidden;
	overflow-y: auto;
	margin-top: 10px;
}
.uploader-example .uploader-list ul {
	height: 343px;
	border: 1px solid rgba(201, 203, 208, 1);
	border-radius: 2px;
}

.uploader-example {
	width: 1240px;
	height: 489px;
	margin: 0 auto;
	margin-top: 20px;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 2px 3px 0px rgba(6, 17, 36, 0.14);
	border-radius: 2px;
}
.upload {
	text-align: left;
	background-color: #fff !important;
	border: none !important;
}
.dol_btn {
	width: 85px;
	height: 36px;
	line-height: 36px;
	border: 1px solid rgba(41, 122, 255, 1);
	color: #297aff;
	background-color: #fff;
	text-align: center;
	border-radius: 2px;
}
</style>
