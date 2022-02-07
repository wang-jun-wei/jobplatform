<template>
  <div id="role">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="border-bottom:none">
        <el-form :inline="true">
          <el-form-item class="search-item" label="角色名称 :" style="margin-bottom:0;width:300px">
            <el-input placeholder="输入角色名称" v-model="roleName"></el-input>
          </el-form-item>

          <el-form-item style="margin-bottom:0">
            <el-button type="primary" @click="getRole(roleName, pagination.current, pagination.limit)">
              <i class="el-icon-search" style="margin-right:5px;"></i>搜 索
            </el-button>
            <el-button @click="roleName = ''" style="background-color:#fff;border-radius:2px;">
              <i class="el-icon-refresh-left" style="margin-right:5px;"></i>重 置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div style="padding:15px;box-shadow: 0 0 5px rgba(0,0,0,.2);border-radius:4px;border:1px solid #ddd">
        <div class="table-head" style="margin-bottom:10px">
          <el-button type="primary" style="">
            <i class="el-icon-circle-plus-outline" style="margin-right:5px;position:relative;top:1px;"></i>添 加
          </el-button>
        </div>
        <!-- 表格 -->
        <bk-table height="527" :data="data" :size="size" :outer-border="false" :pagination="pagination"
                  :show-header="true" @page-change="handlePageChange" @page-limit-change="handlePageLimitChange"
                  @selection-change="selectRow" v-loading="loading">
          <bk-table-column type="selection" width="60"></bk-table-column>
          <bk-table-column type="index" label="序列" width="60"></bk-table-column>
          <bk-table-column label="ID" prop="id"></bk-table-column>
          <bk-table-column label="角色名称" prop="roleName"></bk-table-column>
          <bk-table-column label="操作" width="">
            <template slot-scope="props">
              <bk-button class="mr10" theme="success" text>编辑</bk-button>
              <bk-button class="mr10" theme="danger" text @click="remove(props.row)">移除</bk-button>
              <bk-button class="mr10" theme="primary" text @click="openPermission(props.row)">权限分配</bk-button>
            </template>
          </bk-table-column>
        </bk-table>
      </div>


    </el-card>
    <div id="" style="height: 1px;">

    </div>

    <!-- 权限分配 -->
    <el-dialog title="权限分配" :visible.sync="dialogFormVisible" :close-on-click-modal="true" :destroy-on-close="true"
               @close="closeDialog">
      <input type="hidden" v-model="roleId"></input>
      <el-input v-model="permissionRoleName" readonly="" style="float:left;margin: 100px 0 0 30px;width: 40%;">
      </el-input>
      <el-tree :data="permissionData" show-checkbox node-key="id" class="tree" default-expand-all
               :default-checked-keys="defaultChecked">
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import {
  bkTable,
  bkTableColumn,
  bkButton,
  bkPopover,
} from 'bk-magic-vue'

