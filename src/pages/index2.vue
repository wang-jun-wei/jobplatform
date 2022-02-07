<template>
  <div class="monitor-navigation">
    <!-- <div style="margin-bottom: 20px">
      <bk-button theme="primary" @click="handleChangeNav">切换导航类型：{{curNav.name}}</bk-button>
    </div> -->
    <bk-navigation :header-title="nav.navId" :side-title="nav.title" :default-open="true" :navigation-type="curNav.nav"
      :need-menu="curNav.needMenu" @toggle="handleToggle">
      <template slot="header">
        <div class="monitor-navigation-header">
          <ol class="header-nav" v-if="curNav.nav === 'top-bottom'">
            <bk-popover v-for="(item,index) in header.list" :key="item.id" theme="light navigation-message"
              :arrow="false" offset="0, -5" placement="bottom"
              :tippy-options="{ 'hideOnClick': false, flipBehavior: ['bottom'] }">
              <li v-show="item.show" class="header-nav-item" :class="{ 'item-active': index === header.active }">
                {{item.name}}
              </li>
              <template slot="content">
                <ul class="monitor-navigation-nav">
                  <li class="nav-item" v-for="headerNavItem in curHeaderNav.navList" :key="headerNavItem.id">
                    {{headerNavItem.name}}
                  </li>
                </ul>
              </template>
            </bk-popover>
          </ol>
          <div v-else class="header-title">
            <span class="header-title-icon">
              <svg class="icon"
                style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4756">
                <path d="M416 480h320v64H416l96 96-48 48-176-176 176-176 48 48-96 96z" p-id="4757"></path>
              </svg>
            </span>
            {{nav.navId}}
          </div>

        </div>

        <bk-popover theme="light navigation-message" :arrow="false" offset="-20, 10" placement="bottom-start"
          :tippy-options="{ 'hideOnClick': false }">
          <div class="header-user" :class="{ 'is-left': curNav.nav === 'left-right' }" style="float: right;">
            Liang
            <i class="bk-icon icon-down-shape"></i>
          </div>
          <template slot="content">
            <ul class="monitor-navigation-admin">
              <li class="nav-item" v-for="userItem in user.list" :key="userItem">
                {{userItem}}
              </li>
            </ul>
          </template>
        </bk-popover>

      </template>
      <template slot="menu">
        <bk-navigation-menu ref="menu" @select="handleNavSelect" :default-active="nav.navId" :unique-opened="true"
          :before-nav-change="beforeNavChange" :toggle-active="nav.toggle">
          <bk-navigation-menu-group v-for="item in nav.list2" :key="item.name">
            <bk-navigation-menu-item :key="child.name" v-for="child in item.children" :id="child.name"
              :disabled="child.disabled" :icon="child.icon" :href="child.href"
              :has-child="child.children && !!child.children.length" :default-active="child.active">
              <span>{{child.name}}</span>
              <div slot="child">
                <bk-navigation-menu-item :key="set.name" v-for="set in child.children" :id="set.name"
                  :disabled="set.disabled" :href="set.href" :default-active="set.active">
                  <span>{{set.name}}</span>
                </bk-navigation-menu-item>
              </div>
            </bk-navigation-menu-item>
          </bk-navigation-menu-group>
        </bk-navigation-menu>
      </template>

      <div class="monitor-navigation-content">

      </div>
    </bk-navigation>
  </div>
</template>

