<template>
  <div class="edit-container">
    <el-dialog :title="title" :visible.sync="visible" width="500px" :before-close="handleClose">
      <el-form ref="formData" :rules="rules" :model="formData" label-width="100px" label-position="right" style="width: 400px" status-icon>
        <el-form-item label="分类名称" size="small" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <!-- 在element-ui中，此标签的label即为此单选框的值 -->
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">禁止</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" size="small" prop="sort">
          <el-input-number v-model="formData.sort" :min="1" :max="10" style="width: 200px"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" size="small" prop="remark">
          <el-input type="textarea" v-model="formData.remark"></el-input>
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
import api from '@/api/category'
export default {
  name: 'Edit',
  data () {
    return {
      // 表单校验规则
      rules: {
        name: [ // 此键值对应表单项中的prop值
          {required:true, message: '请输入分类名称', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请输入状态信息', trigger: 'change'}
        ],
        sort: [
          {required: true, message: '请输入排序信息', trigger: 'change'}
        ]
      }
    }
  },
  // 父组件传入的值子组件不能修改，因为数据源在父组件中
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
    }
  },
  methods: {
    // 关闭窗口触发的事件, 因为子组件不能修改父组件的数据，所以可以定父组件的函数，在父组件中修改数据
    handleClose() {
      // 清空表单
      this.$refs['formData'].resetFields()
      this.remoteClose() // 调用父组件的函数关闭弹窗
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
      let response = null
      // 此组件是编辑与新增复用的，用ID判断是否是编辑
      if (this.formData.id) {
        response = await api.update(this.formData)
      } else {
        response = await api.add(this.formData)
      }
      // console.log(response)
      if (response.code === 20000) {
        // element-ui中的消息提示
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.handleClose()
      } else {
        this.$message({
          message: '保存失败',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>