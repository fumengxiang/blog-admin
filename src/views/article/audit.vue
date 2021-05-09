<template>
  <div class="audit-container">
    <el-dialog :title="title" :visible.sync="visible" width="70%" :before-close="handleClose">
      <el-form ref="formData" :model="formData" label-width="100px" label-position="right" status-icon>
        <el-form-item label="标题：" size="small">
          <el-input v-model="formData.title" readonly></el-input>
        </el-form-item>
        <el-form-item label="标签：" size="small">
          <el-cascader
            disabled
            style="display: block"
            v-model="formData.labelIds"
            :options="labelOptions"
            :props="{ multiple: true, emitPath: false, children: 'labelList', value: 'id', label: 'name' }"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="主图：" size="small">
          <img :src="formData.imageUrl" alt="文章配图" style="width: 178px; height: 178px; display: block;">
        </el-form-item>
        <el-form-item label="是否公开：" size="small">
          <!-- 在element-ui中，此标签的label即为此单选框的值 -->
          <el-radio-group v-model="formData.ispublic" disabled>
            <el-radio :label="0">不公开</el-radio>
            <el-radio :label="1">公开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="简介：" size="small">
          <el-input type="textarea" v-model="formData.summary"></el-input>
        </el-form-item>
        <el-form-item label="内容：" size="small">
          <mavon-editor v-model="formData.htmlContent" :editable="false"/>
        </el-form-item>
        <el-form-item align="center" v-if="isAudit">
          <el-button type="primary" @click="auditSuccess(auditId)" size="large">审核通过</el-button>
          <el-button type="danger" size="large" @click="auditFail(auditId)">审核不通过</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/article'
import categoryLabelApi from '@/api/category'
import { mavonEditor } from 'mavon-editor' // 解构
import 'mavon-editor/dist/css/index.css'
export default {
  name: 'Audit',
  data () {
    return {
      formData: {},
      labelOptions: []
    }
  },
  components: {
    mavonEditor
  },
  watch: { // 监听数值的变化
    visible(val) { // 一旦变量visible发生变化，就执行此方法，变化后的值以参数传入
      if (val) {
        this.getArticleById(this.auditId) // 获取文章详情
        this.getArticleLabel()
      }
    }
  },
  // 父组件传入的值子组件不能修改，因为数据源在父组件中
  props: {
    auditId: null,
    isAudit: true, // 是否是审核页面
    title: { // 父组件传入的弹窗信息
      type: String,
      default: ''
    },
    visible: { // 弹出窗口
      type: Boolean,
      default: false
    },
    remoteClose: Function, // 父组件传递的函数
  },
  methods: {
    handleClose() {
      this.$refs['formData'].resetFields()
      this.remoteClose()
    },
    // 审核通过
    auditSuccess(id) {
      this.$confirm('此操作将使文章审核通过, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await api.auditSuccess(id)
          if (code === 20000) {
            this.$message({
              type: 'success',
              message: '审核通过，操作成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '操作失败'
            })
          }
          this.remoteClose()
        }).catch(() => {
          // 取消删除不用理会 
        })
    },
    // 审核不通过
    auditFail(id) {
      this.$confirm('此操作将使文章审核不通过, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await api.auditFail(id)
          if (code === 20000) {
            this.$message({
              type: 'success',
              message: '审核不通过，操作成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '操作失败'
            })
          }
          this.remoteClose()
        }).catch(() => {
          // 取消删除不用理会 
        })
    },
    getArticleById(id) {
      api.getById(id).then(res => {
        this.formData = res.data
      })
    },
    async getArticleLabel() {
      const res = await categoryLabelApi.getCategoryAndLabel()
      this.labelOptions = res.data
    }
  }
}
</script>

<style scoped lang="scss">

</style>
