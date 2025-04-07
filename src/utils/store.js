import http from './http'

// 获取门店分类数据
export async function loadStoreCategories() {
  try {
    const response = await http.get('/api/v1/mini_core/shop-store-category')
    
    if (response.data && response.data.code === 200) {
      // 处理数据,构建树形结构
      return buildCategoryTree(response.data.data)
    } else {
      throw new Error('获取门店分类数据失败')
    }
  } catch (error) {
    console.error('获取门店分类失败:', error)
    throw error
  }
}

// 构建分类树形结构
function buildCategoryTree(categories) {
  // 转换数据格式
  const formattedData = categories.map(item => ({
    value: item.id.toString(),
    label: item.name,
    parentId: item.parent_id
  }))

  // 构建树形结构
  const tree = []
  const map = {}

  // 首先建立映射关系
  formattedData.forEach(item => {
    map[item.value] = { ...item, children: [] }
  })

  // 构建树形结构
  formattedData.forEach(item => {
    const node = map[item.value]
    if (item.parentId === 0) {
      // 顶级分类
      tree.push(node)
    } else {
      // 子分类
      const parent = map[item.parentId]
      if (parent) {
        parent.children.push(node)
      }
    }
  })

  return tree
}