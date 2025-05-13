<template>
	<div class="agricultural-product-management">
		<!-- 面包屑导航 -->
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>费用支出
				</el-breadcrumb-item>
				<el-breadcrumb-item>
					费用支出汇总
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>

        <div class="container">
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="value" label="支出金额" align="center"></el-table-column>
                <el-table-column prop="proportion" label="占比" align="center"></el-table-column>
            </el-table>
            <eCost class="etable"></eCost>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import eCost from '@/components/views/eTables/eCostSummary';
export default {
    name:'AgriculturalProductManagement',
    data(){
        return{
            tableData:[]
        }
    },
    components:{
        eCost
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            axios.get("/costSummary.json").then(res => {
                console.log(res.data);
                this.tableData = res.data;
            }).catch((error) => {
                console.error('数据获取失败：',error);
                this.$message.error('获取数据失败，请稍后重试')
            });
        }
    }
}
</script>

<style scoped>
.table {
    font-size: 14px;
    width: 45%;
    display: inline-block;
}
.etable {
    display: inline-block;
}
</style>