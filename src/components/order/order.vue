<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <template v-slot:append>
              <el-button icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editLocation"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="isEditDialogVisible"
      width="30%"
      @close="addressDialogClosed"
    >
      <!-- 表单 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <!-- 修改地址对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isEditDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 查看进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="30%"
    >
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1,
      },
      // 订单列表
      orderList: [],
      total: 0,
      isEditDialogVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区/县',
            trigger: 'blur',
          },
        ],
        address2: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur',
          },
        ],
      },
      cityData,
      // 当前物流进度对话框可见
      progressDialogVisible: false,
      // 物流信息
      progressInfo: [],
      activities: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15',
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13',
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11',
        },
      ],
    }
  },
  methods: {
    // 取得订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取订单列表失败')
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },

    // 改变页面大小
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    // 改变当前页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },

    // 点击按钮修改
    editLocation() {
      this.isEditDialogVisible = true
    },

    // 关闭修改地址对话框
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },

    // 点击按钮显示当前进度对话框
    async showProgress() {
      this.progressDialogVisible = true
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200)
        return this.$message.error('获取物流进度失败')
      this.progressInfo = res.data
      console.log(this.progressInfo)
    },
  },
  created() {
    this.getOrderList()
  },
}
</script>

<style>
</style>