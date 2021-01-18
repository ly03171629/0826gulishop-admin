<template>
  <div>
    <el-card>
      <CategorySelector
        :isShowList="isShowList"
        @changeCategory="changeCategory"
      ></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" @click="showAddSpuForm">添加SPU</el-button>
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="description" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SKU列表"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除SPU"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <!-- -->
        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[2, 3, 5]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- 添加和修改spu的页面组件 -->
      <SpuForm v-show="isShowSpuForm" ref="spu" :visible.sync="isShowSpuForm"></SpuForm>
      <!-- <SpuForm v-show="isShowSpuForm" ref="spu" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event"></SpuForm> -->

      <!-- 添加sku的页面组件 -->
      <SkuForm v-show="isShowSkuForm"></SkuForm>


      <!-- <div>
        添加或者修改的页面
      </div>
      <div>
        添加sku的页面
      </div> -->
    </el-card>
  </div>
</template>

<script>
import SkuForm from '@/views/product/components/SkuForm'
import SpuForm from '@/views/product/components/SpuForm'
export default {
  name: "Spu",
  components:{
    SkuForm,
    SpuForm
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 2,
      spuList: [],
      total: 0,

      isShowList: true, //这个数据只是为了传递给三级分类用于做可操作性的，和本页面显示隐藏没关系

      //下面这两个数据才是切换三个页面的数据，不是isShowList
      isShowSpuForm:false,
      isShowSkuForm:false,

    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.spuList = [];
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },

    //请求获取spu的分页列表
    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      const result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },

    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },

    //点击添加spu按钮
    showAddSpuForm(){
      this.isShowSpuForm = true
      this.$refs.spu.initAddSpuFormData()
    },
    //点击修改spu按钮
    showUpdateSpuForm(row){
      this.isShowSpuForm = true
      //拿到子组件对象，可以使用组件当中的数据也可以调用子组件当中的方法
      this.$refs.spu.initUpdateSpuFormData(row)
    },


    //点击添加sku按钮
    showAddSkuForm(row){
      this.isShowSkuForm = true
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
