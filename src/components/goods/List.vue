<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 查询和添加区域 -->
      <el-row :gutter="20">
        <!-- 查询输入框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable=""
            @clear="getGoodsList"
            @keyup.enter.native="getGoodsList"
          >
            <template v-slot:append>
              <el-button
                icon="el-icon-search"
                @click="getGoodsList"
              ></el-button>
            </template>
          </el-input>
        </el-col>
        <!-- 添加框 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" stripe border>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>

        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="150px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="150px"
        ></el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template></el-table-column
        >
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 页面商品列表数据
      goodsList: [],

      // 商品总数
      total: 0,

      // 查询商品列表参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 20,
      },
    }
  },
  methods: {
    // 取得商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },

    // 监听一页项数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },

    // 监听页码变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },

    // 通过id移除商品
    async removeById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除商品失败')
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    // 点击前往添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
  },
  created() {
    this.getGoodsList()
  },
}
</script>

<style lang="scss" >
</style>