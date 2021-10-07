<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-button type="primary" @click="showAddCateDialog"
          >添加分类</el-button
        >
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
        stripe
      >
        <template v-slot:isvalid="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: green"></i>
        </template>
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template v-slot:option>
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="isAddCateDialogVisible"
      width="40%"
      @close="handleAddCateDialogClose"
    >
      <!-- 添加分类对话框表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 添加分类对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询商品分类参数
      queryInfo: {
        type: 3,
        pegenum: 1,
        pagesize: 10,
      },
      // 商品分类数据列表
      cateList: [],
      //总数据条数
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isvalid',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'option',
        },
      ],
      // 控制添加分类对话框可见
      isAddCateDialogVisible: false,
      // 添加分类表单数据对象
      addCateForm: {
        // 将要添加分类的名称
        cat_name: '',
        // 将要添加分类的等级，默认添加一级分类
        cat_level: 0,
        // 父级分类的id
        cat_pid: 0,
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
        ],
      },
      parentCateList: [],
      // 级联选择器传入对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
      // 选中父级分类id数组
      selectedKeys: [],
    }
  },
  methods: {
    //取得商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败')
      console.log(res)
      this.cateList = res.data
      this.total = res.data.length
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      console.log(newSize)
      this.getCateList()
    },
    //监听pagesize改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 展示添加分类对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.isAddCateDialogVisible = true
    },
    // 获取父级分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取父级分类失败')
      this.parentCateList = res.data
    },
    // 父级分类选择项发生改变
    parentCateChange() {
      console.log(this.selectedKeys)
      // 修改当前父分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        // 修改当前分类等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = this.addCateForm.cat_level = 0
      }
      console.log(this.addCateForm)
    },
    // 监听添加分类对话框关闭
    handleAddCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_pid = this.addCateForm.cat_level = 0
      this.selectedKeys = []
    },
    // 点击按钮添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.isAddCateDialogVisible = false
      })
    },
  },
  created() {
    this.getCateList()
  },
}
</script>

<style>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>