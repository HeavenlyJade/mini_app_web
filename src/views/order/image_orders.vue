<template>
    <div class="page-container">
        <!-- 页面头部 -->
        <div class="page-header">
            <h2 class="page-title">图片订单管理</h2>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="search-panel">
            <el-form :inline="true" :model="searchParams" class="search-form">
                <el-form-item label="输入搜索:">
                    <el-input v-model="searchParams.keyword" placeholder="订单编号" clearable @keyup.enter="handleSearch" />
                </el-form-item>

                <el-form-item label="收货人:">
                    <el-input v-model="searchParams.receiver" placeholder="收货人姓名/手机号码" clearable />
                </el-form-item>

                <el-form-item label="提交时间:">
                    <el-date-picker v-model="searchParams.dateRange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"
                        :shortcuts="dateShortcuts" />
                </el-form-item>

                <el-form-item label="订单状态:">
                    <el-select v-model="searchParams.status" placeholder="全部" clearable>
                        <el-option v-for="status in statusOptions" :key="status.value" :label="status.label"
                            :value="status.value" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询搜索</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="20" class="more-filters">
                <el-col :span="8">
                    <el-form-item label="订单分类:">
                        <el-select v-model="searchParams.orderType" placeholder="全部" clearable>
                            <el-option v-for="type in orderTypeOptions" :key="type.value" :label="type.label"
                                :value="type.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="订单来源:">
                        <el-select v-model="searchParams.orderSource" placeholder="全部" clearable>
                            <el-option v-for="source in sourceOptions" :key="source.value" :label="source.label"
                                :value="source.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>

        <!-- 数据表格 -->
        <div class="table-container">
            <div class="table-header">
                <i class="el-icon-document"></i> 数据列表
            </div>

            <el-table v-loading="loading" :data="orderList" border style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="编号" width="70" />
                <el-table-column prop="order_no" label="订单编号" width="180" />
                <el-table-column prop="create_time" label="提交时间" width="180" />
                <el-table-column prop="receiver_name" label="收货人" width="100" />
                <el-table-column prop="product_amount" label="订单实际金额" width="100">
                    <template #default="scope">
                        <span class="amount">¥ {{ scope.row.product_amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pay_method" label="支付方式" width="100" />
                <el-table-column prop="order_source" label="订单来源" width="120" />
                <el-table-column prop="status" label="订单状态" width="100">
                    <template #default="scope">
                        <!-- 在模板中 -->
                        <el-tag :class="{ 'custom-primary': getStatusType(scope.row.status) === 'primary' }"
                            :type="getStatusType(scope.row.status) === 'primary' ? '' : getStatusType(scope.row.status)">
                            {{ scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="scope">
                        <el-button link size="small" @click="handleView(scope.row)">查看订单</el-button>
                        <template v-if="scope.row.status === '已关闭'">
                            <el-button link size="small" type="danger" @click="handleDelete(scope.row)">删除订单</el-button>
                        </template>
                        <template v-else-if="scope.row.status === '待发货'">
                            <el-button link size="small" type="warning" @click="handleShip(scope.row)">订单发货</el-button>
                        </template>
                        <template v-else-if="scope.row.status === '已完成'">
                            <el-button link size="small" type="success"
                                @click="handleDownload(scope.row)">订单跟踪</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
                <span class="total-info">共 {{ total }} 条</span>
                <el-select v-model="pageSize" class="page-size-select" @change="handleSizeChange">
                    <el-option :value="10" label="10条/页" />
                    <el-option :value="20" label="20条/页" />
                    <el-option :value="50" label="50条/页" />
                    <el-option :value="100" label="100条/页" />
                </el-select>

                <el-pagination background layout="prev, pager, next, jumper" :current-page="currentPage"
                    :page-size="pageSize" :total="total" @current-change="handleCurrentChange" />

                <div class="jumper">
                    前往
                    <el-input v-model="jumpPage" @keyup.enter="jumpToPage" class="jump-input" />
                    页
                </div>
            </div>
        </div>

        <!-- 批量操作 -->
        <div class="batch-operation" v-if="selectedOrders.length > 0">
            <el-select v-model="batchAction" placeholder="批量操作">
                <el-option label="批量删除" value="delete" />
            </el-select>
            <el-button @click="executeBatch">确定</el-button>
        </div>
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '@/utils/http'

export default {
    name: 'ImageOrders',
    data() {
        return {
            // 状态选项
            statusOptions: [
                { value: 'all', label: '全部' },
                { value: 'pending', label: '待发货' },
                { value: 'shipped', label: '已发货' },
                { value: 'completed', label: '已完成' },
                { value: 'cancelled', label: '已关闭' }
            ],

            // 订单类型选项
            orderTypeOptions: [
                { value: 'all', label: '全部' },
                { value: 'normal', label: '普通订单' },
                { value: 'photo', label: '照片订单' },
                { value: 'print', label: '冲印订单' }
            ],

            // 来源选项
            sourceOptions: [
                { value: 'all', label: '全部' },
                { value: 'app', label: 'APP订单' },
                { value: 'web', label: '网站订单' },
                { value: 'wechat', label: '微信订单' }
            ],

            // 日期快捷选项
            dateShortcuts: [
                {
                    text: '最近一周',
                    value: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        return [start, end]
                    }
                },
                {
                    text: '最近一个月',
                    value: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        return [start, end]
                    }
                },
                {
                    text: '最近三个月',
                    value: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        return [start, end]
                    }
                }
            ],

            // 搜索参数
            searchParams: {
                keyword: '',
                receiver: '',
                dateRange: [],
                status: 'all',
                orderType: 'all',
                orderSource: 'all'
            },

            // 表格相关数据
            loading: false,
            orderList: [],
            selectedOrders: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            jumpPage: '',
            batchAction: ''
        }
    },

    computed: {
        // 计算属性可以放这里
    },

    created() {
        // 初始化页面
        this.fetchOrders()
    },

    methods: {
        // 获取订单列表
        async fetchOrders() {
            this.loading = true
            try {
                const params = {
                    page: this.currentPage,
                    size: this.pageSize,
                    need_total_count: true,
                    keyword: this.searchParams.keyword || undefined,
                    receiver_name: this.searchParams.receiver || undefined,
                    status: this.searchParams.status !== 'all' ? this.searchParams.status : undefined,
                    order_type: this.searchParams.orderType !== 'all' ? this.searchParams.orderType : undefined,
                    order_source: this.searchParams.orderSource !== 'all' ? this.searchParams.orderSource : undefined,
                    start_time: this.searchParams.dateRange?.[0],
                    end_time: this.searchParams.dateRange?.[1]
                }

                const response = await http.get('/api/v1/mini_core/shop-order', params)

                if (response.data && response.data.code === 200) {
                    this.orderList = response.data.data
                    this.total = response.data.total || 0
                } else {
                    ElMessage.error('获取订单列表失败')
                }
            } catch (error) {
                console.error('获取订单列表出错:', error)
                ElMessage.error('获取订单列表失败，请重试')
            } finally {
                this.loading = false
            }
        },

        // 搜索
        handleSearch() {
            this.currentPage = 1
            this.fetchOrders()
        },

        // 重置搜索
        resetSearch() {
            Object.keys(this.searchParams).forEach(key => {
                if (key === 'dateRange') {
                    this.searchParams[key] = []
                } else {
                    this.searchParams[key] = key === 'status' || key === 'orderType' || key === 'orderSource' ? 'all' : ''
                }
            })
            this.handleSearch()
        },

        // 选择变化
        handleSelectionChange(selection) {
            this.selectedOrders = selection
        },

        // 页码变化
        handleCurrentChange(page) {
            this.currentPage = page
            this.fetchOrders()
        },

        // 每页条数变化
        handleSizeChange() {
            this.currentPage = 1
            this.fetchOrders()
        },

        // 跳转到指定页
        jumpToPage() {
            if (this.jumpPage && !isNaN(this.jumpPage)) {
                const pageNum = parseInt(this.jumpPage)
                if (pageNum >= 1 && pageNum <= Math.ceil(this.total / this.pageSize)) {
                    this.currentPage = pageNum
                    this.fetchOrders()
                    this.jumpPage = ''
                } else {
                    ElMessage.warning('页码超出范围')
                }
            }
        },

        // 获取状态对应的类型
        getStatusType(status) {
            switch (status) {
                case 'pending':
                case '待付款':
                    return 'warning'
                case 'paid':
                case '已付款':
                    return 'primary'
                case 'shipped':
                case '已发货':
                    return 'info'
                case 'completed':
                case '已完成':
                    return 'success'
                case 'cancelled':
                case '已取消':
                    return 'danger'
                default:
                    return ''
            }
        },

        // 查看订单
        handleView(row) {
            ElMessage.info(`查看订单: ${row.orderNumber}`)
            // 实际项目中可以跳转到订单详情页面
            // this.$router.push(`/orders/detail/${row.id}`)
        },

        // 删除订单
        handleDelete(row) {
            ElMessageBox.confirm(`确认删除订单 ${row.orderNumber}?`, '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await http.delete(`/api/v1/mini_core/orders/${row.id}`)
                    if (response.data && response.data.code === 200) {
                        ElMessage.success('删除成功')
                        this.fetchOrders()
                    } else {
                        ElMessage.error('删除失败')
                    }
                } catch (error) {
                    console.error('删除订单出错:', error)
                    ElMessage.error('删除失败，请重试')
                }
            }).catch(() => {
                // 取消删除，不做任何处理
            })
        },

        // 发货
        handleShip(row) {
            ElMessageBox.confirm(`确认发货订单 ${row.orderNumber}?`, '发货确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(async () => {
                try {
                    const response = await http.put(`/api/v1/mini_core/orders/${row.id}/ship`)
                    if (response.data && response.data.code === 200) {
                        ElMessage.success('发货成功')
                        this.fetchOrders()
                    } else {
                        ElMessage.error('发货失败')
                    }
                } catch (error) {
                    console.error('订单发货出错:', error)
                    ElMessage.error('发货失败，请重试')
                }
            }).catch(() => {
                // 取消发货，不做任何处理
            })
        },

        // 下载订单跟踪
        handleDownload(row) {
            ElMessage.success(`正在下载订单 ${row.orderNumber} 的跟踪信息`)
            // 这里应该是下载订单跟踪的逻辑
        },

        // 执行批量操作
        executeBatch() {
            if (!this.batchAction) {
                ElMessage.warning('请选择批量操作类型')
                return
            }

            if (this.selectedOrders.length === 0) {
                ElMessage.warning('请至少选择一个订单')
                return
            }

            if (this.batchAction === 'delete') {
                ElMessageBox.confirm(`确认删除选中的 ${this.selectedOrders.length} 个订单?`, '批量删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        const ids = this.selectedOrders.map(item => item.id)
                        const response = await http.deleteWithData('/api/v1/mini_core/orders/batch', { ids })
                        if (response.data && response.data.code === 200) {
                            ElMessage.success('批量删除成功')
                            this.fetchOrders()
                            this.batchAction = ''
                        } else {
                            ElMessage.error('批量删除失败')
                        }
                    } catch (error) {
                        console.error('批量删除出错:', error)
                        ElMessage.error('批量删除失败，请重试')
                    }
                }).catch(() => {
                    // 取消删除，不做任何处理
                })
            }
        }
    }
}
</script>

