<template>
  <div class="login">
    <div class="body">
      <div class="text1">愿天堂</div>
      <div class="text2">没有程序BUG</div>
    </div>

    <div class="form-info">
      <form id="login-form">
        <div id="welcome">欢迎登录</div>
        <div id="old-account">没有帐号？
          <a @click="dialogFormVisible = true" id="regis">注册</a>
        </div>

        <span class="err-span" v-html="errorMsg"></span>

        <!-- 表单开始 -->
        <div class="form form1">

          <label for="userName" class="">用户名</label>
          <input v-focus type="text" id="userName" name="userName" ref="input" v-model="loginForm.userName"
            placeholder="请输入用户名" class="input input1" autocomplete="off">
          <span class="hint-span username-hint" ref="username-hint">用户名不能为空</span>
        </div>
        <!-- 密码 -->
        <div class="form form2">
          <label for="pwd" class="label-psw">密码</label>
          <input :type="pwd_type" id="pwd" name="password" placeholder="请输入密码" v-model="loginForm.password"
            class=" input input1" autocomplete="off">
          <i :class="pwd_icon" style="position:relative;right:30px;top:2px;" @mousedown="see_pwd"
            @mouseup="pwd_icon = 'iconfont icon-icon-test1',pwd_type = 'password'"></i>
          <span class="hint-span pwd-hint" ref="pwd-hint">密码不能为空</span>
        </div>
        <!-- 记住密码 -->
        <div class="form form2" style="width:100px;margin-left:98px;">
          <input type="checkbox" ref="remember" id="remember" name="remember" value="yes"
            v-model="loginForm.remember" />
          <label for="remember" class="" style="position:relative;top:-2px">记住密码</label>
        </div>
        <!-- 登录 -->
        <div id="register" style="margin-top:0">
          <input id="login-btn" class="register" type="button" value="登录" @click="login">
        </div>
      </form>
    </div>


    <!-- 注册 -->
    <el-dialog title="用户注册" :visible.sync="dialogFormVisible" center :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form :model="form" ref="form" :rules="rules">
        <!-- 用户名 -->
        <el-form-item prop="userName">
          <el-input v-model="form.userName" autocomplete="off" placeholder="输入用户名"></el-input>
        </el-form-item>
        <!-- 密码提示 -->
        <div class="pwdtip-div" v-show="show">
          <span class="pwdtip-sp">长度为8~14个字符</span>
          <span class="pwdtip-sp">包含大小写字母、数字、特殊字符或下划线</span>
          <span class="pwdtip-sp">不允许有空格、中文</span>
        </div>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off" placeholder="输入密码"></el-input>
          <i class="iconfont icon-tishi" ref="tip_i" style="position:absolute;right:8px" @mouseover="show_pwd_tip"
            @mouseleave="hide_pwd_tip"></i>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="affirmPassword">
          <el-input type="password" v-model="form.affirmPassword" autocomplete="off" placeholder="确认密码"></el-input>
        </el-form-item>
        <!-- 真实姓名 -->
        <el-form-item prop="realName">
          <el-input v-model="form.realName" autocomplete="off" placeholder="真实姓名"></el-input>
        </el-form-item>
        <!-- 性别 -->
        <el-form-item>
          <el-select v-model="form.gender" placeholder="选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <!-- 联系方式 -->
        <el-form-item prop="phone">
          <el-input v-model="form.phone" autocomplete="off" placeholder="联系方式"></el-input>
        </el-form-item>
        <!-- 出生年月 -->
        <el-form-item prop="birth">
          <el-date-picker v-model="form.birth" type="date" placeholder="出生日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userRegister">注 册</el-button>
        <el-button @click="resetForm">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import '../assets/css/iconfont.css'
  import qs from 'qs'
  export default {
    name: "login",
    data() {
      // 校验用户名
      var validateUserName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      // 校验密码
      var validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.affirmPassword !== '') {
            this.$refs.form.validateField('affirmPassword');
          }
          callback();
        }
      };
      // 校验确认密码
      var validateAffirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      // 校验真实姓名
      var validateRealName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入真实姓名'));
        } else {
          callback();
        }
      };
      // 校验生日
      var validateBirth = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择出生日期'))
        } else {
          callback();
        }
      };
      // 校验电话
      var validatePhone = (rule, value, callback) => {
        var reg =
          /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
        var reg2 = /^\d{3}-\d{8}$|^\d{4}-\d{7}$/;
        if (value === '') {
          callback(new Error('请输入联系方式'));
        } else if (!reg.test(value) && !reg2.test(value)) {
          callback(new Error('联系方式不合规'));
        } else {
          callback();
        }
      };
      return {
        errorMsg: '',
        show: false,
        pwd_icon: "iconfont icon-icon-test1",
        pwd_type: "password",
        dialogFormVisible: false,
        form: {
          userName: '',
          password: '',
          affirmPassword: '',
          realName: '',
          gender: '男',
          phone: '',
          birth: '',
        },
        loginForm: {
          userName: '',
          password: '',
          remember: ''
        },
        formLabelWidth: '68px',
        // 校验
        rules: {
          userName: [{
            validator: validateUserName,
            trigger: 'blur'
          }],
          password: [{
            validator: validatePwd,
            trigger: 'blur'
          }],
          affirmPassword: [{
            validator: validateAffirmPassword,
            trigger: 'blur'
          }],
          realName: [{
            validator: validateRealName,
            trigger: 'blur'
          }],
          phone: [{
            validator: validatePhone,
            trigger: 'blur',
          }],
          birth: [{
            validator: validateBirth,
            trigger: 'blur'
          }],
        }
      }
    },
    created() {
      // 绑定回车
      var _this = this;
      document.onkeydown = function(e) {
        let key = window.event.keyCode;
        if (key == 13) {
          _this.login();
        }
      };
    },
    methods: {
      handleClose(done) {
        // 重置表单
        this.$refs['form'].resetFields();
        done();
      },
      // 用户注册
      userRegister() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios.post(this.HOST + "/user/register", this.form)
              .then(res => {
                if (res.data.code === '200') {
                  // 重置表单
                  this.$refs['form'].resetFields();
                  // 关闭注册窗口
                  this.dialogFormVisible = false;
                  var _this = this;
                  setTimeout(function() {
                    _this.$message({
                      message: '注册成功',
                      type: 'success',
                      offset: 350,
                      duration: 2500
                    });
                  }, 1000);
                } else if (res.data.code === '100') {
                  this.$message({
                    message: '用户名已存在',
                    type: 'error',
                    offset: 350,
                    duration: 2500
                  });
                }
              })
              .catch(error => {
                console.log(error);
              })
          }
        })
      },
      // 查看密码
      see_pwd() {
        this.pwd_icon = "iconfont icon-icon-test see";
        this.pwd_type = "text";
      },
      // 查看密码提示
      show_pwd_tip() {
        this.show = true;
        this.$refs.tip_i.style.color = 'red';
      },
      // 隐藏密码提示
      hide_pwd_tip() {
        this.show = false;
        this.$refs.tip_i.style.color = '#000';
      },
      // 登录
      login() {
        if (this.loginForm.userName !== '' && this.loginForm.password !== '') {
          this.$axios.post(this.HOST + "/doLogin", this.loginForm)
            .then(res => {
              if (res.data.code !== '200') {
                this.errorMsg = res.data.msg;
              } else {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setTimeout(function() {
                  localStorage.removeItem("user");
                }, 1000 * 60 * 30);
                this.$router.push("/index");
              }
            })
            .catch(error => {
              this.$message({
                message: '网络异常！',
                type: 'error'
              });
              console.log(error);
            })
        } else {
          if (this.loginForm.userName === '') {
            this.$refs['username-hint'].style.display = 'inline-block';
          }
          if (this.loginForm.password === '') {
            this.$refs['pwd-hint'].style.display = 'inline-block';
          }
        }
      },
      resetForm() {
        this.$refs['form'].resetFields();
      },
    },
    directives: {
      focus: {
        // 指令的定义
        inserted: function(el) {
          el.focus(); // 自动聚焦
        }
      },
    },
    mounted() {
      let cookies = document.cookie.split(";");
      // 遍历cookie
      for (let i = 0; i < cookies.length; i++) {
        let coo = cookies[i].split("=");

        // 填充用户名
        if (coo[0].trim() === "userName") {
          this.loginForm.userName = coo[1];
          // 填充密码
        } else if (coo[0].trim() === "password") {
          let password = decodeURIComponent(coo[1]);
          this.loginForm.password = password;
          this.$refs.remember.checked = true;
        }
      }
      // 自动聚焦
      // this.$refs.input.focus();
    }
  }
