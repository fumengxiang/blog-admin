<template>
  <div class="edit-container">
    <el-dialog :title="title" :visible.sync="visible" width="600px" :before-close="handleClose">
      <el-form ref="formData" :rules="rules" :model="formData" label-width="100px" label-position="right" style="width: 400px" status-icon>
        <el-form-item label="广告图片:" size="small" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="uploadMainImg">
            <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="广告标题:" prop="title" size="small">
          <el-input v-model="formData.title" ></el-input>
        </el-form-item>
        <el-form-item label="广告链接:" prop="advertUrl" size="small">
          <el-input v-model="formData.advertUrl" ></el-input>
        </el-form-item>
        <el-form-item label="跳转方式:" prop="advertTarget" size="small">
          <el-select v-model="formData.advertTarget" clearable style="width: 185px">
            <el-option label="新窗口打开" value="_blank"></el-option>
            <el-option label="当前窗口打开" value="_self"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" size="small" prop="status">
          <!-- 在element-ui中，此标签的label即为此单选框的值 -->
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">禁止</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告位置:" size="small" prop="position">
          <el-input-number v-model="formData.position" :min="1" :max="10" style="width: 200px"></el-input-number>
        </el-form-item>
        <el-form-item label="排序:" size="small" prop="sort">
          <el-input-number v-model="formData.sort" :min="1" :max="10" style="width: 200px"></el-input-number>
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
import commonApi from '@/api/common'
import api from '@/api/advert'
export default {
  name: 'Edit',
  data () {
    return {
      rules: {
        imageUrl: [
          {required: true, message: '请上传广告图片', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '请输入广告标题', trigger: 'blur'}
        ],
        advertUrl: [
          {required: true, message: '请输入广告地址', trigger: 'blur'}
        ],
        advertTarget: [
          {required: true, message: '请选择打开方式', trigger: 'change'}
        ],
        status: [
          {required: true, message: '请选择广告状态', trigger: 'change'}
        ],
        position: [
          {required: true, message: '请输入广告位置', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序号', trigger: 'blur'}
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
    oldImageUrl: String // 编辑时，查询出来的那张图片地址
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
    },
    // 上传图片，file为上传的图片对象
    uploadMainImg(file) {
      const data  = new FormData() // 新建表单对象
      data.append = ('file', file.file)
      commonApi.uploadFile(data).then(res => {
        // 将之前的图片删除
        this.deleteImg()

        this.formData.imageUrl = res.data // 回显图片
      }).catch(err => {
        this.$message.error('上传失败')
      })
    },
    deleteImg() {
      // && 后面的内容是为了防止在没有建立关联的情况下上传图片，删除的是新上传的图片
      if (this.formData.imageUrl && this.formData.imageUrl !== this.oleImageUrl) {
        commonApi.deleteImg(this.formData.imageUrl)
      }
    }
  },
  components: {
  },
  created () {}
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
