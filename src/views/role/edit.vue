<template>
  <div class="edit-container">
    <el-dialog :title="title" :visible.sync="visible" width="500px" :before-close="handleClose">
      <el-form ref="formData" :rules="rules" :model="formData" label-width="100px" label-position="right" style="width: 400px" status-icon>
        <el-form-item label="角色名称:" size="small" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="备注:" size="small" prop="remark">
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
import api from '@/api/role'
export default {
  name: 'Edit',
  data () {
    return {
      rules: {
        name: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ]
      }
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    },
    remoteClose: Function
  },
  created() {},
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
      this.$refs['formData'].resetFields()
      this.remoteClose()
    },
    async submitData() {
      let res = null
      if (this.formData.id) {
        res = await api.update(this.formData)
      } else {
        res = await api.add(this.formData)
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
