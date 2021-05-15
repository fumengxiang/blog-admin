<template>
  <div class="password-container">
    <el-dialog :title="title" :visible.sync="visible" width="400px" :before-close="handleClose">
      <el-form ref="formData" :rules="rules" :model="formData" label-width="100px" label-position="right" style="width: 300px" status-icon>
        <el-form-item label="新密码:" size="small" prop="newPassword">
          <el-input v-model="formData.newPassword" type="password" placeholder="请输入新密码" maxlength="30" />
        </el-form-item>
        <el-form-item label="确认密码:" prop="samePassword" size="small">
          <el-input v-model="formData.samePassword" type="password" placeholder="请再次输入密码" maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submitForm('formData')">确定</el-button>
          <el-button size="small" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { changePassword } from '@/api/user'
export default {
  name: 'Password',
  props: {
    userId: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    remoteClose: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    // 自定义校验器，校验两次输入的密码是否相同
    const validateRepPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      formData: {},
      rules: {
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '密码需要在6-30个字符之间', trigger: 'blur' }
        ],
        samePassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateRepPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
      this.formData.userId = this.userId
      const { code, message } = await changePassword(this.formData)
      if (code === 20000) {
        this.$message.success('修改成功')
        this.handleClose()
      } else {
        this.$message.error(message)
      }
    },
    handleClose() {
      this.formData = {}
      this.remoteClose()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
