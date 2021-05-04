<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <!-- model双向绑定表单存储的数据 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="标签名称：">
        <!-- trim可以去除字符串中的空格 -->
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item label="分类名称：">
        <el-select v-model="query.categoryId" clearable filterable>
          <el-option v-for="item in categoryList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" type="nomal" @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openDialog">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 要渲染的数据在el-data中使用 :data绑定一个数组 -->
    <!-- stripe属性为斑马纹，border属性为边框 -->
    <el-table :data="list" border stripe style="width: 100%">
      <!-- 表格的每一列 -->
      <!-- 设置表格的第一列为序号，数据是element-ui自己产生 -->
      <el-table-column align="center" type="index" label="序号" width="80px"></el-table-column>
      <el-table-column align="center" prop="name" label="标签名称"></el-table-column>
      <el-table-column align="center" prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column align="center" label="操作">
        <!-- element-ui中的slot-scope属性获取当前的单元格（即此表格渲染的绑定数据的那一项对象） -->
        <template slot-scope="scope">
          <!-- 点击按钮获取点击行的id, 以便发送给后台获取数据 -->
          <el-button type="success" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <!-- 其中的参数page-sizes: 当前分页，会根据此时页面的条数自动匹配相应的10、20或50 -->
    <!-- page-size: 将当前的页面显示条数与自定义变量绑定，以便数据的查询与展示 -->
    <!-- 数据是双向的，前台展示，后台查询 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[10, 20, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    <edit :title="edit.title"
    :visible="edit.visible"
    :formData="edit.formData"
    :remoteClose="remoteClose"
    :categoryList="categoryList"></edit>
  </div>
</template>

<script>
import api from '@/api/label'
import categoryApi from '@/api/category'
import Edit from './edit'
export default {
  name: 'Label',
  data () {
    return {
      list: [],
      query: {},
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      categoryList: [], // 正常状态的分类
      edit: {
        title: '',
        formData: {},
        visible: false
      }
    }
  },
  components: {
    Edit
  },
  methods: {
    fetchData() {
      api.getList(this.query, this.page.current, this.page.size).then(res => {
        // console.log(res);
        this.list = res.data.records
        this.page.total = res.data.total
      })
    },
    handleEdit(id) {
      api.getById(id).then(res => {
        this.edit.formData = res.data
        this.edit.visible = true
        this.edit.title = '编辑'
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
    // 每页显示的条数改变后触发的函数
    handleSizeChange(val) {
      this.page.size = val
      this.fetchData() // 重新抓取数据

    },
    // 页码改变触发的函数
    handleCurrentChange(pageNum) {
      this.page.current = pageNum
      this.fetchData() // 重新抓取数据
    },
    // 条件查询
    queryData() {
      this.page.current = 1
      this.fetchData()
    },
    // 重置列表数据
    reload() {
      this.query = {}
      this.fetchData()
    },
    // 打开弹窗
    openDialog() {
      this.getCategoryList() // 重新获取分类数据
      this.edit.visible = true
      this.edit.title = '新增'
    },
    getCategoryList() {
      categoryApi.getNormalList().then(res => {
        this.categoryList = res.data
      })
    },
    remoteClose() {
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
    this.getCategoryList()
  }
}
</script>

<style scoped lang="scss">
.el-pagination {
  float: right;
  margin: 10px 50px;
}
</style>
