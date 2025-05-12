<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>基本信息
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    技术资源
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="45" align="center"></el-table-column>
                <el-table-column prop="name" label="显示名称"></el-table-column>
                <el-table-column prop="value" label="显示值" width="90"></el-table-column>
                <el-table-column prop="unity" label="单位" width="70"></el-table-column>
                <el-table-column prop="code" label="CODE"></el-table-column>
                <el-table-column prop="status" label="状态" width="85" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === true ? 'success' : 'danger'">{{ scope.row.status === true ?
                            '启用' : '禁用' }}</el-tag>
                    </template>
                </el-table-column>
                <!-- 添加数据操作列 -->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button class="red" type="text" icon="el-icon-delete"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 编辑弹框 -->
        <el-dialog id="editDialog" :title="dialogTitile" :visible.sync="editDialogVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-input type="hidden" v-model="form.id"></el-input>
                <el-form-item label="显示名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="显示值">
                    <el-input v-model="form.value"></el-input>
                </el-form-item>
                <el-form-item label="单位">
                    <el-input v-model="form.unity"></el-input>
                </el-form-item>
                <el-form-item label="CODE">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.status"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveEditAdd">确定</el-button>
            </span>

        </el-dialog>
    </div>
</template>


<script>
import axios from 'axios';
export default {
    name: 'BaseResource',
    data() {
        return {
            tableData: [],
            editDialogVisible: false,
            dialogTitile: '',
            form: {},
            idx: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            axios.get("/baseResource.json").then(res => {
                console.log(res.data);
                this.tableData = res.data;

            });
        },
        // 删除数据
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(index, row);
                this.tableData.splice(index, 1);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 编辑数据
        handleEdit(index, row) {
            this.editDialogVisible = true;
            this.dialogTitile = "编辑";
            this.idx = index;
            this.form = row;
        },
        saveEditAdd() {
            this.editDialogVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        }

    }
}
</script>

<style>
.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #f00;
}
</style>