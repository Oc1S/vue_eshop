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
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许位第三级分类设置相关参数"
        :closable="false"
        type="warning"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <span>选择商品分类：</span>
        <!-- 选择商品分类的级联选择器 -->
        <el-cascader
          v-model="selectedKeys"
          :options="cateList"
          :props="cateProps"
          @change="handleChange"
        ></el-cascader>
      </el-row>

      <!-- 商品分类页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            size="medium"
            :disabled="isBtnDisabled"
            @click="isAddParamsDialogVisible = true"
            >添加参数</el-button
          >

          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- 参数名称列 -->
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="medium"
            :disabled="isBtnDisabled"
            @click="isAddParamsDialogVisible = true"
            >添加属性</el-button
          >

          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- 参数名称列 -->
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="isAddParamsDialogVisible"
      width="40%"
      @close="handleAddParamsDialogClosed"
    >
      <!-- 添加参数对话框表单 -->
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input
            v-model="addParamsForm.attr_name"
            @keyup.enter="addParams"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 添加参数对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="isEditDialogVisible"
      width="40%"
      @close="handleEditDialogClosed"
    >
      <!-- 修改参数对话框表单 -->
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input
            v-model="editParamsForm.attr_name"
            @keyup.enter="editParams"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 修改参数对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择器接收
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        expandTrigger: 'hover',
      },
      // 级联选择器选中对象
      selectedKeys: [],
      // 页签默认显示tab名称
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      //控制添加参数对话框是否可见
      isAddParamsDialogVisible: false,
      // 添加参数表单数据对象
      addParamsForm: {
        attr_name: '',
      },
      // 添加参数表单验证规则对象
      addParamsFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur',
          },
        ],
      },
      // 控制修改参数对话框是否可见
      isEditDialogVisible: false,
      //修改表单对象
      editParamsForm: {
        attr_name: '',
      },
      // 修改表单规则对象
      editParamsFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur',
          },
        ],
      },
      // 控制添加动态参数tag按钮
      inputVisible: false,
      inputValue: '',
    }
  },
  methods: {
    // 取得商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败')

      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择器选中项改变触发
    handleChange() {
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
    },
    // 取得参数
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.oneTableData = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 控制文本框显示与隐藏
        this.$set(item, 'inputVisible', false)
        // item.inputVisible = false
        // 文本框中输入的值
        this.$set(item, 'inputValue', '')
        // item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    //处理添加参数对话框关闭事件
    handleAddParamsDialogClosed() {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 添加动态参数、静态属性
    addParams() {
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getParamsData()
        this.isAddParamsDialogVisible = false
      })
    },
    //点击按钮，展示修改对话框
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) this.$message.error('获取参数信息失败')
      console.log(res.data)
      this.editParamsForm = res.data
      this.isEditDialogVisible = true
    },
    // 重置修改的表单
    handleEditDialogClosed() {
      this.$refs.editParamsFormRef.resetFields()
    },
    editParams() {
      this.$refs.editParamsFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getParamsData()
        this.isEditDialogVisible = false
      })
    },

    // 根据id删除选中参数项
    async removeParam(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      //用户取消操作
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      //删除的业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除参数失败')
      this.$message.success('删除参数成功')
      this.getParamsData()
    },

    // 文本框失焦或按下回车后确认动态属性tag
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },

    // 点击展示修改参数文本输入框
    showInput(row) {
      // 展示tag文本输入框
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 删除对应的参数可选项
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },

    //保存参数可选项
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(','),
        }
      )
      if (res.meta.status !== 200) return this.$message.error('修改参数项失败')
      this.$message.success('修改参数项成功')
    },
  },

  computed: {
    // 未选中三级分类时禁用按钮
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) return true
      return false
    },

    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },

    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    },
  },
  created() {
    this.getCateList()
  },
}
</script>



<style lang="scss" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-row {
  span {
    cursor: default;
  }
}
.el-cascader {
  width: 300px;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 150px;
}
.button-new-tag,
.input-new-tag {
  margin: 0 10px;
}
</style>