export default {
  name: "role",
  components: {
    bkTable,
    bkTableColumn,
    bkButton,
    bkPopover,
  },
  data() {
    return {
      loading: false,
      defaultChecked: [5],
      defaultExpanded: [1, 4],
      dialogFormVisible: false,
      size: 'small', // small一行  medium两行  large三行
      data: [],
      pagination: {
        current: 1,
        count: '',
        limit: 10
      },
      selectedIds: [],
      permissionData: [],
      roleId: "",
      roleName: "",
      permissionRoleName: "",
    }
  },

  mounted() {

  },
  methods: {
    // 获取角色
    getRole(roleName, pageNum, pageSize) {
      this.loading = true;
      this.pagination.current = pageNum;

      this.$axios({
        method: "post",
        url: this.HOST + "/role/getRole",
        data: {
          roleName: roleName,
          page: pageNum,
          limit: pageSize
        }
      })
        .then(res => {
          this.data = res.data.data;
          this.pagination.count = res.data.count;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 切换显示条数
    handlePageLimitChange(limit) {
      this.pagination.limit = limit;
      this.getRole(this.roleName, this.pagination.page, limit);
    },
    // 翻页
    handlePageChange(page) {
      this.pagination.current = page;
      this.getRole(this.roleName, page, this.pagination.limit);
    },
    // 选中行
    selectRow(selection) {
      selection.forEach((sel) => {
        console.log(sel.id);
      })
    },
    // 删除行
    remove(row) {
      this.$confirm("确定删除？", '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
        customClass: "tipWindow",
      }).then(() => {
        console.log(row);
      }).catch(error => {
        console.log(error);
      })
      // const index = this.data.indexOf(row)
      // if (index !== -1) {
      //   this.data.splice(index, 1)
      // }
    },
    // 打开权限窗口
    openPermission(row) {
      this.roleId = row.id;
      this.permissionRoleName = row.roleName;

      // 获取菜单回显
      this.$axios({
        url: this.HOST + "/role/getRolePermission",
        method: "post",
        data: {
          "roleId": this.roleId
        },
      })
        .then(res => {
          this.defaultChecked = res.data.checked;
          this.permissionData = res.data.data;
          this.dialogFormVisible = true;
        })
        .catch(error => {
          console.log(error);
        });

    },
    closeDialog() {
      this.permissionData = [];
    },

  },
  created() {
    this.getRole(this.roleName, this.pagination.current, this.pagination.limit);
  }
}
</script>
<style type="text/css">
.el-message-box {
  vertical-align: inherit !important;
}
</style>

<style scoped="scoped">
>>> .search-item .el-form-item__content {
  width: 220px;
}

>>> .el-button--primary {
  background: #3a84ff;
  border-color: #3a84ff;
  color: #fff;
  border-radius: 2px;
}

>>> .el-button--primary:hover {
  opacity: .8;
}

>>> .el-card__body {
  padding: 5px 20px;
}

>>> .el-card__header {
  border-bottom: none;
}

>>> .bk-table-body-wrapper::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

>>> .bk-table-body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 12px;
  border: 4px solid rgba(0, 0, 0, 0);
  box-shadow: 12px 0 0 #A2A3A5 inset;
}

/* >>>.bk-table-body-wrapper::-webkit-scrollbar-thumb:hover {
    box-shadow: 13px 0 0 #a2a3a5 inset;
}
*/
>>> .bk-table th :hover {
  background-color: #3F3F3F;
}

>>> .bk-table-pagination-wrapper {
  border: none;
}

>>> .bk-table:before {
  display: none;
}

>>> .bk-table tr:nth-child(odd) {
  background-color: #EBEBEB !important;
}

>>> .bk-table tr:nth-child(odd) td {
  background-color: #EBEBEB !important;
}

>>> .bk-table tr:nth-child(even) {
  background-color: #f7f7f7 !important;
}

>>> .bk-table th {
  background-color: #3f3f3f !important;
}

>>> .bk-table th .bk-table-header-label {
  color: #fff;
}

>>> .bk-table td,
>>> .bk-table th.is-leaf {
  border-bottom: none;
}

>>> .bk-table-body-wrapper {
  height: calc(527px - 43px - 63px) !important;
  overflow-y: auto;
}

>>> .bk-table-border td:first-child .cell,
>>> .bk-table-border th:first-child .cell {
  padding: 0;
}

>>> .el-card {
  min-height: calc(100% - 1px);
}

>>> .el-card__body {
  min-height: calc(100% - 77px);
}

>>> .bk-form-input {
  font-size: 14px;
}

>>> label {
  width: auto;
}

>>> .el-checkbox__inner:hover {
  border-color: #2E58FF;
}

>>> .el-checkbox__inner::after {
  border: 2px solid #fff;
  border-left: 0;
  border-top: 0;
  top: 0;
  left: 3.5px;
}

>>> .el-checkbox__input.is-checked .el-checkbox__inner,
>>> .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #2E58FF;
  border-color: #2E58FF;
}

>>> .el-tree-node:focus > .el-tree-node__content {
  background-color: #fff;
}

>>> .el-tree-node__content:hover {
  background-color: #fff;
}

>>> .el-tree {
  width: 45%;
  float: right;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}

>>> .el-dialog__body {
  padding: 0;
  height: calc(100% - 45px);
}

/* >>>.el-input {
  width: 40%;
} */

>>> .el-input__inner {
  /* width: 100%; */
  border-color: #C0C4CC;
}

>>> .el-input.is-active .el-input__inner,
>>> .el-input__inner:focus {
  border-color: #2E58FF;
}

>>> .el-dialog__header {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

>>> .el-dialog__headerbtn {
  top: 10px;
}

>>> .el-dialog__title {
  font-size: 14px;
}

>>> .el-dialog {
  width: 30%;
  height: 50%;
}

>>> .bk-label {
  line-height: 40px !important;
}

>>> .bk-form-input {
  width: 200px;
  height: 40px;
}

>>> .bk-form-input:focus {
  border-color: #2E58FF !important;
}

>>> .bk-table {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

>>> .bk-page-selection-count {
  display: none;
}

>>> .dot-menu {
  display: inline-block;
  vertical-align: middle;
}

>>> .tippy-tooltip.dot-menu-theme {
  padding: 0;
}

>>> .dot-menu-trigger {
  display: block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  text-align: center;
  font-size: 0;
  cursor: pointer;
}

>>> .dot-menu-trigger:hover {
  color: #3A84FF;
  background-color: #DCDEE5;
}

>>> .dot-menu-trigger:before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: currentColor;
  box-shadow: 0 -4px 0 currentColor, 0 4px 0 currentColor;
}

>>> .dot-menu-list {
  margin: 0;
  padding: 5px 0;
  min-width: 50px;
  list-style: none;
}

>>> .dot-menu-list .dot-menu-item {
  padding: 0 10px;
  font-size: 12px;
  line-height: 26px;
  cursor: pointer;
}

#role {
  height: 100%;
}
</style>
