<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>
    <!-- 第一个card当中是三级联动，第二个card是属性列表相关的 -->
    <el-card style="margin-top:20px"></el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data(){
    return {
      // 保存子组件传递过来的id 一会发请求使用
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrList:[]
    }
  },
  methods:{
    changeCategory({categoryId,level}){
      if(level === 1){
        this.category1Id = categoryId
        //一级被选中，子组件传递过来1级id，并且还要让父组件把数据清空
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []
      }else if(level === 2){
        this.category2Id = categoryId
        this.category3Id = ''
        this.attrList = []
      }else{
        this.category3Id = categoryId
        // 三级id被选中，父组件当中是要发请求获取属性列表的
        //发请求获取属性列表数据
        this.getAttrList()
      }
    },
    async getAttrList(){
      let {category1Id,category2Id,category3Id} = this
      const result = await this.$API.attr.getList(category1Id,category2Id,category3Id)
      if(result.code === 200){
        this.attrList = result.data
      }
    }
    
  }
}
</script>

<style lang="scss" scoped>

</style>
