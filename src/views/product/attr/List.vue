<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>
    <!-- 第一个card当中是三级联动，第二个card是属性列表相关的 -->
    <el-card style="margin-top: 20px">
      <!-- 这个里面放的是列表页的页面 -->
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv" :disabled="!category3Id">添加属性</el-button>
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column label="序号" type="index" align="center" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <!-- 遍历的是每个属性当中的属性值列表 -->
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <!-- 这个里面放的是添加或者修改的页面 -->
        <!-- 这里面是添加或者修改的页面 -->
        <el-form :model="attrForm" :inline="true"> 
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrForm.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>

        <el-table
          :data="attrForm.attrValueList"
          border
          style="width: 100%;margin:20px 0">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称"
            width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width">
          </el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>

      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 保存子组件传递过来的id 一会发请求使用
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],

      isShowList: true, //控制第二个card显示的是添加还是列表

      attrForm: {
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "string",
          // },
        ],
        // categoryId: this.category3Id,  //这样不行，在data当中不能使用this
        categoryId:0,
        categoryLevel:3,
      },
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        //一级被选中，子组件传递过来1级id，并且还要让父组件把数据清空
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.attrList = [];
      } else {
        this.category3Id = categoryId;
        // 三级id被选中，父组件当中是要发请求获取属性列表的
        //发请求获取属性列表数据
        this.getAttrList();
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 点击添加按钮切换到添加的页面
    showAddDiv(){
      this.isShowList = false
      // 清空收集的对象
      // 完成收集的对象剩余的收集操作
      this.attrForm = {
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "string",
          // },
        ],
        categoryId: this.category3Id, 
        categoryLevel:3,
      }
    },
    //点击添加属性值按钮
    addAttrValue(){
      //我们可以给属性值列表当中添加一个空的对象，保证表格当中首先先出现一行
      this.attrForm.attrValueList.push({
        attrId:this.attrForm.id,  //这个属性说的是属性值所属属性的id，如果是添加属性，这个id是没有的，如果是修改属性，这个id是有的
        valueName: "", //我现在只是添加了一个空的对象，属性都还没有呢，只是在占位,什么时候这个属性值有值，得让用户自己输入，输入了就有值
      })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
