<template>
  <div id="role">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <bk-form form-type="inline">
          <bk-form-item label="角色名称 :">
            <bk-input placeholder="输入角色名称" v-model="roleName"></bk-input>
          </bk-form-item>

          <bk-form-item>
            <bk-button theme="primary" @click="getRole(roleName, 1, pagination.limit)">
              <bk-icon type="search" style="top:0;font-size:16px;"></bk-icon>
              搜 索
            </bk-button>
          </bk-form-item>
        </bk-form>
      </div>

      <div class="table-head"
        style="height: 50px;background: #fafbfd;border-top: 1px solid #dfe0e5;border-left: 1px solid #dfe0e5;border-right: 1px solid #dfe0e5;border-top-left-radius: 2px;border-top-right-radius: 2px;">
      </div>
      <!-- 表格 -->
      <bk-table style="" height="550" :data="data" :size="size" :pagination="pagination" :show-header="true"
        :stripe="true" :border="true" @row-mouse-enter="handleRowMouseEnter" @row-mouse-leave="handleRowMouseLeave"
        @page-change="handlePageChange" @page-limit-change="handlePageLimitChange" @selection-change="selectRow">
        <bk-table-column type="selection" width="60"></bk-table-column>
        <bk-table-column type="index" label="序列" width="60"></bk-table-column>
        <bk-table-column label="用户名" prop="userName"></bk-table-column>
        <bk-table-column label="姓名" prop="realName"></bk-table-column>
        <bk-table-column label="性别" prop="gender"></bk-table-column>
        <bk-table-column label="联系方式" prop="phone"></bk-table-column>
        <bk-table-column label="出生日期" prop="birth" :formatter="dateFormat"></bk-table-column>
        <bk-table-column label="角色" prop="role.roleName"></bk-table-column>
        <bk-table-column label="操作" width="">
          <template slot-scope="props">
            <bk-button class="mr10" theme="primary" text>编辑</bk-button>
            <bk-button class="mr10" theme="primary" text @click="remove(props.row)">移除</bk-button>
            <bk-button class="mr10" theme="primary" text @click="openPermission(props.row)">权限分配</bk-button>
          </template>
        </bk-table-column>
      </bk-table>
    </el-card>
    <div id="" style="height: 1px;">

    </div>

    <!-- 权限分配 -->
    <el-dialog title="权限分配" :visible.sync="dialogFormVisible" :close-on-click-modal="true" :destroy-on-close="true">
      <input type="hidden" v-model="roleId"></input>
      <el-input v-model="permissionRoleName" readonly="" style="float: left; margin: 100px 0 0 30px;width: 40%;"></el-input>
      <el-tree :data="permissionData" show-checkbox node-key="id" :default-expanded-keys="defaultExpanded"
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
    bkForm,
    bkFormItem,
    bkInput,
    bkDatePicker,
  } from 'bk-magic-vue'
  import moment from 'moment'

  export default {
    components: {
      bkTable,
      bkTableColumn,
      bkButton,
      bkPopover,
    },
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        formInline: {
          value: '',
        },
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
      this.getRole(this.roleName, this.pagination.current, this.pagination.limit);
    },
    methods: {
      // 获取用户
      getRole(roleName, pageNum, pageSize) {
        this.pagination.current = pageNum;

        this.$axios({
            method: "post",
            url: this.HOST + "/user/getUser",
            data: {
              roleName: roleName,
              page: pageNum,
              limit: pageSize
            }
          })
          .then(res => {
            this.data = res.data.data;
            this.pagination.count = res.data.count;
          })
          .catch(error => {
            console.log(error);
          })
      },
      // 切换显示条数
      handlePageLimitChange(limit) {
        console.log('handlePageLimitChange', arguments, limit);
      },
      // 翻页
      handlePageChange(page) {
        this.pagination.current = page;
        this.getRole(this.roleName, page, this.pagination.limit);
      },
      handleRowMouseEnter() {

      },
      handleRowMouseLeave() {

      },
      // 选中行
      selectRow(selection) {
        selection.forEach((sel, index) => {
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

        }).catch(error => {

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
      dateFormat(row, column) {
        var date = row.birth;

        if (date == undefined) {
          return ''
        };

        return moment(date).format("YYYY-MM-DD")

      }
    },
  }
</script>
<style type="text/css">
  .el-message-box {
    vertical-align: inherit !important;
  }
</style>

<style scoped="scoped">
  >>>.bk-table-body-wrapper {
    height: calc(550px - 43px - 63px) !important;
  }

  >>>.bk-table-border td:first-child .cell,
  >>>.bk-table-border th:first-child .cell {
    padding: 0;
  }

  >>>.el-card {
    min-height: calc(100% - 1px);
  }

  >>>.el-card__body {
    min-height: calc(100% - 77px);
  }

  >>>.bk-form-input {
    font-size: 14px;
  }

  >>>label {
    width: auto;
  }

  >>>.el-checkbox__inner:hover {
    border-color: #2E58FF;
  }

  >>>.el-checkbox__inner::after {
    border: 2px solid #fff;
    border-left: 0;
    border-top: 0;
    top: 0;
    left: 3.5px;
  }

  >>>.el-checkbox__input.is-checked .el-checkbox__inner,
  >>>.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #2E58FF;
    border-color: #2E58FF;
  }

  >>>.el-tree-node:focus>.el-tree-node__content {
    background-color: #fff;
  }

  >>>.el-tree-node__content:hover {
    background-color: #fff;
  }

  >>>.el-tree {
    width: 45%;
    float: right;
    height: 100%;
    padding: 20px;
    overflow-y: auto;
  }

  >>>.el-dialog__body {
    padding: 0;
    height: calc(100% - 45px);
  }

  /* >>>.el-input {
    width: 40%;
  } */

  >>>.el-input__inner {
    /* width: 100%; */
    border-color: #C0C4CC;
  }

  >>>.el-input.is-active .el-input__inner,
  >>>.el-input__inner:focus {
    border-color: #2E58FF;
  }

  >>>.el-dialog__header {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  >>>.el-dialog__headerbtn {
    top: 10px;
  }

  >>>.el-dialog__title {
    font-size: 14px;
  }

  >>>.el-dialog {
    width: 30%;
    height: 50%;
  }

  >>>.bk-button {
    height: 38px;
  }

  >>>.bk-label {
    line-height: 40px !important;
  }

  >>>.bk-form-input {
    width: 200px;
    height: 40px;
  }

  >>>.bk-form-input:focus {
    border-color: #2E58FF !important;
  }

  >>>.bk-table {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  >>>.bk-page-selection-count {
    display: none;
  }

  >>>.dot-menu {
    display: inline-block;
    vertical-align: middle;
  }

  >>>.tippy-tooltip.dot-menu-theme {
    padding: 0;
  }

  >>>.dot-menu-trigger {
    display: block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    text-align: center;
    font-size: 0;
    cursor: pointer;
  }

  >>>.dot-menu-trigger:hover {
    color: #3A84FF;
    background-color: #DCDEE5;
  }

  >>>.dot-menu-trigger:before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: currentColor;
    box-shadow: 0 -4px 0 currentColor, 0 4px 0 currentColor;
  }

  >>>.dot-menu-list {
    margin: 0;
    padding: 5px 0;
    min-width: 50px;
    list-style: none;
  }

  >>>.dot-menu-list .dot-menu-item {
    padding: 0 10px;
    font-size: 12px;
    line-height: 26px;
    cursor: pointer;

    &:hover {
      background-color: #eaf3ff;
      color: #3a84ff;
    }
  }

  #role {
    height: 100%;
  }
</style>
