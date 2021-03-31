<template>
  <section class="order-container">
    <header>
      <el-form :inline="true" :model="searchFormData" label-width="80px">
        <el-form-item label="商户名称">
          <el-input style="width: 140px" v-model="searchFormData.shop_name" placeholder="请输入搜索内容"></el-input>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input style="width: 140px" v-model="searchFormData.car_number" placeholder="请输入搜索内容"></el-input>
        </el-form-item>
        <el-form-item label="使用时间">
          <el-date-picker
            style="width: 350px"
            class="shop-custom-datepicker hide-clear-btn"
            v-model="searchFormData.currentData"
            type="datetimerange"
            :editable="true"
            range-separator="至"
            :default-time="['00:00:00','23:59:59']"
            start-placeholder="请输入时间"
            end-placeholder="请输入时间"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="shop-clear-style">
          <el-button type="primary" @click="handledSearch" icon="el-icon-search">搜索</el-button>
          <el-button type="primary" @click="handledRefresh" icon="el-icon-refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </header>
    <div class="table-container">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="ticket_id" label="优惠券编号" align="center"></el-table-column>
        <el-table-column prop="shop_name" label="商户名称" align="center"></el-table-column>
        <el-table-column prop="car_number" label="车牌号" align="center"></el-table-column>
        <el-table-column prop="order_id" label="订单号" align="center"></el-table-column>
        <el-table-column prop="use_time" label="使用时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deduction_amount" label="抵扣额度" align="center"></el-table-column>
        <el-table-column prop="total" label="停车费总额" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 40, 80]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
import { parseTime } from '@/utils'
import { CarTypeList } from '@/utils/key'
import { getReductionRecordList } from '@/api/park/order_manage'
export default {
  name: 'ReductionRecord',
  data() {
    return {
      loading: false,
      searchFormData: {
        currentData: [],
        use_time: 'between',
        orderby: 'desc',
        orderfield: 'id',
        page: 1,
        rp: 20,
        shop_name: '',
        car_number: ''
      },
      collectorList: [],
      carConstList: CarTypeList,
      comAreaList: [],
      tableData: [],
      total: 0,
      currentPage: 1
    }
  },
  created() {
    this.handledRefresh()
  },
  filters: {
    formatTime: function(val) {
      return parseTime(val)
    }
  },
  methods: {
    /**
     * @description 分页器的回调函数
     * @param { function } handleSizeChange 每页多少条数据
     * @param { function } handleCurrentChange 当前页
     */
    handleSizeChange(val) {
      // doing
      this.$set(this.searchFormData, 'rp', val)
      this.getTableData()
    },
    handleCurrentChange(val) {
      // doing
      this.$set(this.searchFormData, 'page', val)
      this.getTableData()
    },
    handledRefresh() {
      this.searchFormData = {
        currentData: [],
        use_time: 'between',
        orderby: 'desc',
        orderfield: 'id',
        page: 1,
        rp: 20,
        shop_name: '',
        car_number: ''
      }
      this.getTableData()
    },
    handledSearch() {
      // doing
      const { currentData } = this.searchFormData
      const timeType = Object.prototype.toString.call(currentData)
      if (timeType === '[object Array]' && currentData.length > 0) { // 已经选了时间
        this.$set(this.searchFormData, 'use_time_start', currentData[0])
        this.$set(this.searchFormData, 'use_time_end', currentData[1])
      } else {
        this.$set(this.searchFormData, 'use_time_start', undefined)
        this.$set(this.searchFormData, 'use_time_end', undefined)
      }
      this.$set(this.searchFormData, 'page', 1)// 触发搜索，当前页归一
      this.$nextTick(() => {
        this.getTableData()
      })
    },

    /**
     * @description 获取表格数据
     */
    getTableData() {
      // doing
      this.loading = true
      getReductionRecordList(this.searchFormData).then((response) => {
        // console.log('response: ', response)
        this.loading = false
        const data = response.data
        const len = data.rows.length
        if (len > 0) {
          this.tableData = data.rows
          this.total = data.total
        } else {
          this.tableData = []
          this.total = 0
        }
      }).catch(err => {
        this.loading = false
        console.error('fetch data fail: ', err)
      })
    }
  }
}
</script>

<style scoped>
  .pagination-container{
    padding: 16px 0;
    text-align: right;
  }
</style>
