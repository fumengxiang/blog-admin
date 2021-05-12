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
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openDialog" v-if="!roleIds">新增</el-button>
        <el-button type="success" @click="handleUserRole" v-if="roleIds">设置角色</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="dataTable"
             :data="list"
              border stripe
              style="width: 100%"
              row-key="id"
              @selection-change="handleSelectionChange">
      <!-- 设置多选框 reserve-selection 此属性必须配合row-key使用，以便优化表格渲染 此属性为记录选择的项，在切换页码后会将之前记录的选择重新渲染-->
      <el-table-column v-if="roleIds" reserve-selection align="center" type="selection" width="55px"></el-table-column>
      <!-- 表格的每一列 -->
      <!-- 设置表格的第一列为序号，数据是element-ui自己产生 -->
      <el-table-column align="center" type="index" label="序号" width="80px"></el-table-column>
      <el-table-column align="center" prop="name" label="角色名称" width="120px"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      <!-- v-if="!roleIds"用来隐藏操作列 -->
      <el-table-column align="center" label="操作" width="250px" v-if="!roleIds">
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
  props: { // 此组件作为用户管理模块的子组件时，收到的父组件数据
    roleIds: null
  },
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
      },
      checkedRoleList: [] // 保存选中的项
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

      // 列表有数据后勾选角色
      this.checkRoles()
    },
    // 勾选角色
    checkRoles() {
      this.$refs.dataTable.clearSelection() // 清除之前的选择
      if (this.roleIds) {
        this.list.forEach(item => {
          if (this.roleIds.indexOf(item.id) !== -1) { // 需要选中的表格项的id与当前项的id相同，则表示需要渲染此项
            this.$refs.dataTable.toggleRowSelection(item, true) // 渲染此项
          }
        })
      }
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
    },
    // 收集被选中的角色
    handleSelectionChange(val) { // val 是包含每一个选中的对象的数组
      this.checkedRoleList = val
    },
    // 点击设置角色触发事件
    handleUserRole() {
      const checkedRoleIds = [] // 存放选中的角色id
      // 获取每个选中角色的id，因为接口只需要角色id来保存
      this.checkedRoleList.forEach(item => {
        checkedRoleIds.push(item.id)
      })

      // 触发父组件的事件，以传递数据
      this.$emit('saveUserRole', checkedRoleIds)
    }
  },
  watch: {
    // 打开设置角色后需要重新刷新角色界面
    roleIds() {
      this.query = {}
      this.queryData()
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
