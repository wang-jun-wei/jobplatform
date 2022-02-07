<template>
  <div class="home" style="height: 100%;">
    <!-- 头部 -->
    <div class="head">
      <div class="logo" style="height: 50px;line-height: 40px;width: 170px;min-width:170px;float:left;display: none;">
        <img src="../assets/hx_logo_red.png" style="vertical-align: middle" height="35px" alt="">
      </div>
      <div class="open-close" style="float: left;height: 50px;margin-left: 218px;">
        <bk-icon :type="nav_class?'dedent':'indent'" style="line-height: 47px;font-size: 20px;" v-model="isCollapse"
                 @click="open_close_menu"/>
      </div>
      <div class="project-name" style="-webkit-user-select: none;">
        天上人间
      </div>

      <div class="userInfo" @mouseover="isHover = true" @mouseout="isHover = false"
           style="height:50px;float:right;margin-right:40px;line-height:45px;font-size:14px;color:#63656e;text-align:center;min-width:95px;
        -webkit-user-select:none;">
        <span>{{ userName }}</span>
        <i :class="isHover ? 'bk-icon icon-angle-up' : 'bk-icon icon-angle-down'" style="font-size:20px;"></i>
        <div class="choose" style="position:relative;z-index:999999;padding:1px;text-align: left;" v-show="isHover">
          <ul style="font-size:12px;list-style:none;background-color: #fff;height:calc(100% - 8px);margin-top:8px;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          border: 1px solid #ddd;border-radius:2px;padding: 7px 5px;">
            <li class="userIfoLi" style="display:block;line-height:30px;padding:0 7px;">
              <a class="link-a" style="display: block;" @click="logout">
                <bk-icon type="end" style="color:red;margin-right:3px;"/>
                注 销
              </a>
            </li>
            <li class="userIfoLi" style="display:block;line-height:30px;padding:0 7px;">
              <a class="link-a" style="display:block;">
                <bk-icon type="user" style="color:#2E58FF;margin-right:3px;"/>
                个人资料
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div id="photo"
           style="width:50px;height:50px;float:right;text-align:center;padding-top:5px;position:relative;right:-12px;-webkit-user-select:none;">
        <img src="../assets/img_1.png" width="36px" height="36px" style="border-radius: 50%;" alt="加载失败">
      </div>

    </div>
    <div class="main">
      <!-- 左侧导航栏 -->
      <div class="nav" id="mynav" :class="nav_class?'open':'close'">
        <div class="" style="height: 50px;border-bottom: 1px solid #363b47;">

        </div>
        <el-menu ref="menu" :default-active="active_menu" class="el-menu-vertical-demo" @open="handleOpen"
                 @close="handleClose"
                 :collapse-transition="false" :collapse="isCollapse" background-color="#333333" text-color="#999999"
                 active-text-color="#fff" :unique-opened="uniqueOpened">

          <el-menu-item index="1" @click="home">
            <i class="el-icon-date" style="float: left;line-height: 55px;margin-left: 10px;"></i>
            <span class="menu-span" style="text-indent:17px;">首页</span>
          </el-menu-item>

          <el-submenu :index="item.index" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.mname }}</span>
            </template>
            <el-menu-item :index="set.index" class="se-menu" ref="se_menu" v-for="set in item.children" :key="set.id"
                          @click="addTab(set)">
              <span class="menu-span">{{ set.mname }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <div class="copyright" v-show="copyright" style="color:#fff;-webkit-user-select:none;">
          <p>Copyright &copy; 2012-2017 蓝鲸智云.</p>
          <br>
          <p>All Rights Reserved.</p>
        </div>
      </div>
      <!-- 中间页面 -->
      <div class="content" style="">
        <a @click="toLeft" style="float: left;width: 50px;height: 50px;border:1px solid #ccc;line-height: 50px;
                background-color: #fff;position: relative;z-index: 9;border-top: none;cursor: pointer;">
          <i class="el-icon-arrow-left" style="font-size: 20px;font-weight: bold;margin-left:14px;color:#999999"></i>
        </a>
        <a @click="toRight" style="float: right;width: 50px;height: 50px;border:1px solid #ccc;line-height: 50px;
                background-color: #fff;position: relative;border-top:none;z-index: 9;cursor: pointer;">
          <i class="el-icon-arrow-right" style="font-size:20px;font-weight:bold;margin-left:14px;color:#999999"></i>
        </a>
        <el-tabs v-model="editableTabsValue" class="mytab" closable @tab-remove="removeTab" @tab-click="changeTab">
          <el-tab-pane class="tab-panel" v-for="item in editableTabs" :key="item.name" :name="item.name">
            <span slot="label"><i class="title-i"></i> {{ item.title }}</span>
            <keep-alive>
              <component v-if="item.name === active_menu" :is="tabComponent"/>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Hh from '../components/home'
import Home2 from '../components/home2'
import Role from '../pages/role'
import User from '../pages/user'
import Upload from '../pages/file_upload'
import {bkDropdownMenu} from 'bk-magic-vue'

export default {
  components: {
    Hh,
    Home2,
    Role,
    User,
    bkDropdownMenu,
    Upload
  },
  name: 'home',
  data() {
    return {
      isHover: false,
      isCollapse: false,
      uniqueOpened: true,
      navActive: 0,
      nav_class: true,
      menus: [],
      editableTabsValue: '1',
      editableTabs: [{
        title: '首页',
        name: '1',
        content: '',
        tabComponent: Home2,
      }],
      tabIndex: 1,
      tabComponent: Home2,
      active_menu: '1',
      isDropdownShow: false,
      isLargeDropdownShow: false,
      userName: '',
      copyright: true,
    }
  },
  methods: {
    toLeft() {
      let div = document.getElementsByClassName('el-tabs__nav');
      div[0].style.transform = "translateX(0px)";
    },
    toRight() {
      // 获取标签总长度
      let divWidth = document.getElementsByClassName('el-tabs__nav');
      // 获取div长度
      let div = document.getElementsByClassName('el-tabs__nav-scroll');

      divWidth[0].style.transform = "translateX(-" + (divWidth[0].clientWidth - div[0].clientWidth + 10) + "px)";
    },
    handleOpen(key) {
      localStorage.setItem("menuIndex", key);
    },
    handleClose(key) {
      localStorage.removeItem(key);
    },
    open_close_menu() {
      this.isCollapse = !this.isCollapse;
      this.nav_class = !this.nav_class;
      this.copyright = !this.copy

    },
    // 首页
    home() {
      this.editableTabsValue = '1';
      this.tabComponent = Home2;
      this.active_menu = '1';
      // 关闭打开的菜单
      let menuIndex = localStorage.getItem("menuIndex");

      if (menuIndex !== null && menuIndex !== "") {
        this.$refs.menu.close(menuIndex);
      }
    },
    // 添加tab
    addTab(menu) {
      let flag = false;
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      tabs.forEach((tab) => {
        if (menu.index === tab.name) {
          activeName = tab.name;
          this.tabComponent = tab.tabComponent;
          flag = true;
        }
      });

      if (flag) {
        this.editableTabsValue = menu.index;
      } else {
        let newTabName = menu.index;
        this.editableTabs.push({
          title: menu.mname,
          name: newTabName,
          content: '',
          tabComponent: menu.component,
        });
        this.editableTabsValue = newTabName;
        this.tabComponent = menu.component;
      }
      this.active_menu = menu.index;
    },
    // 删除tab
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.tabComponent = nextTab.tabComponent;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.active_menu = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);

      if (this.active_menu === "1") {
        this.home();
      } else {
        // 遍历菜单
        let menus = this.menus;
        let index;

        for (let i = 0; i < menus.length; i++) {
          for (let j = 0; j < menus[i].children.length; j++) {
            if (menus[i].children[j].index === this.active_menu) {
              index = menus[i].index;
            }
          }
        }

        this.handleOpen(index);
      }
    },
    // 切换tab
    changeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName.name) {
        tabs.forEach((tab) => {
          if (tab.name === targetName.name) {
            activeName = tab.name;
            this.tabComponent = tab.tabComponent;
          }
        });
      }
      this.editableTabsValue = targetName.name;
      this.active_menu = targetName.name;

      if (targetName.name === "1") {
        this.home();
      } else {
        // 遍历菜单
        let menus = this.menus;
        let index;

        for (let i = 0; i < menus.length; i++) {
          for (let j = 0; j < menus[i].children.length; j++) {
            if (menus[i].children[j].index === this.active_menu) {
              index = menus[i].index;
            }
          }
        }

        this.handleOpen(index);
      }
    },
    // 获取菜单
    getMenu() {
      this.$axios({
        method: "post",
        url: this.HOST + "/getMenu",
        async: false,
        data: {
          "roleId": JSON.parse(localStorage.getItem("user")).roleId
        }

      })
        .then(res => {
          this.menus = res.data;
        })
        .catch(error => {
          console.log(error);
        })
    },
    logout() {
      this.$router.push("/login");
    }
  },
  mounted: function () {
    // 页面加载完成，获取menu
    this.getMenu();

    this.userName = JSON.parse(localStorage.getItem("user")).realName;
  }
}
</script>

