<template>
	<div class="agricultural-product-management">
		<!-- 面包屑导航 -->
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>费用支出
				</el-breadcrumb-item>
				<el-breadcrumb-item>
					费用支出数据
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>

		<div class="container">
			<!-- 操作栏 -->
			<div class="handle-box">
				<el-button type="primary" icon="el-icon-delete mr10" @click="deleteAllSelection">
					批量删除
				</el-button>

				<el-select v-model="query.productCategory" placeholder="支出类型" class="header-select mr10">
					<el-option key="-1" label="全部" value="全部"></el-option>
					<el-option key="1" label="化肥" value="化肥"></el-option>
					<el-option key="2" label="农药" value="农药"></el-option>
                    <el-option key="3" label="技术研发" value="技术研发"></el-option>
                    <el-option key="4" label="种子" value="种子"></el-option>
                    <el-option key="5" label="人工成本" value="人工成本"></el-option>
				</el-select>

				<el-input v-model="query.productName" placeholder="产品名称" class="header-input mr10"></el-input>

				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="success" icon="el-icon-plus" class="header-add mr10" @click="handleAdd">新增</el-button>
			</div>

			<!-- 数据表格 -->
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
				@selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="CostInfo" width="55" label="ID" align="center"></el-table-column>
				<el-table-column prop="value" label="支出类型"></el-table-column>
				<el-table-column prop="attr3" label="产品名称"></el-table-column>
				<el-table-column prop="attr4" label="支出"></el-table-column>

				<!-- 操作列 -->
				<el-table-column label="操作" width="180" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
						</el-button>
						<el-button type="text" icon="el-icon-delete" class="red"
							@click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页控件 -->
			<div class="pagination">
				<el-pagination background layout="total, sizes, prev, pager, next, jumper"
					:current-page="query.pageIndex" :page-size="query.pageSize" :page-sizes="[5, 10, 15, 20]"
					:total="pageTotal" @current-change="handlePageChange" @size-change="handleSizeChange">
				</el-pagination>
			</div>
		</div>

		<!-- 合并后的编辑/新增对话框 -->
		<el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
			<el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
				<el-form-item label="产品名称" prop="attr3">
					<el-input v-model="form.attr3"></el-input>
				</el-form-item>
				<el-form-item label="支出类型" prop="value">
					<el-select v-model="form.value">
						<el-option key="1" label="化肥" value="化肥"></el-option>
					<el-option label="农药" value="农药"></el-option>
                    <el-option label="技术研发" value="技术研发"></el-option>
                    <el-option label="种子" value="种子"></el-option>
                    <el-option label="人工成本" value="人工成本"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="支出" prop="attr4">
					<el-input v-model="form.attr4"></el-input>
				</el-form-item>
			</el-form>
            
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="saveEditAdd">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios';

	export default {
		name: 'AgriculturalProductManagement',
		data() {
			return {
				dialogTitle: '',
				query: {
					value: '',
					attr3: '',
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
				tableCopyTableList: [],
				isEdit: false, // 新增标识区分编辑和新增
				rules: {
					productName: [{
						required: true,
						message: '产品名称不能为空',
						trigger: 'blur'
					}]
				}
			};
		},
		created() {
			this.getData();
		},
		methods: {
			// 获取数据
			getData() {
				axios.get("/costInfo.json")
					.then(res => {
						console.log(res.data);
						this.tableData = res.data.list; // 有后端时，使用这一段
						this.pageTotal = res.data.pageTotal;
						this.tableCopyTableList = res.data.list; //（为模拟后端）
						this.tableData = this.currentChangePage(this.query.pageSize, this.query.pageIndex);
					})
					.catch(error => {
						console.error('获取数据失败:', error);
						this.$message.error('获取数据失败，请稍后重试');
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
			// 新增处理
			handleAdd() {
				const defaultData = {
					CostInfo: 0,
					value : '农药',
					attr3 : '',
					attr4 : '',
				};

				this.idx = -1;
				this.form = defaultData;
				this.dialogVisible = true;
				this.dialogTitle = '新增';
				this.isEdit = false;
			},

			// 删除处理
			handleDelete(index, row) {
				this.$confirm('确定要删除吗？', '提示', {
					type: 'warning'
				}).then(() => {
					// 实际项目中应调用后端API
					this.tableData.splice(index, 1);
					this.$message.success('删除成功');
				}).catch(() => {});
			},

			// 多选变化处理
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			// 批量删除处理
			deleteAllSelection() {
				const length = this.multipleSelection.length;
				if (length === 0) {
					this.$message.warning('请先选择要删除的数据');
					return;
				}

				let str = '';
				this.delList = this.delList.concat(this.multipleSelection);

				for (let i = 0; i < length; i++) {
					str += this.multipleSelection[i].productName + ' ';
				}

				this.$confirm(`确定要删除 ${str} 吗？`, '提示', {
					type: 'warning'
				}).then(() => {
					// 实际项目中应调用后端API
					this.multipleSelection.forEach(item => {
						const index = this.tableData.findIndex(row => row.id === item.id);
						if (index !== -1) {
							this.tableData.splice(index, 1);
						}
					});

					this.$message.success(`删除了${str}`);
					this.multipleSelection = [];
				}).catch(() => {});
			},

			// 编辑处理
			handleEdit(index, row) {
				this.idx = index;
				this.form = {
					...row
				}; // 复制对象，避免直接修改原数据
				this.dialogVisible = true;
				this.dialogTitle = '编辑';
				this.isEdit = true;
			},

			// 保存编辑/新增
			saveEditAdd() {
				this.$refs.formRef.validate((valid) => {
					if (valid) {
						this.dialogVisible = false;

						if (!this.isEdit) { // 新增
							// 生成新ID
							const newId = Math.max(0, ...this.tableData.map(item => item.id)) + 1;
							this.form.id = newId;

							// 添加到表格数据
							this.tableData.push(this.form);
							this.$message.success('新增成功');
						} else { // 编辑
							// 更新表格数据
							this.$set(this.tableData, this.idx, this.form);
							this.$message.success('修改成功');
						}

						// 更新复制的数据
						this.tableCopyTableList = [...this.tableData];
					} else {
						return false;
					}
				});
			},

			// 模拟分页方法（实际项目中应由后端处理）
			currentChangePage(size, current) {
				const start = size * (current - 1);
				const end = size * current;
				return this.tableCopyTableList.slice(start, end);
			}
		}
	}
</script>

<style scoped>
	.mr10 {
		margin-right: 10px;
	}

	.handle-box {
		margin-bottom: 20px;
	}

	.header-select {
		width: 120px;
	}

	.header-input {
		width: 300px;
		display: inline-block;
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.table-td-thumb {
		display: block;
		margin: auto;
		width: 40px;
		height: 40px;
	}

	.red {
		color: #ff0000;
	}
</style>
