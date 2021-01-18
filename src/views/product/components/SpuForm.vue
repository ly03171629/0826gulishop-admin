<template>
  <div>
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          v-model="spuForm.description"
          placeholder="SPU描述"
          type="textarea"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <!-- 
          :file-list="spuImageList"指定要展示的是哪个图片数组，收集也是收集在这个数组当中
          【{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}】你的图片必须有这两个字段，但是我们没有
        -->
        <!-- action="/dev-api/admin/product/fileUpload"和上传品牌接口是一样的 -->
        <!-- :on-remove="handleRemove"删除成功的回调，里面收集图片列表 -->
        <!-- :on-success="handleSuccess"上传成功的回调，里面也得收集图片列表 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          v-model="spuSaleAttrIdName"
          :placeholder="
            unUsedSpuSaleAttrList.length > 0
              ? `还有${unUsedSpuSaleAttrList.length}未选择`
              : '没有啦！！！'
          "
        >
          <el-option
            :label="unUsedSpuSaleAttr.name"
            :value="`${unUsedSpuSaleAttr.id}:${unUsedSpuSaleAttr.name}`"
            v-for="(unUsedSpuSaleAttr, index) in unUsedSpuSaleAttrList"
            :key="unUsedSpuSaleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!spuSaleAttrIdName"
          >添加销售属性</el-button
        >
        <el-table
          :data="spuForm.spuSaleAttrList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column label="序号" type="index" align="center" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!--   -->
              <el-tag
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>
              <!-- row.inputVisible是代表是否是编辑模式，我们这次是把这个值定义在属性身上
              之前我们的平台属性是把这个值定义在属性值身上
              因为现在我们每个属性当中所有的属性值都不能有自己的编辑模式和查看模式，而是每个属性有一个
              之前我们是每个属性值都有自己的编辑模式和查看模式 -->
              <!-- row.inputValue代表输入input后，输入的数据收集到哪里，我们先把收集的数据保存到当前属性身上
              后面失去焦点或者回车的时候，再从当前这个属性身上去拿 -->

              <!--   -->
              <!--   -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                placeholder="名称"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>

              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <!-- @click="spuForm.spuSaleAttrList.splice($index,1)" -->
            <template slot-scope="{ row, $index }">
              <!-- <el-popconfirm :title="`确定要删除${row.saleAttrName}吗？`" @onConfirm="spuForm.spuSaleAttrList.splice($index,1)">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm> -->
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
                @click="spuForm.spuSaleAttrList.splice($index,1)"
              ></HintButton>
              <!-- <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
                @click="spuForm.spuSaleAttrList.splice($index,1)"
              ></el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  // props:['isShowSpuForm'],
  data() {
    return {
      spuForm: {
        // 这个里面初始化的所有数据，都是为了添加的时候收集所需要的
        //如果修改spu,是将获取到的spu详情数据，直接覆盖这里面的所有
        category3Id: 0,
        spuName: "",
        description: "",
        tmId: "",

        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   isChecked: "string",
          //   saleAttrName: "string",
          //   saleAttrValueName: "string",
          //   spuId: 0,
          // },
          //   ],
          // },
        ],
      },

      spuImageList: [], //获取图片列表到时候存在这个里面，最后再把这个图片列表整理完成放到spuForm里面
      trademarkList: [], //获取所有的品牌列表存在这里面
      baseSaleAttrList: [], //获取所有的spu销售属性存在这里面

      spuSaleAttrIdName: "", //准备选择select之后收集销售id，但是最后是不是要这个id，不一定，先假设是

      //这两个数据是上传图片用的
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    // 上传图片相关
    //删除图片成功后的回调
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      //删除成功后把剩余的图片列表赶紧收集起来
      this.spuImageList = fileList;
    },
    //新添加上传图片后的回调
    handleSuccess(response, file, fileList) {
      // console.log(response, file, fileList)
      this.spuImageList = fileList;
    },
    //预览大图
    //本来就是ok的，什么都不需要写
    handlePictureCardPreview(file) {
      //file代表点击的图片文件
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //请求获取修改的初始化数据
    async initUpdateSpuFormData(spu) {
      //函数当中在发那4个请求
      //获取spu的详情
      //http://localhost:9529/dev-api/admin/product/getSpuById/4
      const result = await this.$API.spu.get(spu.id);
      if (result.code === 200) {
        this.spuForm = result.data;
      }
      //获取spu的图片列表数据
      //http://localhost:9529/dev-api/admin/product/spuImageList/4
      const imgResult = await this.$API.sku.getSpuImageList(spu.id);
      if (imgResult.code === 200) {
        let spuImageList = imgResult.data;
        //给每个图片对象添加name 和 url,否则照片墙没法展示
        // 在获取到数据，赋值给响应式数据spuImageList，之前，把所有的数据处理好，最后一次性赋值给响应式数据
        // 那么数据对象当中所有的属性都是响应式的
        spuImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });

        this.spuImageList = spuImageList;
      }
      //获取所有的品牌列表数据
      //http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }
      //获取spu所有的销售属性数据
      //http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },
    //请求获取添加的初始化数据
    async initAddSpuFormData() {
      //函数当中在发那2个请求
      //获取所有的品牌列表数据
      //http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }
      //获取spu所有的销售属性数据
      //http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },
    //点击添加销售属性
    addSaleAttr() {
      //得把刚才收集到的数据拿到，构造成这样的一个对象,把这个对象添加到指定的spuForm.spuSaleAttrList里面
      // {
      //     baseSaleAttrId: 0,
      //     saleAttrName: "string",
      //     spuSaleAttrValueList: [],
      // },
      let [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdName.split(":");
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuForm.spuSaleAttrList.push(obj);

      this.spuSaleAttrIdName = ""; //把原来收集到的数据清空
    },
    //点击添加按钮，切换为input
    showInput(row) {
      //显示当前行的input,当前行就是当前的这个销售属性
      this.$set(row, "inputVisible", true);
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //input失去焦点或者回车之后的回调
    handleInputConfirm(row) {
      //从当前行也就是当前的这个属性对象身上，把刚才input输入的数据给获取到
      let saleAttrValueName = row.inputValue;

      //判断这个值是否为空
      if (saleAttrValueName.trim() === "") {
        row.inputValue = "";
        return;
      }

      //判断这个值不能和已经存在的属性值名称重复
      //上次在平台属性内部，我们判断重复是需要除去自身
      //这次不需要，因为这次我们并没有提前添加进去占位

      let isRepeat = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName === saleAttrValueName
      );
      if (isRepeat) {
        this.$message.info("输入的属性值名称不能重复");
        row.inputValue = "";
        return;
      }

      //把数据变为想要的结构
      let obj = {
        saleAttrValueName,
      };

      //把结构数据添加到对应的属性值列表当中
      row.spuSaleAttrValueList.push(obj);

      //把原来input内输入的数据清空
      row.inputValue = "";

      //再让input变为按钮
      row.inputVisible = false;
    },
  },
  computed: {
    //所有的销售属性除去自身的，剩余的销售属性列表
    // unUsedSpuSaleAttrList(){
    //   //从所有的销售属性列表当中去过滤，过滤出销售属性名称和自己的销售属性列表当中每个销售属性名称都不相同的
    //   return this.baseSaleAttrList.filter(baseSaleAttr => {
    //     //从baseSaleAttrList拿一项，就要去和自己已有的数组每个去对比，如果都不相等，就拿走，有相等就不要
    //     return this.spuForm.spuSaleAttrList.every(spuSaleAttr => {
    //       return baseSaleAttr.name !== spuSaleAttr.saleAttrName
    //     })
    //   })
    // },
    //所有的销售属性除去自身的，剩余的销售属性列表
    unUsedSpuSaleAttrList() {
      //从所有的销售属性列表当中去过滤，过滤出销售属性名称和自己的销售属性列表当中每个销售属性名称都不相同的
      return this.baseSaleAttrList.filter((baseSaleAttr) =>
        //从baseSaleAttrList拿一项，就要去和自己已有的数组每个去对比，如果都不相等，就拿走，有相等就不要
        this.spuForm.spuSaleAttrList.every(
          (spuSaleAttr) => baseSaleAttr.name !== spuSaleAttr.saleAttrName
        )
      );
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

