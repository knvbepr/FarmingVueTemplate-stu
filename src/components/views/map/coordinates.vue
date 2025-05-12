<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-location"></i> 地图信息
				</el-breadcrumb-item>
				<el-breadcrumb-item>
					坐标数据
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
				</el-button>
				<el-input v-model="query.location" placeholder="地点" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="success" icon="el-icon-plus" class="handle-add mr10" @click="handleAdd">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
				@selection-change="handleSelectionChange" @filter-change="filterChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="location" label="地点"></el-table-column>
				<el-table-column prop="lng" label="经度"></el-table-column>
				<el-table-column prop="lat" label="维度"></el-table-column>
				<el-table-column label="状态" align="center" column-key="filterTag" :filters="getfilterStatusItem()">
					<template slot-scope="scope">
						<el-tag :type="scope.row.status? 'success' : 'danger'">{{scope.row.status ? '启用':'禁用'}}</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="180" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
						</el-button>
						<el-button type="text" icon="el-icon-delete" class="red"
							@click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, sizes, prev, pager, next, jumper" 
				:current-page="query.pageIndex"
					:page-size="query.pageSize" 
					:page-sizes="[5, 10, 15 ,20]"
					:total="pageTotal" 
					@current-change="handlePageChange"
					@size-change="handleSizeChange"></el-pagination>
			</div>
		</div>
		<!-- 编辑弹出框 -->
		<el-dialog id="dialogEdit" :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
			<el-form ref="form" :model="form" label-width="70px">
				<el-input type="hidden" v-model="form.id"></el-input>
				<el-form-item label="地点">
					<el-input v-model="form.location"></el-input>
				</el-form-item>
				<el-form-item label="经度">
					<el-input v-model="form.lng"></el-input>
				</el-form-item>
				<el-form-item label="维度">
					<el-input v-model="form.lat"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-switch v-model="form.status==1"></el-switch>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEditAdd">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'Coordinates',
		data() {
			return {
				dialogTitle: '',
				query: {
					location: '',
					pageIndex: 1,
					pageSize: 5
				},
				tableData: [],
				multipleSelection: [],
				delList: [],
				dialogVisible: false,
				pageTotal: 0,
				form: {},
				idx: -1,
				id: -1,
				tableCopyTableList: [] // 表格copy数据，仅仅为模拟分页效果
			};
		},
		created() {
			this.getData();
		},
		methods: {
			// 获取本地 json 数据
			getData() {
				axios.get("/coordinates.json").then(res => {
					console.log(res.data);
					this.tableData = res.data.list; // 有后端时，使用这一段
					this.pageTotal = res.data.pageTotal;
					this.tableCopyTableList = res.data.list; //（为模拟后端）
					this.tableData = this.currentChangePage(this.query.pageSize, this.query.pageIndex);
				});
			},
			// 触发搜索按钮
			handleSearch() {
				this.$set(this.query, 'pageIndex', 1);
				this.getData();
			},
			// 分页导航
			handlePageChange(val) {
				this.$set(this.query, 'pageIndex', val);
				this.getData();
			},
			// 新增操作
			handleAdd(index, row) {
				let defaultData = {
					id: 0,
					location: "",
					lng: 0,
					lat: 0,
					status: 0
				};
				this.idx = -1;
				this.form = defaultData;
				this.dialogVisible = true;
				this.dialogTitle = '新增';
			},
			// 删除操作
			handleDelete(index, row) {
				// 二次确认删除
				this.$confirm('确定要删除吗？', '提示', {
						type: 'warning'
					})
					.then(() => {
						this.$message.success('删除成功');
						this.tableData.splice(index, 1);
					})
					.catch(() => {});
			},
			// 多选操作
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			delAllSelection() {
				const length = this.multipleSelection.length;
				let str = '';
				this.delList = this.delList.concat(this.multipleSelection);
				for (let i = 0; i < length; i++) {
					str += this.multipleSelection[i].location + ' ';
				}
				this.$message.error(`删除了${str}`);
				this.multipleSelection = [];
			},
			// 编辑操作
			handleEdit(index, row) {
				this.idx = index;
				this.form = row;
				this.dialogVisible = true;
				this.dialogTitle = '编辑';
			},
			// 保存编辑
			saveEditAdd() {
				this.dialogVisible = false;
				if (this.idx < 0) { // 判断下标不存在时，为添加
					this.$message.success(`新增成功`);
					this.tableData.push(this.form);
				} else {
					this.$message.success(`修改第 ${this.idx + 1} 行成功`);
					this.$set(this.tableData, this.idx, this.form);
				}

			},
			//状态筛选（没有后台，只能用作显示）
			getfilterStatusItem() {
				let apiArr = [ // 从后端获取筛选的字段
					{
						text: "启用",
						value: 1
					},
					{
						text: "禁用",
						value: 0
					}
				];
				return apiArr; // return返回去
			},
			// 监听筛选项的变动（没有后台，无法真正实现功能）
			filterChange(filterObj) {
				console.log(filterObj.filterTag);
				if (filterObj.filterTag.length > 0) {
					console.log("点击筛选");
				} else {
					console.log("点击重置");
				}
			},
			// 分页数量改变事件
			handleSizeChange(pageSize) {
				this.query.pageSize = pageSize
				this.tableData = this.currentChangePage(pageSize, this.query.pageIndex)
			},
			// 页码改变切换
			handleCurrentChange(currentPage) {
				this.query.pageIndex = currentPage
				this.tableData = this.currentChangePage(this.query.pageSize, currentPage)
			},
			// 分页方法（该方法模仿后台，实现分页功能，仅仅模拟效果，没有意义）
			currentChangePage(size, current) {
				const tablePush = [];
				this.tableCopyTableList.forEach((item, index) => {
					if (size * (current - 1) <= index && index <= size * current - 1) {
						tablePush.push(item);
					}
				})
				return tablePush;
			}
		}
	};
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 300px;
		display: inline-block;
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.red {
		color: #ff0000;
	}

	.mr10 {
		margin-right: 10px;
	}

	.table-td-thumb {
		display: block;
		margin: auto;
		width: 40px;
		height: 40px;
	}
</style>
