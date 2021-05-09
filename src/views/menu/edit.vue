<template>
  <div class="edit-container">
    <el-dialog :title="title" :visible.sync="visible" width="500px" :before-close="handleClose">
      <el-form ref="formData" :rules="rules" :model="formData" label-width="100px" label-position="right" style="width: 400px" status-icon>
        <el-form-item label="类型:" size="small" prop="type">
           <!-- 在element-ui中，此标签的label即为此单选框的值 -->
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3" v-if="formData.parentId !== 0">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称:" size="small" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限标识:" size="small">
          <el-input v-model="formData.code"></el-input>
        </el-form-item>
        <!-- 点击按钮时隐藏 -->
        <el-form-item label="请求地址:" prop="url" size="small" v-if="formData.type !== 3">
          <el-input v-model="formData.url"></el-input>
        </el-form-item>
        <!-- 点击按钮时隐藏 -->
        <el-form-item label="图标:" prop="icon" size="small" v-if="formData.type !== 3">
          <el-input v-model="formData.icon"></el-input>
        </el-form-item>
        <el-form-item label="排序" size="small">
          <el-input-number v-model="formData.sort" :min="1" :max="10" style="width: 200px"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" size="small">
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
import api from '@/api/menu'
export default {
  name: 'Edit',
  data () {
    return {
      // 表单校验规则
      rules: {
        type: [ // 此键值对应表单项中的prop值
          {required: true, message: '请选择类型', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入权限标识', trigger: 'blur'}
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
      default: () => {}
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 当增加的是按钮时，请求地址，图标应为空
          if (this.formData.type === 3) {
            this.formData.url = ''
            this.formData.icon = ''
          }
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
        res = await api.update(this.formData)
      } else {
        res =  await api.add(this.formData)
      }
      if (res.code === 20000) {
        this.$message.success('保存成功')
      } else {
        this.$message.error('保存失败')
      }
      this.remoteClose()
    },
    // 关闭窗口
    handleClose() {
      // 清空表单数据
      this.$refs['formData'].resetFields()
      this.remoteClose()
    }
  },
  created () {}
}
</script>

<style scoped lang="scss">

</style>
