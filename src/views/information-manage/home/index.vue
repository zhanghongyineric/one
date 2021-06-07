<template>
    <div class="container">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="box">
                    
                </div>
            </el-col>
            <el-col :span="12">
                <div class="box">
                    
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 30px">
            <el-col :span="8">
                <div class="box">
                    
                </div>
            </el-col>
            <el-col :span="8">
                <div class="box">
                    
                </div>
            </el-col>
            <el-col :span="8">
                <div class="box">
                    
                </div>
            </el-col>
        </el-row>
        
    </div>
</template>

<script>
export default {
    name: 'InformationHome',
    data() {
        return {}
    }
}
</script>

<style scoped>
.container {
    padding: 20px;
}

.box {
    width: 100%;
    height: 400px;
    background-color: #fff;
}
</style>