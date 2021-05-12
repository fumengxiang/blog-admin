<template>
  <div class="edit-container">
    <el-dialog :title="title" :visible.sync="visible" width="500px" :before-close="handleClose">
      <el-form ref="formData" :rules="rules" :model="formData" label-width="100px" label-position="right" style="width: 400px" status-icon>
        <el-form-item label="用户名:" size="small" prop="username">
          <el-input v-model="formData.username" maxlength="30" />
        </el-form-item>
        <el-form-item label="昵称:" prop="nickName" size="small">
          <el-input v-model="formData.nickName" maxlength="30" />
        </el-form-item>
        <el-form-item label="手机号:" size="small" prop="mobile">
          <el-input v-model="formData.mobile" maxlength="11" minlength="11" />
        </el-form-item>
        <el-form-item label="邮箱:" size="small" prop="email">
          <el-input v-model="formData.email" maxlength="30" />
        </el-form-item>
        <el-form-item label="账号过期:" prop="isAccountNonExpired" size="small">
          <!-- 在element-ui中，此标签的label即为此单选框的值 -->
          <el-radio-group v-model="formData.isAccountNonExpired">
            <el-radio :label="1" border>正常</el-radio>
            <el-radio :label="0" border>已过期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号锁定:" prop="isAccountNonLocked" size="small">
          <!-- 在element-ui中，此标签的label即为此单选框的值 -->
          <el-radio-group v-model="formData.isAccountNonLocked">
            <el-radio :label="1" border>正常</el-radio>
            <el-radio :label="0" border>已锁定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码过期:" prop="isCredentialsNonExpired" size="small">
          <!-- 在element-ui中，此标签的label即为此单选框的值 -->
          <el-radio-group v-model="formData.isCredentialsNonExpired">
            <el-radio :label="1" border>正常</el-radio>
            <el-radio :label="0" border>已过期</el-radio>
          </el-radio-group>
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
import { add, update } from '@/api/user'
export default {
  name: 'Edit',
  data () {
    return {
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}, // blur 表示失去焦点触发验证
          {min: 3, max: 30, message: '用户名长度应该为6-30个字符', trigger: 'blur'}
        ],
        nickName:  [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        isAccountNonExpired: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        isAccountNonLocked: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        isCredentialsNonExpired: [
          {required: true, message: '请选择', trigger: 'change'}
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
      default: ()=>{}
    }
  },
  created () {},
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
    handleClose() {
      this.$refs['formData'].resetFields() // 重置表单
      this.remoteClose()
    },
    async submitData() {
      let res = null
      if (this.formData.id) {
        res = await update(this.formData)
      } else {
        // 新增用户初始密码与用户名相同
        this.formData.password = this.formData.username
        res = await add(this.formData)
      }
      if (res.code === 20000) {
        this.$message.success('操作成功')
        this.handleClose()
      } else {
        this.$message.error('操作失败')
      }
    }
  },
}
</script>

<style scoped lang="scss">

</style>
