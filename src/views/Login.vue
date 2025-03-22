<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/login/loginPicture1.jpg" alt="图片">
      </div>
      <div class="login-right">
        <div class="login-form">
          <h2>欢迎来到起世逸源小程序管理系统</h2>
          <el-form :model="userItem" :rules="rules">
            <el-form-item label="账号：" prop="account">
              <el-input v-model="userItem.account" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input v-model="userItem.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="goHome" class="login-button">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import router from "@/router";

const userItem = ref({account: "admin", password: "123"});

const rules = reactive({
  account: [
    {required: true, message: '请输入账号', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
  ],
})

function goHome() {
  if (userItem.value.account == "admin" && userItem.value.password == "123") {
    // 生成模拟的token (实际项目中应该从后端获取)
    const token = generateToken(userItem.value.account);

    // 存储登录信息
    localStorage.setItem('token', token);
    localStorage.setItem('isLogin', 'true');
    localStorage.setItem('userInfo', JSON.stringify({
      account: userItem.value.account,
      loginTime: new Date().toISOString()
    }));

    ElMessage.success('登录成功');
    router.push("/home");
  } else {
    ElMessage.error("请输入正确的账号或密码");
  }
}

// 生成模拟的token (实际项目中应该从后端获取)
function generateToken(username: string): string {
  // 简单的token生成方法，实际项目中应该使用后端提供的token
  const randomPart = Math.random().toString(36).substring(2);
  const timestamp = new Date().getTime();
  return `${username}_${randomPart}_${timestamp}`;
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
