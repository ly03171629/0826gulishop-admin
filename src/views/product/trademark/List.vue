<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <!-- 
      table写法
      先写eltable 回车
      有几列就复制几个列
      先把动态数据属性data干掉
      有边框得添加table的border属性
      每个列的width控制列的宽度
      每个列的label控制这个列的名称
      想让那个列居中，那么哪个列需要添加align="center"
      那个列是序号，需要添加type = "index"
    -->

    <!-- data是要展示的动态数据，必须是一个数组 
    table当中展示数据的时候，每个列内部都暗含了一个vfor，都在遍历data的数组当中的每个品牌对象
    每一个列内部都有展示数据的功能，只不过展示的是数据的哪个属性，我们可以通过prop去告知
    没个列展示数据的时候都会给你留有作用域插槽，那么如果你需要修改展示时候的结构，那么你就得去完善作用域插槽
    如果不需要修改展示数据的结构，就不需要关心作用域插槽
    -->
    <el-table
      :data="trademarkList"
      border
      style="width: 100%;margin:20px 0">
      <el-table-column
        label="序号"
        align="center"
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width">
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        width="width">
        <!-- 只要有结构改变，就得自己写这个作用域插槽 -->
        <template slot-scope="{row,$index}">
          <!-- row,$index对应的就是当前遍历的某个品牌对象 及这个品牌对象在数组当中的下标 -->
          <img :src="row.logoUrl" alt="" style="width:80px;height:60px">
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    -->
    <el-pagination
      style="text-align:center"
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total">
    </el-pagination>



  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data(){
    return {
      page:1,
      limit:3,
      trademarkList:[],
      total:0
    }
  },
  mounted(){
    this.getTrademarkList()
  },
  methods:{
    //发请求获取品牌列表以及分页器翻页的回调
    async getTrademarkList(page = 1){
      this.page = page
      const result = await this.$API.trademark.getPageList(this.page,this.limit)
      if(result.code === 200){
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    },
    // 处理修改每页数量的回调函数
    handleSizeChange(size){
      this.limit = size
      this.getTrademarkList()
    }
  }
}
</script>

<style scoped>

</style>
