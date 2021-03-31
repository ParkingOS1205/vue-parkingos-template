<template>
  <section class="order-container">
    <header>
      <el-form :inline="true" :model="searchFormData" label-width="80px">
        <el-form-item class="shop-clear-style">
          <el-button type="primary" @click="openAddDialog" icon="el-icon-plus">添加</el-button>
          <el-button type="primary" @click="handledRefresh" icon="el-icon-refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </header>
    <div class="table-container">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="编号" align="center"></el-table-column>
        <el-table-column prop="car_number" label="车牌号" align="center"></el-table-column>
        <el-table-column prop="ctime" label="添加时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ctime | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="utime" label="修改时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.utime | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.state===0?'正常':'漂白' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column prop="other" label="其他" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button type="text" style="color: red" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
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
    <!--    添加-->
    <el-dialog title="添加" :visible.sync="dialogAddFormVisible">
      <el-form :model="addForm">
        <el-form-item label="车牌号码" :label-width="formLabelWidth">
          <el-input v-model="addForm.car_number"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" v-if="isEdit">
          <el-radio-group v-model="addForm.state">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">漂白</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="操作人" :label-width="formLabelWidth">
          <el-input v-model="addForm.operator" readonly></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
import { parseTime } from '@/utils'
import { CarTypeList } from '@/utils/key'
import { getPublicParameters } from '@/utils/storage'
import { getBlacklist, addBlacklist, delBlacklist, editBlacklist } from '@/api/park/system_manage'
export default {
  name: 'Blacklist',
  data() {
    return {
      isEdit: false,
      addForm: {},
      formLabelWidth: '80px',
      dialogAddFormVisible: false,
      loading: false,
      searchFormData: {
        orderby: 'desc',
        orderfield: 'id',
        page: 1,
        rp: 20
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
    submitAddForm() {
      if (this.isEdit) {
        editBlacklist(this.addForm).then(res => {
          // doing
          const data = res.data
          if (data.state === 1) {
            this.$message.success(data.msg)
            this.dialogAddFormVisible = false
            this.handledSearch()
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        addBlacklist(this.addForm).then(res => {
          // doing
          const data = res.data
          if (data.state === 1) {
            this.$message.success(data.msg)
            this.dialogAddFormVisible = false
            this.handledRefresh()
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    openAddDialog() {
      // doing
      this.isEdit = false
      this.addForm = {
        operator: getPublicParameters('nickname')
      }
      this.dialogAddFormVisible = true
    },
    openEditDialog(row) {
      this.isEdit = true
      this.addForm = row
      this.dialogAddFormVisible = true
    },
    handleDel(row) {
      this.$confirm('确定删除次数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBlacklist({ id: row.id }).then(res => {
          const data = res.data
          if (data.state === 1) {
            this.$message.success(data.msg)
            this.handledSearch()
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
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
        use_time: 'between',
        orderby: 'desc',
        orderfield: 'id',
        page: 1,
        rp: 20
      }
      this.getTableData()
    },
    handledSearch() {
      // doing
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
      getBlacklist(this.searchFormData).then((response) => {
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
