<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>

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
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column label="序号" align="center" type="index" width="80">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- 只要有结构改变，就得自己写这个作用域插槽 -->
        <template slot-scope="{ row, $index }">
          <!-- row,$index对应的就是当前遍历的某个品牌对象 及这个品牌对象在数组当中的下标 -->
          <img :src="row.logoUrl" alt="" style="width: 80px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>

    <!-- 添加和修改的对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!--对于form来说，是专门用来收集数据的，收集的数据最后是要发请求携带的参数 
      都会有一个属性:model="tmform"，指定收集的数据最后收集到哪里，是一个对象
      -->
      <el-form :model="tmForm" style="width: 80%">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px">
          <!-- upload里面的action就是让你自己去写真实的上传接口，对应上传到哪里 -->
          <!-- show-file-list指定上传的是不是照片墙，现在上传的是一张不是照片墙 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,

      dialogFormVisible: false, //控制对话框dialog显示和隐藏

      tmForm: {
        tmName: "",
        logoUrl:''
      },

      // imageUrl: '' //最终用不用不知道
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    //发请求获取品牌列表以及分页器翻页的回调
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 处理修改每页数量的回调函数
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },

    //上传成功的回调
    handleAvatarSuccess(res, file) {
      //上传成功后，才是正儿八经的在收集返回的真实的图片路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(URL.createObjectURL(file.raw))
      //blob:http://localhost:9529/21430242-56de-474f-a57d-77e56a0eb5f0  
      //这个路径是欺骗我们的，还是本地的路径,不是我们要的最终上传成功的网络路径
      console.log(res)
      //正儿八经收集返回的真实的网络图片路径
      this.tmForm.logoUrl = res.data
      // this.tmForm.logoUrl = file.response.data
    },



    //上传前的回调，可以在上传的时候限定你的图片的大小和格式
    beforeAvatarUpload(file) {

      const typeArr = ["image/jpeg","image/png"]
      // const isJPG = file.type === "image/jpeg"; //判断上传的图片格式是不是jpg

      const isJPGOrPNG = typeArr.indexOf(file.type) !== -1

      const isLt2M = file.size / 1024 / 1024 < 2; // 判断上传的图片大小是不是小于2M

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式或者PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGOrPNG && isLt2M;
    },

    //点击添加按钮，弹出dialog
    showAddDialog(){
      this.dialogFormVisible = true
      // 点击添加后，要把数据先清空一遍，要不就会出现小bug  添加完取消后再点添加数据还存在
      // 添加的数据里面没有id
      this.tmForm = {
        tmName: "",
        logoUrl:''
      }
    },
    //点击修改按钮，弹出dialog，需要带上要修改的这个品牌的数据进行展示的
    showUpdateDialog(row){
      this.dialogFormVisible = true
      // 不能这么写，如果这么写，那么table展示的数据和tmForm要修改的数据就是同一个数据对象
      //只要你动了tmform的数据，其实也是在动列表当中的数据，所以不能让他们是同一个数据
      // this.tmForm = row   //把要展示的这个数据赋值给tmForm 而且数据里面有id

      // 拷贝  深拷贝和浅拷贝
      // 拷贝 必然出现新的地址开辟新的空间，也就是说有不同的数据存储位置
      // 深拷贝和浅拷贝
      // 谈的其实是拷贝的东西  是什么？ 
      // 如果拷贝对象拷贝的是地址，那么就是浅拷贝，
      // 拷贝的是对象里面的值，就是深拷贝
      // 深浅拷贝其实针对对象数据类型出现的
      // 基本数据类型不存在什么深浅拷贝

      //深拷贝还是浅拷贝？  
      //row里面   都是基本数据   不谈深浅拷贝 
      //浅拷贝
      this.tmForm = {
        ...row
      }


      





    }


  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
