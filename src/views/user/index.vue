<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="用户名:">
        <!-- trim可以去除字符串中的空格 -->
        <el-input v-model.trim="query.username"></el-input>
      </el-form-item>
      <el-form-item label="手机号:">
        <el-input v-model.trim="query.mobile"></el-input>
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
      <el-table-column align="center" prop="username" label="用户名"></el-table-column>
      <el-table-column align="center" prop="nickName" label="昵称"  width="80px"></el-table-column>
      <el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
      <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
      <el-table-column align="center" prop="isAccountNonExpired" label="账号过期" width="100px">
        <template slot-scope="scope">
          <!-- 1-未过期  0- 已过期 -->
          <el-tag type="danger" v-if="scope.row.isAccountNonExpired === 0">已过期</el-tag>
          <el-tag type="success" v-if="scope.row.isAccountNonExpired === 1">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isAccountNonLocked" label="账号锁定"  width="100px">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.isAccountNonLocked === 0">锁定</el-tag>
          <el-tag type="success" v-if="scope.row.isAccountNonLocked === 1">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isCredentialsNonExpired" label="密码过期" width="100px">
        <template slot-scope="scope">
          <!-- 1-未过期  0- 已过期 -->
          <el-tag type="danger" v-if="scope.row.isCredentialsNonExpired === 0">已过期</el-tag>
          <el-tag type="success" v-if="scope.row.isCredentialsNonExpired === 1">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isEnabled" label="是否可用"  width="100px">
        <template slot-scope="scope">
          <!-- 帐户是否可用(1 可用，0 删除用户) -->
          {{ scope.row.isEnable }}
          <el-tag type="danger" v-if="scope.row.isEnabled === 0">已删除</el-tag>
          <el-tag type="success" v-if="scope.row.isEnabled === 1">可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  width="340px">
        <!-- element-ui中的slot-scope属性获取当前的单元格（即此表格渲染的绑定数据的那一项对象） -->
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.isEnable === 1"> -->
            <!-- 点击按钮获取点击行的id, 以便发送给后台获取数据 -->
            <el-button type="primary" size="small" :disabled="scope.row.isEnabled === 0" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" :disabled="scope.row.isEnabled === 0" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button type="success" size="small" :disabled="scope.row.isEnabled === 0" @click="handleRole(scope.row.id)">设置角色</el-button>
            <el-button type="success" size="small" :disabled="scope.row.isEnabled === 0" @click="handlePwd(scope.row.id)">密码修改</el-button>
          <!-- </span> -->
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
    <edit :formData="edit.formData" :title="edit.title" :visible="edit.visible" :remoteClose="remoteClose" />
    <el-dialog title="分配角色" :visible.sync="role.visible" width="65%">
      <!-- roleIds是当前用户所拥有的角色id, saveUserRole事件是子组件进行触发提交选择的角色id -->
      <role :roleIds="role.roleIds" @saveUserRole="saveUserRole" />
    </el-dialog>
  </div>
</template>

<script>
import { getList, getById, deleteById, getRoleIdsByUserId, saveUserRole } from '@/api/user'

import Edit from './edit'
import Role from '../role/index'
export default {
  name: 'User',
  data () {
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
        visible: false,
      },
      role: { // 弹出分配角色组件
        visible: false,
        roleIds: [], // 当前用户所拥有的角色id，至少会传递一个数组，哪怕是空数组，以此来区别是否是用户管理中的组件或者是角色管理中的组件
        userId: null
      }
    }
  },
  components: {
    Edit,
    Role
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getList(this.query, this.page.current, this.page.size).then(res => {
        this.list = res.data.records
        this.page.total = res.data.total
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
      this.edit.title = '新增用户——默认密码与用户名一致'
      this.edit.visible = true
    },
    async handleEdit(id) {
      const { data } = await getById(id)
      this.edit.formData = data
      this.edit.visible = true
    },
    handleDelete(id) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await deleteById(id)
          if (code === 20000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
          this.fetchData()
        }).catch(() => {

        });
    },
    // 设置角色
    async handleRole(id) {
      this.role.userId = id
      const { data } = await getRoleIdsByUserId(id)
      this.role.roleIds = data // 将角色id传递给子组件
      this.role.visible = true
    },
    // 密码修改
    handlePwd(id) {

    },
    remoteClose() {
      this.edit.visible = false,
      this.edit.formData = {}
      this.fetchData()
    },
    // 角色列表子组件会触发此方法来保存当前用户选择的角色
    async saveUserRole(checkedRoleIds) {
      const { code } = await saveUserRole(this.role.userId, checkedRoleIds)
      if (code === 20000) {
        this.$message.success('分配角色成功')
        this.role.visible = false // 关闭弹窗
      } else {
        this.$message.success('分配角色失败')
      }
    }
  },
}
</script>

<style scoped lang="scss">
.el-pagination {
  float: right;
  margin:10px 50px;
}
</style>
