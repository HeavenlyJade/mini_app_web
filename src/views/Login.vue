<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/login/loginPicture1.jpg" alt="图片">
      </div>
      <div class="login-right">
        <div class="login-form">
          <h2>欢迎来到起世逸源小程序管理系统</h2>
          <el-form :model="userItem" :rules="rules" ref="loginForm">
            <el-form-item label="账号：" prop="username">
              <el-input v-model="userItem.username" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input v-model="userItem.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login" class="login-button" :loading="loading">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import router from "@/router";
import axios from "axios";

// 获取全局属性
const { proxy } = getCurrentInstance() || { proxy: null };


// 登录表单数据
const userItem = ref({
  username: '',
  password: ''
});

// 登录状态
const loading = ref(false);
const loginForm = ref<FormInstance>();

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
});

// 登录方法
async function login() {
  if (!loginForm.value) return;

  await loginForm.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // 使用全局API变量
        // 调用登录API
        const response = await axios.post('/api/v1/users/login', {
          username: userItem.value.username,
          password: userItem.value.password
        });
        console.log(response)
        // 处理登录成功响应
        if (response.data) {
          // 存储登录信息
          localStorage.setItem('token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          localStorage.setItem('isLogin', 'true');
          localStorage.setItem('userInfo', JSON.stringify({
            username: userItem.value.username,
            loginTime: new Date().toISOString()
          }));

          ElMessage.success(response.data.msg || '登录成功');
          router.push("/home");
        } else {
          ElMessage.error(response.data.msg || '登录失败');
        }
      } catch (error: any) {
        console.error('登录请求失败:', error);
        ElMessage.error(error.response?.data?.msg || '登录失败，请检查网络连接');
      } finally {
        loading.value = false;
      }
    } else {
      ElMessage.warning('请填写完整的登录信息');
      return false;
    }
  });
}

// 组件挂载时初始化
onMounted(() => {
  // 检查用户是否已登录，如果已登录则直接跳转到首页
  if (localStorage.getItem('isLogin') === 'true' && localStorage.getItem('token')) {
    router.push('/home');
  }
});
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-box {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 900px;
  height: 550px;
}

.login-left {
  flex: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 40px;
}

.login-form {
  width: 100%;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-weight: 500;
    color: #333;
  }

  .el-form-item {
    margin-bottom: 25px;
  }

  .login-button {
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>
