<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">{{ isViewMode ? '查看门店' : (isEdit ? '编辑门店' : '添加门店') }}</h2>
    </div>

    <!-- 页面内容区域 -->
    <div class="page-content">
      <el-form
        :model="storeForm"
        :rules="rules"
        ref="storeFormRef"
        label-width="120px"
        class="store-form"
        v-loading="loading"
        :disabled="isViewMode"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>

          <div class="form-row">
            <el-form-item label="门店名称" prop="name">
              <el-input v-model="storeForm.name" placeholder="请输入门店名称"></el-input>
            </el-form-item>

            <el-form-item label="门店编号" prop="store_code">
              <el-input v-model="storeForm.store_code" placeholder="请输入门店编号"></el-input>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="省市区" prop="province">
              <el-input v-model="storeForm.province" placeholder="请输入省市区"></el-input>
            </el-form-item>

            <el-form-item label="详细地址" prop="address">
              <el-input v-model="storeForm.address" placeholder="请输入详细地址"></el-input>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="地理位置">
              <div class="location-inputs">
                <el-input v-model="storeForm.latitude" placeholder="纬度" class="location-input"></el-input>
                <el-input v-model="storeForm.longitude" placeholder="经度" class="location-input"></el-input>
                <el-button type="primary" size="small" @click="openMapDialog" v-if="!isViewMode">打开地图选择位置</el-button>
              </div>
            </el-form-item>
          </div>
        </div>

        <!-- 服务配置 -->
        <div class="form-section">
          <div class="section-title">服务配置</div>

          <div class="form-row">
            <el-form-item label="接单模式" prop="receive_method">
              <el-radio-group v-model="storeForm.receive_method">
                <el-radio label="系统自动确认">系统自动确认</el-radio>
                <el-radio label="需要商家确认">需要商家确认</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="营业时间" prop="opening_hours">
              <el-input v-model="storeForm.opening_hours" placeholder="例如: 08:00-22:00"></el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 联系信息 -->
        <div class="form-section">
          <div class="section-title">联系信息</div>

          <div class="form-row">
            <el-form-item label="联系人" prop="contact_person">
              <el-input v-model="storeForm.contact_person" placeholder="请输入联系人"></el-input>
            </el-form-item>

            <el-form-item label="联系电话" prop="contact_phone">
              <el-input v-model="storeForm.contact_phone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="QQ" prop="qq">
              <el-input v-model="storeForm.qq" placeholder="请输入QQ号码"></el-input>
            </el-form-item>

            <el-form-item label="是否公开联系方式">
              <el-switch v-model="storeForm.is_public"></el-switch>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="WiFi名称" prop="wifi_name">
              <el-input v-model="storeForm.wifi_name" placeholder="请输入WiFi名称"></el-input>
            </el-form-item>

            <el-form-item label="WiFi密码" prop="wifi_password">
              <el-input v-model="storeForm.wifi_password" placeholder="请输入WiFi密码"></el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 门店图片 -->
        <div class="form-section">
          <div class="section-title">门店图片</div>

          <div class="form-row">
            <el-form-item label="门店Logo">
              <div class="upload-container">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :limit="1"
                  :file-list="logoFileList"
                  :on-change="handleLogoChange"
                  :on-remove="handleLogoRemove"
                  :disabled="isViewMode"
                >
                  <i class="el-icon-plus" v-if="!isViewMode"></i>
                </el-upload>
                <div class="upload-tip" v-if="!isViewMode">建议上传正方形图片，大小不超过2MB</div>
              </div>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="门店图片">
              <div class="upload-container">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :limit="5"
                  :file-list="imageFileList"
                  :on-change="handleImageChange"
                  :on-remove="handleImageRemove"
                  :disabled="isViewMode"
                >
                  <i class="el-icon-plus" v-if="!isViewMode"></i>
                </el-upload>
                <div class="upload-tip" v-if="!isViewMode">最多上传5张图片，每张大小不超过2MB</div>
              </div>
            </el-form-item>
          </div>
        </div>

        <!-- 其他信息 -->
        <div class="form-section">
          <div class="section-title">其他信息</div>

          <div class="form-row">
            <el-form-item label="经营范围" prop="business_scope">
              <el-input type="textarea" v-model="storeForm.business_scope" placeholder="请输入经营范围"></el-input>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="客户须知" prop="customer_notice">
              <el-input type="textarea" v-model="storeForm.customer_notice" placeholder="请输入客户须知"></el-input>
            </el-form-item>
          </div>

          <div class="form-row full-width">
            <el-form-item label="门店介绍" prop="description">
              <el-input type="textarea" v-model="storeForm.description" :rows="4" placeholder="请输入门店介绍"></el-input>
            </el-form-item>
          </div>

          <div class="form-row full-width">
            <el-form-item label="门店特色" prop="features">
              <el-input type="textarea" v-model="storeForm.features" :rows="4" placeholder="请输入门店特色"></el-input>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="排序" prop="sort_order">
              <el-input-number v-model="storeForm.sort_order" :min="0" :step="1"></el-input-number>
              <div class="form-tip">数字越小排序越靠前</div>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="storeForm.status">
                <el-radio label="正常">正常</el-radio>
                <el-radio label="停用">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>

        <!-- 表单操作 - 仅在非查看模式下显示 -->
        <div class="form-actions" v-if="!isViewMode">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </div>

        <!-- 查看模式下的返回按钮 -->
        <div class="form-actions" v-else>
          <el-button @click="cancel">返回</el-button>
        </div>
      </el-form>
    </div>

    <!-- 地图选择对话框 -->
    <el-dialog
      title="选择位置"
      :visible.sync="mapDialogVisible"
      width="70%"
    >
      <div class="map-container">
        <!-- 这里放置地图组件，此处使用占位 -->
        <div class="map-placeholder">
          <p>地图选择组件占位符</p>
          <p>实际应用中可以集成高德地图、百度地图等第三方地图API</p>
        </div>
      </div>
      <div class="map-coordinates">
        <div class="coordinate-item">
          <span class="coordinate-label">纬度：</span>
          <el-input v-model="tempLatitude" placeholder="纬度"></el-input>
        </div>
        <div class="coordinate-item">
          <span class="coordinate-label">经度：</span>
          <el-input v-model="tempLongitude" placeholder="经度"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mapDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '@/utils/http'
