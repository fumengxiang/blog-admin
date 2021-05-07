<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <!-- model双向绑定表单存储的数据 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="文章标题:">
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
      </el-form-item>
    </el-form>
    <el-table :data="list" border stripe style="width: 100%">
      <!-- 表格的每一列 -->
      <!-- 设置表格的第一列为序号，数据是element-ui自己产生 -->
      <el-table-column align="center" type="index" label="序号" width="80px"></el-table-column>
      <el-table-column align="center" prop="title" label="文章标题"></el-table-column>
      <el-table-column align="center" prop="viewCount" label="浏览数"></el-table-column>
      <el-table-column align="center" prop="thumhup" label="点赞数"></el-table-column>
      <el-table-column align="center" prop="ispublic" label="是否公开" width="100px">
        <template slot-scope="scope">
          <!-- 过滤器的使用，参数在前，即要对哪个参数进行过滤 -->
          <el-tag v-if="scope.row.ispublic === 0" type="danger">不公开</el-tag>
          <el-tag v-else type="warning">公开</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="120px">
        <template slot-scope="scope">
          <!--  0: 已删除, 1:未审核，2:审核通过 3: 审核未通过-->
          <el-tag v-if="scope.row.status === 0" type="danger">已删除</el-tag>
          <el-tag v-if="scope.row.status === 1">未审核</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
          <el-tag v-if="scope.row.status === 3" type="warning">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateDate" label="最近更新时间" min-width="90px">
        <template slot-scope="scope">
          {{ getFormatDate(scope.row.updateDate) }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="250px">
        <!-- element-ui中的slot-scope属性获取当前的单元格（即此表格渲染的绑定数据的那一项对象） -->
        <template slot-scope="scope">
          <!-- 点击按钮获取点击行的id, 以便发送给后台获取数据 -->
          <el-button type="primary" size="small" @click="openView(scope.row.id)">查看</el-button>
          <el-button type="success" size="small" v-if="scope.row.status === 1" @click="openAudit(scope.row.id)">审核</el-button>
          <el-button type="danger" size="small" v-if="scope.row.status !== 0" @click="handleDelete(scope.row.id)">删除</el-button>
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
    <audit :title="audit.title" :visible="audit.visible" 
    :remoteClose="remoteClose" :auditId="audit.auditId" :isAudit="audit.isAudit"></audit>
  </div>
</template>

<script>
import api from '@/api/article'
// 格式化日期
import { format } from '@/utils/date'
import Audit from './audit.vue'
const statusOptions = [
  {status: "已删除", code: 0},
  {status: "未审核", code: 1},
  {status: "审核通过", code: 2},
  {status: "审核未通过", code: 3}
]
export default {
  name: 'Article',
  data () {
    return {
      list: [],
      query: {},
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      statusOptions,
      audit: {
        title: '',
        visible: false,
        auditId: null,
        isAudit: false
      }
    }
  },
  methods: {
    // 抓取数据
    fetchData() {
      api.getList(this.query, this.page.current, this.page.size).then(res => {
        this.list = res.data.records
        this.page.total = res.data.total
      })
    },
    // 格式化时间
    getFormatDate(date){
      return format(date)
    },
    handleSizeChange(val) {
      this.fetchData() // 抓取数据
    },
    handleCurrentChange(current) {
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
    // 审核文章
    openAudit(id) {
      this.audit.auditId = id
      this.audit.isAudit = true
      this.audit.title = '审核文章'
      this.audit.visible = true
    },
    async handleDelete(id) {
      const {code} = await api.deleteById(id)
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
      this.fetchData()
    },
    remoteClose() {
      this.audit.visible = false
      this.fetchData()
    },
    openView(id) {
      this.audit.visible = true
      this.audit.title = '查看文章'
      this.audit.isAudit = false
      this.audit.auditId = id
    }
   },
  components: {
    Audit
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