<script>
  import {
    bkNavigation,
    bkNavigationMenu,
    bkNavigationMenuItem,
    bkNavigationMenuGroup,
    bkSelect,
    bkOption,
    bkPopover,
    bkButton
  } from 'bk-magic-vue'
  export default {
    name: 'monitor-navigation',
    components: {
      bkNavigation,
      bkNavigationMenu,
      bkNavigationMenuItem,
      bkNavigationMenuGroup,
      bkSelect,
      bkOption,
      bkPopover,
      bkButton
    },
    data() {
      return {
        navActive: 0,
        navMap: [{
            nav: 'left-right',
            needMenu: true,
            name: '左右结构导航'
          },
        ],
        nav: {
          list2: [{
              name: '其他配置',
              children: [{
                  name: '模板设置',
                  active: true,
                  icon: 'icon-tree-application-shape',
                  children: [{
                      name: '测试页一'
                    },
                    {
                      name: '测试页二'
                    },
                    {
                      name: '测试页三'
                    }
                  ]
                },
              ]
            }
          ],
          navId: '测试页一',
          toggle: false,
          submenuActive: false,
          title: '蓝鲸测试平台'
        },
        header: {

        },
        user: {
          list: [
            '项目管理',
            '权限中心',
            '退出'
          ]
        }
      }
    },
    computed: {
      curNav() {
        return this.navMap[this.navActive]
      },
      curHeaderNav() {
        return this.header.list[this.header.active] || {}
      }
    },
    methods: {
      handleNavSelect(id, item) {
        this.nav.navId = id
        console.info(`你选择了${id}`)
      },
      handleToggle(v) {
        this.nav.toggle = v
      },
      beforeNavChange(newId, oldId) {
        console.info(newId, oldId)
        return true
      },
      handleChangeNav() {
        this.navActive = (this.navActive + 1) % 3
      }
    }
  }
</script>

