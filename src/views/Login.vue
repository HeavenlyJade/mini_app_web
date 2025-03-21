<template>
    <div class="app">
      <canvas ref="canvas" :width="width" :height="height"></canvas>
      <div class="login">
        <img src="@/assets/login/loginPicture1.jpg" alt="图片">
        <div style="width: 450px;height: 640px;background-color: #ffffff;">
          <el-form :model="userItem"
                   :rules="rules"
                   style="display: flex;justify-content: center;align-items: center;flex-direction: column;height: 100%">
            <div style="margin-bottom: 15px">欢迎来到起世逸源</div>
            <el-form-item label="账号：" prop="account">
              <el-input style="width: 200px" v-model="userItem.account"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input style="width: 200px" v-model="userItem.password" type="password"></el-input>
            </el-form-item>
            <el-button type="primary" @click="goHome">登录</el-button>
          </el-form>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, toRefs} from "vue";
import {ElMessage} from "element-plus";
import router from "@/router";

const userItem = ref({account: "admin", password: "123"});


const rules = reactive({
  account: [
    {required: true, message: '请输入账号', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入账号', trigger: 'blur'},
  ],
})

function goHome() {
  if (userItem.value.account == "admin" && userItem.value.password == "123") {
    router.push("/home")
  } else {
    ElMessage.error("请输入正确的账号或密码")
  }
}

const canvas = ref(null);
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);

const stars = reactive([]);
const starCount = 500; // 星星数量
const starSpeed = 2; // 星星移动速度

// 生成随机颜色
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 生成随机星星
function createStars() {
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width.value,
      y: Math.random() * height.value,
      size: Math.random() * 3 + 1, // 星星大小
      color: getRandomColor(),
      speedX: (Math.random() - 0.5) * starSpeed,
      speedY: (Math.random() - 0.5) * starSpeed,
    });
  }
}

// 绘制星星
function drawStars() {
  const ctx = canvas.value.getContext('2d');
  ctx.clearRect(0, 0, width.value, height.value);

  stars.forEach((star, index) => {
    star.x += star.speedX;
    star.y += star.speedY;

    // 如果星星超出边界，则重置位置
    if (star.x < 0 || star.x > width.value) {
      star.x = Math.random() * width.value;
      star.speedX = (Math.random() - 0.5) * starSpeed;
    }
    if (star.y < 0 || star.y > height.value) {
      star.y = Math.random() * height.value;
      star.speedY = (Math.random() - 0.5) * starSpeed;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.fill();
    ctx.closePath();
  });

  requestAnimationFrame(drawStars);
}

// 组件挂载时初始化
onMounted(() => {
  createStars();
  drawStars();

  // 监听窗口大小变化
  // window.addEventListener('resize', () => {
  //   width.value = window.innerWidth;
  //   height.value = window.innerHeight;
  //   // 重新生成星星以适应新的窗口大小
  //   createStars();
  // });
});

// 导出响应式变量
const {width: widthRef, height: heightRef} = toRefs({width, height});
</script>

<style lang="less" scoped>
.app {
  z-index: 1;
  margin: 0;
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
}

canvas {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}

.login {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 11;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
