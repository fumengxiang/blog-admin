<template>
  <!-- 此模板中带有app-container属性用于设置表格 -->
  <div class="app-container">
    <!-- 条件查询 -->
    <!-- model双向绑定表单存储的数据 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="分类名称：">
        <!-- trim可以去除字符串中的空格 -->
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="query.status" clearable filterable>
          <el-option v-for="statu in statusOptions" :label="statu.status" :value="statu.code" :key="statu.code"></el-option>
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
      <el-table-column align="center" prop="name" label="分类名称" width="120px"></el-table-column>
      <el-table-column align="center" prop="sort" label="排序" width="80px"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="100px">
        <template slot-scope="scope">
          <!-- 过滤器的使用，参数在前，即要对哪个参数进行过滤 -->
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250px">
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

    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose"></edit>
  </div>
</template>

<script>
// 从api中导入接口函数
import api from '@/api/category'
import Edit from './edit'
const statusOptions = [
  {code: 0, status: '禁用'},
  {code: 1, status: '正常'}
]

export default {
  name: 'Category',
  data() {
    return {
      // 存放抓取的数据
      list: [],
      page: {
        current: 1, // 当前页码
        size: 20, // 每页显示的条数
        total: 0 // 返回数据的总条数
      },
      query: {},
      statusOptions,
      edit: { // 管理弹框（子组件）
        title: '',
        visible: false,
        formData: {}
      }
    }
  },
  components: {
    Edit
  },
  // 定义过滤器
  filters: {
    // 此过滤器使用各映射，将0映射为info, 将1映射为success  状态过滤器
    statusFilter(status) {
      const statusMap = {0: 'info', 1: 'success'}
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      api.getList(this.query, this.page.current, this.page.size).then(res => {
        // console.log(res)
        this.list = res.data.records // 列表数据
        this.page.total = res.data.total
      })
    },
    handleEdit(id) {
      api.getById(id).then(res => {
        // console.log(res)
        if (res.code === 20000) {
          // 将查询到的数据插入子组件
          this.edit.formData = res.data
          this.edit.visible = true
          this.edit.title = '编辑'
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
    // 每页展示的数据条数发生改变触发此方法，传入的参数为每页展示的数据条数
    handleSizeChange(val) {
      this.page.size = val
      // 重新抓取数据
      this.fetchData()
    },
    // 当前页码发生改变触发，传入的参数为当前页码
    handleCurrentChange(val) {
      this.page.current = val
      // 重新抓取数据
      this.fetchData()
    },
    // 点击查询按钮的触发的事件
    queryData() {
      // 将当前的页码置为1
      this.page.current = 1
      this.fetchData()
    },
    reload() {
      // 令查询条件为空，重新抓取数据即可
      this.query = {}
      this.fetchData()
    },
    // 在父组件中修改关闭弹窗的数据
    remoteClose() {
      // 关闭表单需要清空表单中的数据
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData() // 刷新列表, 可以将新增的列表查询出来
    },
    openDialog() {
      this.edit.visible = true
      this.edit.title = '新增'
    }
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin:10px 50px;
}
</style>