<style scoped="scoped">
>>> .el-tabs__content::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

>>> .el-tabs__content::-webkit-scrollbar-thumb {
  border-radius: 12px;
  border: 4px solid rgba(0, 0, 0, 0);
  box-shadow: 12px 0 0 #A2A3A5 inset;
}

>>> .el-dialog__headerbtn:focus .el-dialog__close, >>> .el-dialog__headerbtn:hover .el-dialog__close {
  color: red;
}

>>> .el-card {
  border: none;
}

>>> #tab-1 {
  padding-right: 20px !important
}

>>> #tab-1 .el-icon-close {
  display: none;
}

>>> .el-tabs__item .el-icon-close:hover {
  background-color: #fff;
  color: red;
}

>>> .el-menu-item.is-active .menu-span {
  background: linear-gradient(to right, #076de2, #0445c0);
}

>>> .el-menu-item {
  padding: 0 10px !important;
}

>>> .menu-span {
  display: block;
  text-indent: 59px;
  border-radius: 4px;
}

>>> .el-icon-close {
  font-weight: bold;
  font-size: 18px;
  position: relative;
  top: 2px;
}

>>> .userInfo:hover {
  cursor: pointer;
}

>>> .link-a {
  text-decoration: none;
  color: #63656e;
}

>>> .userIfoLi:hover {
  cursor: pointer;
  background: #e4effe !important;
  color: #2e58ff !important;
}

>>> .userIfoLi:hover a {
  color: #2e58ff !important;
}

>>> .el-submenu__title:hover {
  color: #fff !important;
}

>>> .el-submenu__title:hover i {
  color: #fff !important;
}

>>> .se-menu:hover .menu-span {
  color: #fff !important;
  /* background: linear-gradient(to right, #076de2, #0445c0); */
}

>>> .se-menu:hover i {
  border-color: #ffd04b !important;
}

>>> .el-tabs,
>>> .el-tab-pane {
  height: 100%;
  background-color: #F5F6F7
}

>>> .el-tabs__content {
  margin-top: 5px;
  height: calc(100% - 53px);
  padding: 10px;
  background-color: #fff;
  overflow: auto;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, .5)
}

