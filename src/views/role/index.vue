<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="角色名称:">
        <!-- trim可以去除字符串中的空格 -->
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" type="nomal" @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openDialog">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border stripe style="width: 100%">
      <!-- 表格的每一列 -->
      <!-- 设置表格的第一列为序号，数据是element-ui自己产生 -->
      <el-table-column align="center" type="index" label="序号" width="80px"></el-table-column>
      <el-table-column align="center" prop="name" label="角色名称" width="120px"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      <el-table-column align="center" label="操作" width="250px">
        <!-- element-ui中的slot-scope属性获取当前的单元格（即此表格渲染的绑定数据的那一项对象） -->
        <template slot-scope="scope">
          <!-- 点击按钮获取点击行的id, 以便发送给后台获取数据 -->
          <el-button type="primary" size="small" @click="handlePermission(scope.row.id)">分派权限</el-button>
          <el-button type="success" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[10, 20, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    <edit :title="edit.title" :visible="edit.visible" :remoteClose="remoteClose" :formData="edit.formData" />
    <permission :roleId="permission.roleId" :title="permission.title" :visible="permission.visible" :remoteCloseP="remoteCloseP" />
  </div>
</template>

<script>
import api from '@/api/role'
import Edit from './edit'
import Permission from './permission.vue'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      query: {},
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      edit: {
        formData: {},
        title: '',
        visible: false
      },
      permission: {
        title: '',
        visible: false,
        roleId: null
      }
    }
  },
  components: { Edit, Permission },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await api.getList(this.query, this.page.current, this.page.size)
      this.list = res.data.records
      this.page.total = res.data.total
    },
    handlePermission(roleId) {
      this.permission.roleId = roleId // 将角色Id传递给子组件
      this.permission.visible = true
      this.permission.title = '分配权限'
    },
    async handleEdit(id) {
      const { data } = await api.getById(id)
      this.edit.formData = data
      this.edit.visible = true
      this.edit.title = '编辑'
    },
    handleDelete(id) {
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await api.deleteById(id)
          if (code === 20000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除失败!'
            })
          }
          this.fetchData()
        }).catch(() => {        
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
    openDialog() {
      this.edit.title = '新增'
      this.edit.visible = true
    },
    remoteClose() {
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData()
    },
    remoteCloseP() {
      this.permission.visible = false,
      this.permission.roleId = null
      this.fetchData()
    }
  }
}
</script>

<style scoped lang="scss">
.el-pagination {
  float: right;
  margin:10px 50px;
}
</style>