</script>

<style>
  .err-span {
    font-size: 14px;
  }

  .pwdtip-div {
    width: 257px;
    height: 75px;
    /*border: 1px solid red;*/
    background: url(../assets/check-pwd-bg.png) no-repeat;
    background-size: 257px 75px;
    position: absolute;
    top: 72px;
    right: 31px;
    font-size: 12px;
  }

  .pwdtip-sp {
    display: inherit;
    color: #FFFFFF;
    margin-top: 5px;
    margin-left: 5px;
  }

  .el-date-editor.el-input {
    width: 100%;
  }

  .el-input__inner {
    border-color: #C0C4CC;
  }

  .el-form-item {
    margin-bottom: 30px;
  }

  .el-dialog--center .el-dialog__body {
    padding: 25px 30px 0px;
  }

  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    border-color: #2E58FF;
  }

  .el-select .el-input__inner:focus {
    border-color: #2E58FF;
  }

  .el-select .el-input.is-focus .el-input__inner {
    border-color: #2E58FF;
  }

  .iconfont:hover {
    cursor: pointer;
  }

  .see {
    color: blue;
  }

  .el-dialog {
    width: 25%;
  }

  .el-select {
    width: 100%;
  }

  .login {
    background-image: url(../assets/reg_bg_min.jpg);
    background-attachment: fixed;
    background-size: cover;
    height: calc(100%);
  }

  .body {
    padding: 1px;
    height: calc(100% - 2px);

  }

  .text1 {
    width: 170px;
    height: 50px;
    color: #fff;
    margin-top: 260px;
    margin-left: 200px;
    font-size: 50px;
    font-weight: bold;
  }

  .text2 {
    width: 300px;
    height: 40px;
    color: #fff;
    margin-top: 10px;
    margin-left: 200px;
    font-size: 30px;
    letter-spacing: 5px;
  }

  .form-info {
    width: 480px;
    height: 525px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    position: absolute;
    margin: auto;
    top: 0px;
    bottom: 0px;
    right: 140px;
  }

  #welcome {
    width: 480px;
    height: 50px;
    margin-left: 40px;
    margin-top: 55px;
    font-size: 36px;
    color: #000;
    font-weight: bold;
  }

  #old-account {
    width: 480px;
    height: 20px;
    font-size: 14px;
    color: #9B9B9B;
    float: left;
    margin-left: 40px;
  }

  #regis {
    color: #2e58ff;
    cursor: pointer;
    text-decoration: none;
    opacity: .8;
  }

  #regis:hover {
    opacity: 1;
  }

  .form {
    width: 480px;
    height: 40px;
    margin-left: 40px;
  }

  .form1 {
    /*margin-top: 90px;*/
  }

  .form2 {
    margin-top: 35px;
  }

  label {
    width: 58px;
    display: inline-block;
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }

  .label-psw {
    letter-spacing: 15px;
  }

  .input {
    height: 40px;
    /*margin-bottom: 15px;*/
    /*border-radius: 4px;*/
    border: 1px solid #E0E0E0;
    background-color: #fff;
    width: 310px;
    margin-left: -5px;
    outline: none;
    padding: 0 15px;
    font-size: 14px;
  }

  .input:focus {
    border: 1px solid #2e58ff !important;
  }

  #register {
    width: 480px;
    height: 50px;
    margin-left: 40px;
    margin-top: 35px;
    font-size: 36px;
    color: #000;
    font-weight: bold;
  }

  .register {
    width: 400px;
    height: 50px;
    background: #2e58ff;
    border-radius: 25px;
    border: rgba(255, 255, 255, 0.5) 1px solid;
    color: white;
    font-size: 16px;
    margin-top: 20px;
    cursor: pointer;
    opacity: .8;
  }

  .register:hover {
    opacity: 1;
  }

  .bk-icon:hover {
    cursor: pointer;
  }

  .layui-layer-title {
    background: #fff !important;
    border-bottom: none !important;
    cursor: inherit !important;
  }

  .layui-layer-resize {
    cursor: inherit !important;
  }

  .hint-span {
    display: none;
    color: red;
    margin-left: 60px;
    font-size: 14px;
  }

  .err-span {
    display: inherit;
    width: 115px;
    height: 18.5px;
    margin: 50px auto 20px auto;
    color: red;
  }
</style>
