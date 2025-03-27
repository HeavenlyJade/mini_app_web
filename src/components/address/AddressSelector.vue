<template>
  <div class="address-selector">
    <!-- 省份选择 -->
    <el-select
      v-model="selectedProvince"
      placeholder="请选择省份"
      clearable
      @change="handleProvinceChange"
    >
      <el-option
        v-for="province in provinces"
        :key="province.value"
        :label="province.label"
        :value="province.value"
      />
    </el-select>

    <!-- 城市选择 -->
    <el-select
      v-model="selectedCity"
      placeholder="请选择城市"
      clearable
      @change="handleCityChange"
      :disabled="!selectedProvince"
      v-if="showCity"
    >
      <el-option
        v-for="city in cities"
        :key="city.value"
        :label="city.label"
        :value="city.value"
      />
    </el-select>

    <!-- 区县选择 -->
    <el-select
      v-model="selectedDistrict"
      placeholder="请选择区县"
      clearable
      :disabled="!selectedCity"
      v-if="showDistrict"
      @change="handleDistrictChange"

    >
      <el-option
        v-for="district in districts"
        :key="district.value"
        :label="district.label"
        :value="district.value"
      />
    </el-select>
  </div>
</template>

<script>
import {
  codeToText,
  provinceAndCityData,
  regionData,
  pcaTextArr
} from 'element-china-area-data'

export default {
  name: 'AddressSelector',
  props: {
    // 模式选择：
    // province-city - 省市二级不带全部
    // province-city-plus - 省市二级带全部
    // region - 省市区三级不带全部
    // region-plus - 省市区三级带全部
    defaultCodes: {
      type: Object,
      default: () => ({})
    },
    mode: {
      type: String,
      default: 'region-plus',
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
      provinces: [],
      cities: [],
      districts: [],
      selectedProvince: '',
      selectedCity: '',
      selectedDistrict: ''
    }
  },
  computed: {
    showCity () {
      return this.mode.includes('city') || this.mode.includes('region')
    },
    showDistrict () {
      return this.mode.startsWith('region')
    }
  },
  async created () {
    await this.initData()
    await this.initDefaultCodes()
  },
  methods: {
    async initDefaultCodes () {
      const provinceStr = this.defaultCodes.province || ''
      if (!provinceStr) return
      const [provinceName, cityName, districtName] = provinceStr.split('/')
      const cache = new Map()
      const findCode = (name, data) => {
        if (cache.has(name)) return cache.get(name)
        for (const item of data) {
          if (item.label === name) {
            cache.set(name, item.value)
            return item.value
          }
          if (item.children) {
            const code = findCode(name, item.children)
            if (code) {
              cache.set(name, code)
              return code
            }
          }
        }
        return null
      }
      // 处理省级
      const provinceCode = findCode(provinceName, this.provinces)
      if (!provinceCode) {
        console.warn(`未找到省份：${provinceName}`)
        return
      }
      this.selectedProvince = provinceCode
      await this.$nextTick()
      await this.handleProvinceChange(provinceCode)
      // 处理市级
      if (cityName && this.cities.length) {
        const cityCode = findCode(cityName, this.cities)
        if (cityCode) {
          this.selectedCity = cityCode
          await this.$nextTick()
          await this.handleCityChange(cityCode)
          await this.$nextTick() // 等待区县数据加载完成
          // 处理区级
          if (districtName && this.districts.length) {
            const districtCode = findCode(districtName, this.districts)
            if (districtCode) {
              this.selectedDistrict = districtCode
            }
          }
        }
      }
    },
    initData () {
      switch (this.mode) {
        case 'province-city':
          this.provinces = provinceAndCityData
          break
        case 'province-city-plus':
          this.provinces = provinceAndCityData
          break
        case 'region':
          this.provinces = regionData
          break
        case 'region-plus':
          this.provinces = pcaTextArr
          break
      }
    },

    handleProvinceChange (value) {
      // 重置下级选项
      this.cities = []
      this.districts = []
      this.selectedCity = ''
      this.selectedDistrict = ''

      const province = this.provinces.find(p => p.value === value)
      if (province && province.children) {
        this.cities = province.children
      }
      this.emitChange()
    },

    handleCityChange (value) {
      // 重置区县选项
      this.districts = []
      this.selectedDistrict = ''

      const city = this.cities.find(c => c.value === value)
      if (city && city.children && this.showDistrict) {
        this.districts = city.children
      }
      this.emitChange()
    },
    // 在methods中添加
    handleDistrictChange(value) {
      this.emitChange()
    },

    emitChange () {
      const result = {
        province: {
          code: this.selectedProvince,
          name: codeToText[this.selectedProvince]
        },
        city: {
          code: this.selectedCity,
          name: codeToText[this.selectedCity]
        },
        district: {
          code: this.selectedDistrict,
          name: codeToText[this.selectedDistrict]
        }
      }

      this.$emit('change', result)
    },

    // 清空选择
    clear () {
      this.selectedProvince = ''
      this.selectedCity = ''
      this.selectedDistrict = ''
      this.cities = []
      this.districts = []
    }
  }
}
</script>

<style scoped>
.address-selector {
  display: flex;
  gap: 10px;
}

.address-selector > .el-select {
  flex: 1;
  max-width: 200px;
}
</style>