<style scoped lang="less">
.page-container {
    padding: 16px;
}

.page-header {
    margin-bottom: 16px;

    .page-title {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
    }
}

.search-panel {
    background-color: #f8f8f8;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 16px;

    .search-form {
        margin-bottom: 10px;
    }

    .more-filters {
        margin-top: 10px;
    }
}

.table-container {
    background-color: #fff;
    border-radius: 4px;

    .table-header {
        padding: 10px 16px;
        border-bottom: 1px solid #eee;
        font-weight: bold;
        display: flex;
        align-items: center;

        i {
            margin-right: 8px;
        }
    }
}

.pagination-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 16px;

    .total-info {
        margin-right: 16px;
    }

    .page-size-select {
        width: 120px;
        margin-right: 16px;
    }

    .jumper {
        margin-left: 16px;
        display: flex;
        align-items: center;

        .jump-input {
            width: 50px;
            margin: 0 4px;
        }
    }
}

.batch-operation {
    margin-top: 16px;
    display: flex;
    gap: 8px;
}

.amount {
    color: #f56c6c;
    font-weight: bold;
}

.text-gray {
    color: #909399;
    font-size: 12px;
    margin-top: 4px;
}

.amount {
    color: #f56c6c;
    font-weight: bold;

    &+.text-gray {
        margin-top: 2px;
    }
}

.custom-primary {
    background-color: #ecf5ff;
    border-color: #d9ecff;
    color: #409eff;
}

// 状态标签颜色
:deep(.el-tag--warning) {
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
}

:deep(.el-tag--success) {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
}

:deep(.el-tag--info) {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
}

:deep(.el-tag--primary) {
    background-color: #ecf5ff;
    border-color: #d9ecff;
    color: #409eff;
}

:deep(.el-table) {
    .cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}
</style>