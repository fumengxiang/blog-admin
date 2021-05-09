<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <!-- model双向绑定表单存储的数据 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="菜单名称:">
        <!-- trim可以去除字符串中的空格 -->
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="fetchData">查询</el-button>
        <el-button icon="el-icon-refresh" type="nomal" @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="handleAdd(0)">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- row-key="id" 指定唯一标识的属性名，其中每条表格的行数据应该包含children字段 -->
    <el-table row-key="id" :data="list" border stripe style="width: 100%">
      <!-- 表格的每一列 -->
      <!-- 设置表格的第一列为序号，数据是element-ui自己产生 -->
      <el-table-column align="center" type="index" label="序号" width="80px"></el-table-column>
      <el-table-column align="center" prop="name" label="名称" width="120px"></el-table-column>
      <el-table-column align="center" prop="url" label="请求地址"></el-table-column>
      <el-table-column align="center" prop="code" label="权限标识"></el-table-column>
      <el-table-column align="center" prop="type" label="类型" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">目录</span>
          <span v-else-if="scope.row.type === 2">菜单</span>
          <span v-else-if="scope.row.type === 3">按钮</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="icon" label="图标" width="100px">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序" width="100px"></el-table-column>
      <el-table-column align="center" label="操作">
        <!-- element-ui中的slot-scope属性获取当前的单元格（即此表格渲染的绑定数据的那一项对象） -->
        <template slot-scope="scope">
          <!-- 点击按钮获取点击行的id, 以便发送给后台获取数据 -->
          <el-button icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="handleAdd(scope.row.id)">新增</el-button>
          <el-button type="success" size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose"></edit>
  </div>
</template>

<script>
import api from '@/api/menu'
import Edit from './edit'

export default {
  name: 'Menu',
  data () {
    return {
      list: [],
      query: {},
      edit: {
        formData: {},
        title: '',
        visible: false
      }
    }
  },
  methods: {
    // 抓取数据
    fetchData() {
      api.getList(this.query).then(res => {
        this.list = res.data
      })
    },
    // 增加菜单, id作为新菜单的parentId
    handleAdd(id) {
      // id = 0 是在条件查询中新增一级菜单，否则新增某菜单下的子菜单
      this.edit.formData.parentId = id
      this.edit.visible = true
      this.edit.title = '新增'
    },
    // 编辑菜单
    async handleEdit(id) {
      const { data } = await api.getById(id)
      this.edit.formData = data
      // 弹出窗口
      this.edit.title = '编辑',
      this.edit.visible = true
    },
    // 删除菜单
    handleDelete(id) {
      this.$confirm('此操作将删除当前节点及其子节点记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await api.deleteById(id)
          if (code === 20000) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
          this.remoteClose()
        }).catch(() => {
          // 取消删除不用理会 
        })
    },
    // 重置
    reload() {
      this.query = {}
      this.fetchData()
    },
    remoteClose() {
      this.edit.formData = {}
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

</style>