export default {
  name: 'StoreManagement',
  data() {
    return {
      // 页面模式标识
      isViewMode: false, // 新增的查看模式标志

      // 表单数据
      storeForm: {
        id: 0,
        name: '',
        type: '',
        store_code: '',
        fresh_delivery: '',
        receive_method: '系统自动确认',
        takeout_enabled: false,
        self_pickup_enabled: false,
        dine_in_enabled: false,
        store_category: null,
        province: '',
        address: '',
        contact_person: '',
        contact_phone: '',
        is_public: false,
        qq: '',
        service_fee_rate: 0,
        gst_tax_rate: 0,
        print_config: '',
        wechat_config: '',
        business_scope: '',
        description: '',
        features: '',
        latitude: null,
        longitude: null,
        sort_order: 0,
        status: '正常',
        store_logo: '',
        store_image: '',
        opening_hours: '',
        delivery_price: 0,
        min_order_amount: 0,
        door_info: '',
        wifi_name: '',
        wifi_password: '',
        customer_notice: ''
      },

      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入门店名称', trigger: 'blur' },
          { max: 128, message: '门店名称长度不能超过128个字符', trigger: 'blur' }
        ],
        store_code: [
          { max: 32, message: '门店编号长度不能超过32个字符', trigger: 'blur' }
        ],
        contact_person: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        contact_phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择门店状态', trigger: 'change' }
        ]
      },

      // 门店分类选项
      storeCategoryOptions: [],

      // 文件列表
      logoFileList: [],
      imageFileList: [],

      // 页面状态
      loading: false,
      isEdit: false,
      storeId: null,

      // 地图对话框
      mapDialogVisible: false,
      tempLatitude: null,
      tempLongitude: null
    }
  },
  created() {
    // 判断页面模式
    this.storeId = this.$route.query.id;
    this.isEdit = !!this.storeId;
    this.isViewMode = this.$route.query.mode === 'view'; // 从路由参数获取查看模式参数

    // 初始化数据
    this.fetchStoreCategories();

    if (this.storeId) {
      this.fetchStoreDetail();
    } else {
      // 设置一些默认值
      this.storeForm.status = '正常';
      this.storeForm.receive_method = '系统自动确认';
    }
  },
  methods: {
    // 获取门店详情
    async fetchStoreDetail() {
      this.loading = true;
      try {
        const response = await http.get(`/api/v1/mini_core/shop-store/${this.storeId}`);

        if (response.data && response.data.data) {
          // 填充表单数据
          this.storeForm = response.data.data;

          // 处理图片数据
          if (this.storeForm.store_logo) {
            this.logoFileList = [{
              name: 'logo',
              url: this.storeForm.store_logo
            }];
          }

          if (this.storeForm.store_image) {
            // 如果是JSON字符串，则解析
            try {
              const images = JSON.parse(this.storeForm.store_image);
              this.imageFileList = images.map((url, index) => ({
                name: `image_${index}`,
                url
              }));
            } catch(e) {
              // 如果不是JSON字符串，则作为单个图片处理
              this.imageFileList = [{
                name: 'image',
                url: this.storeForm.store_image
              }];
            }
          }
        } else {
          this.$message.error('获取门店详情失败');
        }
      } catch(error) {
        console.error('获取门店详情错误:', error);
        this.$message.error('获取门店详情失败: ' + (error.message || '网络错误'));
      } finally {
        this.loading = false;
      }
    },

    // 获取门店分类列表
    async fetchStoreCategories() {
      try {
        const response = await http.get('/api/v1/mini_core/shop-store-category');

        if (response.data && response.data.data) {
          this.storeCategoryOptions = response.data.data;
        }
      } catch(error) {
        console.error('获取门店分类错误:', error);
        this.$message.error('获取门店分类失败: ' + (error.message || '网络错误'));
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.storeFormRef.validate(async valid => {
        if (!valid) {
          this.$message.warning('请填写必填字段');
          return;
        }

        // 处理图片数据
        if (this.logoFileList.length > 0) {
          // 如果有新上传的文件需要先上传
          if (this.logoFileList[0].raw) {
            const logoUrl = await this.uploadFile(this.logoFileList[0].raw);
            this.storeForm.store_logo = logoUrl;
          } else {
            this.storeForm.store_logo = this.logoFileList[0].url;
          }
        } else {
          this.storeForm.store_logo = '';
        }

        // 处理门店图片
        if (this.imageFileList.length > 0) {
          const imageUrls = [];
          for (const item of this.imageFileList) {
            if (item.raw) {
              const imageUrl = await this.uploadFile(item.raw);
              imageUrls.push(imageUrl);
            } else {
              imageUrls.push(item.url);
            }
          }
          this.storeForm.store_image = JSON.stringify(imageUrls);
        } else {
          this.storeForm.store_image = '';
        }

        this.loading = true;
        try {
          let response;

          if (this.isEdit) {
            // 更新门店
            response = await http.put(`/api/v1/mini_core/shop-store/${this.storeId}`, this.storeForm);
          } else {
            // 创建门店
            response = await http.post('/api/v1/mini_core/shop-store', this.storeForm);
          }

          if (response.data && response.data.code === 200) {
            this.$message.success(this.isEdit ? '门店更新成功' : '门店创建成功');
            this.cancel();
          } else {
            this.$message.error(response.data?.message || '操作失败');
          }
        } catch(error) {
          console.error('提交表单错误:', error);
          this.$message.error('提交失败: ' + (error.message || '网络错误'));
        } finally {
          this.loading = false;
        }
      });
    },

    // 上传文件
    async uploadFile(file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await http.uploadImage(formData);
        if (response.data && response.data.url) {
          return response.data.url;
        } else {
          this.$message.error('上传图片失败');
          return '';
        }
      } catch(error) {
        console.error('上传图片错误:', error);
        this.$message.error('上传图片失败: ' + (error.message || '网络错误'));
        return '';
      }
    },

    // Logo上传相关方法
    handleLogoChange(file, fileList) {
      this.logoFileList = fileList.slice(-1); // 只保留最后一个文件
    },

    handleLogoRemove() {
      this.logoFileList = [];
    },

    // 图片上传相关方法
    handleImageChange(file, fileList) {
      this.imageFileList = fileList.slice(0, 5); // 最多5张图片
    },

    handleImageRemove(file, fileList) {
      this.imageFileList = fileList;
    },

    // 打开地图选择对话框
    openMapDialog() {
      window.open('https://lbs.qq.com/getPoint/', '_blank');
    },

    // 确认地图位置选择
    confirmLocation() {
      this.storeForm.latitude = this.tempLatitude;
      this.storeForm.longitude = this.tempLongitude;
      this.mapDialogVisible = false;
    },

    // 取消
    cancel() {
      this.$router.push('/shop/store/list');
    }
  }
}
</script>

<style scoped>
.page-container {
  width: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.page-content {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.store-form {
  width: 100%;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.form-row .el-form-item {
  flex: 1;
  min-width: 300px;
  margin-right: 20px;
}

.form-row.full-width .el-form-item {
  width: 100%;
  flex: auto;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.location-inputs {
  display: flex;
  align-items: center;
}

.location-input {
  width: 120px;
  margin-right: 10px;
}

.upload-container {
  display: flex;
  flex-direction: column;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
}

.service-methods {
  display: flex;
  gap: 20px;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.map-container {
  width: 100%;
  height: 400px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 20px;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.map-coordinates {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.coordinate-item {
  display: flex;
  align-items: center;
}

.coordinate-label {
  margin-right: 10px;
  width: 50px;
  text-align: right;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .form-row .el-form-item {
    width: 100%;
    margin-right: 0;
  }

  .location-inputs {
    flex-direction: column;
    align-items: flex-start;
  }

  .location-input {
    width: 100%;
    margin-bottom: 10px;
  }

  .map-coordinates {
    flex-direction: column;
  }
}
</style>
