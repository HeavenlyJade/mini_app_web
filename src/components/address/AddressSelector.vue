<template>
  <div id="app">
    <el-cascader
      size="large"
      :options="options"
      v-model="selectedOptions"
      :props="props"
      @change="handleChange"
      clearable
      placeholder="请选择地区">
    </el-cascader>
  </div>
</template>

<script>
import { codeToText, regionData } from 'element-china-area-data'

export default {
  name: 'AddressCascader',
  props: {
    // 模式选择：
    // province-city - 省市二级
    // region - 省市区三级
    // 以下模式名称保留向后兼容
    // province-city-plus - 同 province-city
    // region-plus - 同 region
    defaultCodes: {
      type: Object,
      default: () => ({})
    },
    mode: {
      type: String,
      default: 'region',
      validator: value => [
        'province-city',
        'province-city-plus',
        'region',
        'region-plus'
      ].includes(value)
    }
  },
  data () {
    return {
      options: [],
      selectedOptions: [],
      props: {
        label: 'label',
        value: 'value',
        children: 'children'
      }
    }
  },
  computed: {
    showCity () {
      return true
    },
    showDistrict () {
      return this.mode === 'region' || this.mode === 'region-plus'
    }
  },
  watch: {
    // 监听 defaultCodes.province_code 变化，当父组件异步加载完数据并更新 defaultCodes 时触发
    'defaultCodes.province_code': {
      handler (newVal) {
        if (newVal) {
          this.setDefaultFromCode(newVal)
        }
      },
      immediate: true // 组件创建时立即执行一次
    }
  },
  async created () {
    await this.initData()
    // 初始化数据后尝试设置默认值，但也由 watch 监听器处理以防异步加载的情况
    await this.initDefaultCodes()
  },
  methods: {
    // 新增方法，从编码设置默认值
    setDefaultFromCode (provinceCode) {
      try {
        // 处理 "11/1101/110102" 格式的地址编码
        const codeParts = provinceCode.split('/')
        if (codeParts.length === 0) return

        const provinceValue = codeParts[0]
        const cityValue = codeParts.length > 1 ? codeParts[1] : null
        const districtValue = codeParts.length > 2 ? codeParts[2] : null

        // 设置默认选中的省市区
        const selectedValues = []

        // 添加省份编码
        if (provinceValue) {
          selectedValues.push(provinceValue)
        }

        // 添加城市编码
        if (cityValue) {
          selectedValues.push(cityValue)
        }

        // 添加区县编码
        if (districtValue && this.showDistrict) {
          selectedValues.push(districtValue)
        }

        this.selectedOptions = selectedValues
      } catch (error) {
        console.error('设置默认地址失败:', error, '传入的province_code:', provinceCode)
      }
    },

    async initDefaultCodes () {
      const province_code = this.defaultCodes.province_code

      // 如果已有编码，则设置默认值
      if (province_code) {
        this.setDefaultFromCode(province_code)
      } else {
      }

      await this.$nextTick()
    },

    initData () {
      switch (this.mode) {
        case 'province-city':
        case 'province-city-plus':
          this.options = regionData.map(province => {
            const newProvince = { ...province }
            newProvince.children = newProvince.children.map(city => {
              return {
                value: city.value,
                label: city.label,
                children: []
              }
            })
            return newProvince
          })
          break

        case 'region':
        case 'region-plus':
        default:
          this.options = regionData
          break
      }
    },

    handleChange (value) {
      if (!value || value.length === 0) {
        this.$emit('change', {
          province: {
            code: '',
            name: ''
          },
          city: {
            code: '',
            name: ''
          },
          district: {
            code: '',
            name: ''
          },
          fullAddress: ''
        })
        return
      }

      const provinceCode = value[0]
      const cityCode = value.length > 1 ? value[1] : ''
      const districtCode = value.length > 2 ? value[2] : ''

      const result = {
        province: {
          code: provinceCode,
          name: codeToText[provinceCode] || ''
        },
        city: {
          code: cityCode,
          name: codeToText[cityCode] || ''
        },
        district: {
          code: districtCode,
          name: codeToText[districtCode] || ''
        },
        // 添加完整的地址字符串，格式为 "省/市/区"
        fullAddress: [
          codeToText[provinceCode],
          codeToText[cityCode],
          codeToText[districtCode]
        ].filter(Boolean).join('/')
      }

      this.$emit('change', result)
    },

    // 清空选择
    clear () {
      this.selectedOptions = []
    }
  }
}
</script>

<style scoped>
#app {
  display: flex;
}

.el-cascader {
  width: 100%;
  max-width: 600px;
}
</style>
