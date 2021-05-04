<template>
  <div class="edit-container">
    <el-dialog :title="title" :visible.sync="visible" width="400px" :before-close="handleClose">
      <el-form ref="formData" :rules="rules" :model="formData" label-width="100px" label-position="right" style="width: 300px" status-icon>
        <el-form-item label="标签名称" size="small" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryId" size="small">
          <el-select v-model="formData.categoryId" clearable filterable>
            <el-option v-for="item in categoryList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formData')" size="small">确定</el-button>
          <el-button size="small" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/label'
export default {
  name: 'Edit',
  data () {
    return {
      rules: {
        name: [
          {required: true, message: '请输入标签名称', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '请选择分类名称', trigger: 'change'}
        ]
      }
    }
  },
  props: {
    title: { // 父组件传入的弹窗信息
      type: String,
      default: ''
    },
    visible: { // 弹出窗口
      type: Boolean,
      default: false
    },
    remoteClose: Function, // 父组件传递的函数
    formData: { // 表单数据
      type: Object,
      default: {}
    },
    categoryList: {
      type: Array,
      default: []
    }
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$refs['formData'].resetFields() // 清空表单
      this.remoteClose()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过，提交数据
          this.submitData()
        } else {
          console.log('error submit')
          return false
        }
      })
    },
    async submitData() {
      let res = null
      if (this.formData.id) {
        res = await api.updata(this.formData)
      } else {
        res = await api.add(this.formData)
      }
      if (res.code === 20000) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.handleClose()
      } else {
        this.$message({
          message: '保存成功',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>