<template>
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>
                <i class="el-icon-lx-cascades"></i>基本信息
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                简介信息
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="container">
            <el-form ref="form" label-width="150px" :Model="form">
                <div style="width: 50rem;">
                    <el-form-item label="智慧农业公司简介">
                        <el-input v-model="form.introduction" type="textarea" rows="7" maxlength="300" show-word-limit></el-input>
                    </el-form-item>
                </div>
                <div style="width:20rem;">
                    <el-form-item label="合作农田">
                        <el-input v-model="form.farmland"></el-input>
                    </el-form-item>
                </div>
                <div style="width:20rem;">
                    <el-form-item label="合作农户">
                        <el-input v-model="form.farmer"></el-input>
                    </el-form-item>
                </div>
                <div style="width:20rem;">
                    <el-form-item label="年总产值">
                        <el-input v-model="form.grossAnnualValue" ></el-input>
                    </el-form-item>
                </div>
                <div style="width:20rem;">
                    <el-form-item label="耕地面积">
                        <el-input v-model="form.cultivatedArea"></el-input>
                    </el-form-item>
                </div>
                <div style="width:20rem;">
                    <el-form-item label="经济作物种类">
                        <el-input v-model="form.species"></el-input>
                    </el-form-item>
                </div>
                <div style="width:20rem;">
                    <el-form-item label="技术专家">
                        <el-input v-model="form.technologist"></el-input>
                    </el-form-item>
                </div>
                <div style="width:50rem">
                    <el-form-item>
                        <el-row>
                            <el-col :span="6">
                                <el-button type="primary" @click="onsubmit">表单提交</el-button>
                                <el-button>取消</el-button>
                            </el-col>
                            <el-col :span="3">
                                <el-input type="reset">重置</el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>

</template>

<script>
import axios from 'axios'
import { Model } from 'echarts/lib/export';
export default {
    name: "Introduction",
    data(){
        return{
            form:{
                introduction:'',
                farmland:'',
                farmer:'',
                grossAnnualValue:'',
                ultivatedArea:'',
                species:'',
                technologist:''
            }
        }
    },
    created(){
        this.getData();
    },
    methods: {
        getData(){//获取本地js数据
            axios.get("/introduction.json").then(res=>{
                console.log(res.data);
                this.form = res.data;
            });
        },
        onsubmit(){
            this.$message.success('提交成功');
        }
    },
}
</script>

<style></style>