<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <!-- model双向绑定表单存储的数据 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="广告标题:">
        <!-- trim可以去除字符串中的空格 -->
        <el-input v-model.trim="query.title"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="query.status" clearable filterable>
          <el-option v-for="statu in statusOptions" :label="statu.status" :value="statu.code" :key="statu.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" type="nomal" @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border stripe style="width: 100%">
      <!-- 表格的每一列 -->
      <!-- 设置表格的第一列为序号，数据是element-ui自己产生 -->
      <el-table-column align="center" type="index" label="序号" width="80px"></el-table-column>
      <el-table-column align="center" prop="title" label="广告标题"></el-table-column>
      <el-table-column align="center" prop="imageUrl" label="广告图片">
        <template slot-scope="scope">
          <el-image 
            style="width: 90px; height: 60px"
            :src="scope.row.imageUrl" 
            :preview-src-list="[scope.row.imageUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="advertUrl" label="广告链接"></el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="100px">
        <template slot-scope="scope">
          <!-- 过滤器的使用，参数在前，即要对哪个参数进行过滤 -->
          <el-tag v-if="scope.row.status === 0" type="info">禁用</el-tag>
          <el-tag v-else type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序" width="120px">
      </el-table-column>
      <el-table-column align="left" label="操作" width="250px">
        <!-- element-ui中的slot-scope属性获取当前的单元格（即此表格渲染的绑定数据的那一项对象） -->
        <template slot-scope="scope">
          <!-- 点击按钮获取点击行的id, 以便发送给后台获取数据 -->
          <el-button type="success" size="small" @click="openEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[10, 20, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    <edit :title="edit.title" :visible="edit.visible" 
    :formData="edit.formData" :remoteClose="remoteClose"
    :oldImageUrl="edit.oldImageUrl" />
  </div>
</template>

<script>
import api from '@/api/advert'
import Edit from './edit'

const statusOptions = [
  {code: 0, status: '禁用'},
  {code: 1, status: '正常'}
]
export default {
  name: 'Advert',
  data () {
    return {
      list: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      query: {},
      statusOptions,
      edit: {
        title: '',
        visible: false,
        formData: {
          imageUrl: null // 声明图片，否则子组件无法显示
        },
        oldImageUrl: null
      }
    }
  },
  methods: {
    async fetchData() {
      const { data } = await api.getList(this.query, this.page.current, this.page.size)
      this.list = data.records
      this.page.total = data.total
    },
    openEdit(id) {
      api.getById(id).then(res => {
        if (res.code === 20000) {
          this.edit.formData = res.data
          // 将图片赋值给旧地址
          this.edit.oldImageUrl = res.data.imageUrl
          // 弹出窗口
          this.edit.visible = true
          this.edit.title = '编辑广告'
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteById(id).then(res => {
            if (res.code === 20000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
            this.fetchData() // 刷新列表数据
          })
        }).catch(() => {
          // 取消删除不用理会 
        })
    },
    handleSizeChange(size) {
      this.page.size = size
      this.fetchData()
    },
    handleCurrentChange(current) {
      this.page.current = current
      this.fetchData()
    },
    queryData() {
      this.page.current = 1
      this.fetchData()
    },
    reload() {
      this.query = {}
      this.fetchData()
    },
    openAdd() {
      this.edit.title = '新增广告'
      this.edit.visible = true
    },
    remoteClose() {
      this.edit.formData = {imageUrl: null}
      this.edit.visible = false
      this.fetchData()
    }
  },
  components: {
    Edit
  },
  created () {
    this.fetchData()
  }
}
</script>

<style scoped lang="scss">
.el-pagination {
  float: right;
  margin:10px 50px;
}
</style>