>>> .copyright {
  text-align: center;
  position: absolute;
  left: 20px;
  bottom: 24px;
  font-size: 10px;
  overflow: hidden;
  color: #8691b7;
}

>>> .el-tabs__header {
  margin: 0;
}

>>> .el-tabs__item {
  height: 40px;
  line-height: 40px;
  border-radius: 2px;
  outline: none;
}

>>> .el-tabs__active-bar {
  display: none;
}

>>> .el-tabs__item {
  padding: 0 15px !important;
  margin-left: 10px;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, .2);
  color: #999999;
  background-color: #fff;
}

>>> .el-tabs__nav-wrap::after {
  display: none;
}

>>> .el-tabs__nav-wrap {
  height: 49px;
  /* border-bottom: 1px solid #ccc; */
  background-color: #f5f6f7;
}

>>> .el-tabs__item.is-active {
  border: none;
  color: #333;
}

>>> .el-tabs__item:hover {
  color: #999999;
}

>>> .el-tabs__item.is-active:hover {
  color: #333;
}

>>> .el-tabs__nav-scroll {
  padding: 5px 0;
}

>>> .project-name {
  width: 200px;
  display: inline-block;
  overflow: hidden;
  margin-left: 15px;
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(to right, red, blue);
  -webkit-background-clip: text;
  color: transparent;
  height: 50px;
  line-height: 45px;
}

>>> .el-menu {
  height: 85%;
  overflow: auto;
}

>>> .el-menu::-webkit-scrollbar {
  /* 滚动条整体样式 */
  width: 8px;
  height: 1px;
}

>>> .el-menu::-webkit-scrollbar-thumb {
  /* 滚动条李的小方块 */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, .2);
  background-color: #000;
}

>>> .el-menu::-webkit-scrollbar-track {
  /* 滚动条内的轨道 */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, .2);
  background-color: #313541;
}

>>> .bk-icon:hover {
  cursor: pointer;
}

>>> .is-opened .el-submenu__title {
  color: #fff !important;
}

>>> .is-opened .el-submenu__title i {
  color: #fff !important;
  margin-right: 20px;
}

>>> .el-submenu__title i {
  margin-right: 20px !important;
}

>>> .is-active > .icon-i {
  border-color: rgb(255, 208, 75);
}

>>> .icon-i {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 2px solid #8691b7;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
}

>>> .el-submenu {
  /* border-bottom: 1px solid #363b47; */
}

>>> .el-submenu__title {
  background-color: #333333 !important;
}

>>> .el-col-12 {
  width: 241px;
  background-color: #313541;
  min-width: 241px;
}

>>> .el-menu-item,
>>> .el-menu {
  background-color: #333333 !important;
  border-right: none;
}

>>> .home {
  height: 100%;
}

>>> .head {
  height: 50px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}

>>> .main {
  display: flex;
  height: calc(100% - 50px);
}

>>> .nav {
  margin-top: -1px;
  height: calc(100% + 1px);
  background-color: #333333;
}

>>> .open {
  min-width: 240px;
  width: 240px;
}

>>> .close {
  width: 64px;
}

>>> .content {
  height: 100%;
  flex: 1;
  /* background-color: #0000FF; */
  width: calc(100% - 240px);
}

>>> .se-menu {
  background-color: #333333 !important;
}

>>> .title-i {
  height: 14px;
  width: 14px;
  background-color: #999999;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  top: 2px;
  margin-right: 5px;
}

>>> .el-tabs__item.is-active i {
  background-color: #4f83fd;
}

>>> .el-tabs__nav-prev,
>>> .el-tabs__nav-next {
  display: none;
}

>>> .el-tabs__nav-wrap.is-scrollable {
  padding: 0 !important;
}

>>> .el-tabs__nav {
  transition: 1s;
}
</style>
