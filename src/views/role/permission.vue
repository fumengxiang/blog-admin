<template>
  <div class="permission-container">
    <el-dialog :title="title" :visible.sync="visible" width="500px" :before-close="handleClose">
      <el-form ref="formData" v-loading="loading" label-width="80px" status-icon>
        <!-- props 属性声明树状菜单渲染的数据以及显示的标签对应的变量 -->
        <!-- 
          :data 绑定的渲染数据，数组
          show-checkbox 显示勾选框
          node-key 树节点的唯一标识属性名
          props 配置响应数据中对应展示的属性名 children 是子菜单的属性名，label显示的菜单名属性名
          :default-checked-keys 默认勾选的集合
          accordion 每次只能展开一个，会将之前展开把它隐藏
          :default-expanded-keys 默认展开的菜单
        -->
        <el-tree
          :data="menuList"
          ref="tree"
          show-checkbox
          node-key="id"
          accordion
          :props="{children: 'children', label: 'name'}"
          :default-checked-keys="menuIds">
        </el-tree>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formData')" size="small">确定</el-button>
          <el-button size="small" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import menuApi from '@/api/menu'
import roleApi from '@/api/role'
export default {
  name: 'Permission',
  data () {
    return {
      menuList: [],
      loading: false, // 加载中，为true则显示加载中
      menuIds: []
    }
  },
  watch: {
    // 监听数据的变化，加载菜单
    visible(val) {
      if (val) {
        this.getMenuList()
      }
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    remoteCloseP: Function,
    roleId: {
      type: Number,
      default: null
    }
  },
  created() {},
  methods: {
    handleClose() {
      this.remoteCloseP()
    },
    submitForm() {
      // 获取树所有被选中的菜单id
      const checkedMenuIds = this.$refs['tree'].getCheckedKeys()
      // 调用保存角色权限菜单接口
      roleApi.updateRolePermission(this.roleId, checkedMenuIds).then(res => {
        if (res.code === 20000) {
          this.$message.success('分配权限成功')
        } else {
          this.$message.error('分配权限失败')
        }
      })
      this.handleClose()
    },
    handleClose() {
      this.menuList = []
      this.menuId = []
      this.remoteCloseP()
    },
    // 获取树菜单数据
    async getMenuList() {
      this.loading = true
      const res = await menuApi.getList( {} )
      // console.log(res);
      this.menuList = res.data
      this.loading = false
      // 回显角色已有的菜单权限
      this.getMenuIdsByRoleId()
    },
    async getMenuIdsByRoleId() {
      const { data } = await roleApi.getMenuIdsByRoleId(this.roleId)
      this.menuIds = data
    }
  }
}
</script>

<style scoped lang="scss">

</style>
