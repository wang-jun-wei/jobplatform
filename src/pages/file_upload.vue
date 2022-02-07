<template>
  <div id="pload">
    <el-card class="box-card" style="min-height: 500px;">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
        style="width: 460px;">
        <el-form-item label="用户名:" prop="name">
          <el-input v-model="ruleForm.name" placeholder="输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="region">
          <el-select v-model="ruleForm.region" placeholder="选择性别" style="width: 100%;">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传头像:" prop="photo">
          <el-upload class="upload-demo" action="" :http-request="upload">
            <el-button size="large" type="primary" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="备注:" prop="desc">
          <el-input type="textarea" id="" v-model="ruleForm.desc" @blur="display = 'none'"
            @click.native="display = 'none'" class="mytext" resize="none"></el-input>
          <div id="" ref="mydiv" style="width: 360px;height:100px;border: 1px solid red;z-index: -1;
          padding: 5px 15px;position:absolute;top: 0;overflow: auto;line-height: 1.5;"></div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" icon="el-icon-circle-check">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
      </el-form>
      <span ref="span1">span</span>
    </el-card>
    <div class="tip" ref="tip" style="width: 100px;height: 120px;border: 1px solid #ccc;background-color: #fff;
      position: absolute;z-index: 9;" :style="{display: display}">

    </div>

    <div id="" style="width: 300px;height: 150px;border: 1px solid red;">
      好看是接电话工程计划书<br />
      感觉出发点开始
    </div>

    <div id="his"
      style="padding-top: 10px;background-color: #fff;width: 100%;height: 450px;box-shadow: 0 0 5px rgba(0,0,0,.2);">

    </div>

  </div>
</template>

<script>
  import qs from 'qs'
  export default {
    name: "pload",
    data() {
      return {
        display: "none",
        ruleForm: {
          name: '王君伟',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: "",
        },
        rules: {   
          name: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }, ],
          region: [{
            required: true,
            message: '请选择活动区域',
            trigger: 'change'
          }],
          photo: [{
            required: true
          }]
        }
      };
    },
    methods: {
      myclick() {
        alert(123);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      upload(file) {
        let formData = new FormData();

        formData.append("img", file.file);
        console.log(formData.get("img"));
        formData.append("data", JSON.stringify(this.ruleForm));

        this.$axios({
            url: this.HOST + "/file/uploadImg",
            method: "post",
            data: formData,
          })
          .then(data => {
            console.log(data);
          })
      }
    },
    watch: {
      'ruleForm.desc'(value) {
        // 替换换行
        value = value.replace(/\n/g, '<br>');

        if (value.indexOf("@") != -1) {
          value = value.replace(/@/g, "<span id='span' style='line-height:1.5'>@</span>");
          // 将文本填充到div中
          this.$refs.mydiv.innerHTML = value.substring(0, value.length);
          // 让div的滚动条保持在底部
          this.$refs.mydiv.scrollTop = this.$refs.mydiv.scrollHeight;
          let span = document.getElementById('span');
          // 获取span标签的top值
          let top = span.getBoundingClientRect().top;
          // 获取span标签的left值
          let left = span.getBoundingClientRect().left;
          // 获取导航栏
          let nav = document.getElementById('mynav');
          // 给提示框赋距离值
          this.$refs['tip'].style.top = top - span.clientTop - 235 + 'px';
          this.$refs['tip'].style.left = left - span.clientTop - nav.offsetWidth + 'px';
          this.display = 'block';
        } else {
          this.display = 'none';
        }
      }
    },
    mounted() {
      let chart = this.$echarts.init(document.getElementById('his'));
      var option = {
        title: {
          text: "历史任务执行情况",
          left: "left",
        },
        show: true,
        toolbox: {
          show: true,
        },
        color: ['#25CB98', '#5E7FF6'],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line"
          }
        },
        legend: {},
        grid: {
          left: "3%",
          right: "3%",
          bottom: "5%",
          top:'15%',
          containLabel: true
        },
        xAxis: {
          type: "category"
        },
        yAxis: {
          axisLine: {
            show: true
          }
        },
        dataset: {
          dimensions: ["product", "执行成功（个）", "总数（个）"],
          source: [{
              product: "12-20",
              "执行成功（个）": 22,
              "总数（个）": 31
            },
            {
              product: "12-21",
              "执行成功（个）": 23,
              "总数（个）": 23
            },
            {
              product: "12-22",
              "执行成功（个）": 34,
              "总数（个）": 34
            },
            {
              product: "12-23",
              "执行成功（个）": 43,
              "总数（个）": 45
            },
            {
              product: "12-24",
              "执行成功（个）": 22,
              "总数（个）": 22
            },
            {
              product: "12-25",
              "执行成功（个）": 33,
              "总数（个）": 33
            },

          ]
        },
        series: [{
            type: 'line',
            smooth: true,
            zlevel: 2,
            areaStyle: { // 折现下是否填充
              color: {
                type: 'line',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'red' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'blue' // 100% 处的颜色
                }],
                global: false,
              }
            },
          },
          {
            type: "line",
            smooth: true
          }
        ],
      }
      chart.setOption(option);
    }
  }
</script>

<style>
  .el-upload-list {
    display: none;
  }

  .mytext .el-textarea__inner {
    height: 100px;
  }
</style>