<style>
  .header-user:hover {
    cursor: pointer;
  }
  /* 以下样式是为了适应例子父级的宽高而设置 */
  .bk-navigation {
    width: 100% !important;
    height: 100% !important;
    outline: 1px solid #ebebeb;
  }

  .bk-navigation .bk-navigation-wrapper {
    height: calc(100vh - 252px) !important;
  }

  /* 以上样式是为了适应例子父级的宽高而设置 */

  .monitor-navigation-header {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: 14px;
  }

  .monitor-navigation-header .header-nav {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 0;
    margin: 0;
  }

  .monitor-navigation-header .header-nav-item {
    list-style: none;
    height: 50px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-right: 40px;
    color: #96A2B9;
    min-width: 56px
  }

  .monitor-navigation-header .header-nav-item.item-active {
    color: #FFFFFF !important;
  }

  .monitor-navigation-header .header-nav-item:hover {
    cursor: pointer;
    color: #D3D9E4;
  }

  .monitor-navigation-header .header-title {
    color: #63656E;
    font-size: 16px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-left: -6px;
  }

  .monitor-navigation-header .header-title-icon {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 28px;
    height: 28px;
    font-size: 28px;
    color: #3A84FF;
    cursor: pointer;
  }

  .monitor-navigation-header .header-select {
    width: 240px;
    margin-left: auto;
    margin-right: 34px;
    border: none;
    background: #252F43;
    color: #D3D9E4;
    -webkit-box-shadow: none;
    box-shadow: none
  }

  .monitor-navigation-header .header-select.is-left {
    background: #F0F1F5;
    color: #63656E;
  }

  .monitor-navigation-header .header-mind {
    color: #768197;
    font-size: 16px;
    position: relative;
    height: 32px;
    width: 32px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin-right: 8px
  }

  .monitor-navigation-header .header-mind.is-left {
    color: #63656E;
  }

  .monitor-navigation-header .header-mind.is-left:hover {
    color: #3A84FF;
    background: #F0F1F5
  }

  .monitor-navigation-header .header-mind-mark {
    position: absolute;
    right: 8px;
    top: 8px;
    height: 7px;
    width: 7px;
    border: 1px solid #27334C;
    background-color: #EA3636;
    border-radius: 100%
  }

  .monitor-navigation-header .header-mind-mark.is-left {
    border-color: #F0F1F5;
  }

  .monitor-navigation-header .header-mind:hover {
    background: -webkit-gradient(linear, right top, left top, from(rgba(37, 48, 71, 1)), to(rgba(38, 50, 71, 1)));
    background: linear-gradient(270deg, rgba(37, 48, 71, 1) 0%, rgba(38, 50, 71, 1) 100%);
    border-radius: 100%;
    cursor: pointer;
    color: #D3D9E4;
  }

  .monitor-navigation-header .header-help {
    color: #768197;
    font-size: 16px;
    position: relative;
    height: 32px;
    width: 32px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin-right: 8px
  }

  .monitor-navigation-header .header-help.is-left {
    color: #63656E;
  }

  .monitor-navigation-header .header-help.is-left:hover {
    color: #3A84FF;
    background: #F0F1F5
  }

  .monitor-navigation-header .header-help:hover {
    background: -webkit-gradient(linear, right top, left top, from(rgba(37, 48, 71, 1)), to(rgba(38, 50, 71, 1)));
    background: linear-gradient(270deg, rgba(37, 48, 71, 1) 0%, rgba(38, 50, 71, 1) 100%);
    border-radius: 100%;
    cursor: pointer;
    color: #D3D9E4;
  }

  .monitor-navigation-header .header-user {
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    color: #96A2B9;
    margin-left: 8px;
  }

  .monitor-navigation-header .header-user .bk-icon {
    margin-left: 5px;
    font-size: 12px;
  }

  .monitor-navigation-header .header-user.is-left {
    color: #63656E;
  }

  .monitor-navigation-header .header-user.is-left:hover {
    color: #3A84FF
  }

  .monitor-navigation-header .header-user:hover {
    cursor: pointer;
    color: #D3D9E4;
  }

  .monitor-navigation-content {
    height: calc(100% - 15px);
    background: #FFFFFF;
    -webkit-box-shadow: 0px 2px 4px 0px rgba(25, 25, 41, 0.05);
    box-shadow: 0px 2px 4px 0px rgba(25, 25, 41, 0.05);
    border-radius: 2px;
    border: 1px solid rgba(220, 222, 229, 1);
  }

  .monitor-navigation-footer {
    height: 52px;
    width: 100%;
    margin: 32px 0 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-top: 1px solid #DCDEE5;
    color: #63656E;
    font-size: 12px;
  }

  .monitor-navigation-message {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 360px;
    background-color: #FFFFFF;
    border: 1px solid #E2E2E2;
    border-radius: 2px;
    -webkit-box-shadow: 0px 3px 4px 0px rgba(64, 112, 203, 0.06);
    box-shadow: 0px 3px 4px 0px rgba(64, 112, 203, 0.06);
    color: #979BA5;
    font-size: 12px;
  }

  .monitor-navigation-message .message-title {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 48px;
    flex: 0 0 48px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #313238;
    font-size: 14px;
    padding: 0 20px;
    margin: 0;
    border-bottom: 1px solid #F0F1F5;
  }

  .monitor-navigation-message .message-list {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    max-height: 450px;
    overflow: auto;
    margin: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    padding: 0;
  }

  .monitor-navigation-message .message-list-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    padding: 0 20px;
  }

  .monitor-navigation-message .message-list-item .item-message {
    padding: 13px 0;
    line-height: 16px;
    min-height: 42px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    color: #63656E;
  }

  .monitor-navigation-message .message-list-item .item-date {
    padding: 13px 0;
    margin-left: 16px;
    color: #979BA5;
  }

  .monitor-navigation-message .message-list-item:hover {
    cursor: pointer;
    background: #F0F1F5;
  }

  .monitor-navigation-message .message-footer {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 42px;
    flex: 0 0 42px;
    border-top: 1px solid #F0F1F5;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    color: #3A84FF;
  }

  .monitor-navigation-nav {
    width: 150px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    background: #FFFFFF;
    border: 1px solid #E2E2E2;
    -webkit-box-shadow: 0px 3px 4px 0px rgba(64, 112, 203, 0.06);
    box-shadow: 0px 3px 4px 0px rgba(64, 112, 203, 0.06);
    padding: 6px 0;
    margin: 0;
    color: #63656E;
  }

  .monitor-navigation-nav .nav-item {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 32px;
    flex: 0 0 32px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 20px;
    list-style: none
  }

  .monitor-navigation-nav .nav-item:hover {
    color: #3A84FF;
    cursor: pointer;
    background-color: #F0F1F5;
  }

  .monitor-navigation-admin {
    width: 170px #63656E;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    background: #FFFFFF;
    border: 1px solid #E2E2E2;
    -webkit-box-shadow: 0px 3px 4px 0px rgba(64, 112, 203, 0.06);
    box-shadow: 0px 3px 4px 0px rgba(64, 112, 203, 0.06);
    padding: 6px 0;
    margin: 0;
    color: #63656E;
  }

  .monitor-navigation-admin .nav-item {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 32px;
    flex: 0 0 32px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 20px;
    list-style: none
  }

  .monitor-navigation-admin .nav-item:hover {
    color: #3A84FF;
    cursor: pointer;
    background-color: #F0F1F5;
  }

  .tippy-popper .tippy-tooltip.navigation-message-theme {
    padding: 0;
    border-radius: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
</style>
