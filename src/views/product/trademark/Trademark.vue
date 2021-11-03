<template>
  <div id="root" style="padding: 20px">
    <!-- 添加按钮 -->
    <el-button type="primary" class="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >

    <!-- trademark 品牌列表 -->
    <el-table :data="trademarkList" style="width: 100%" stripe>
      <el-table-column label="序号" width="80" align="center" type="index">
      </el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO" width="180" prop="logoUrl">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" width="100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope" scope="{row}">
          <el-button
            size="mini"
            @click="handleEdit(row)"
            class="el-icon-edit"
            type="warning"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            class="el-icon-delete"
            @click="handleDelete(row)"
            v-if="$hasBP('btn.Trademark.remove_empty')"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 页组件 -->
    <div class="block" align="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getTrademarkList"
        :current-page="page"
        :page-sizes="[3, 7, 9, 11]"
        :page-size="10"
        layout="prev, pager, next, jumper, sizes,total "
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="tmForm" :rules="rules" ref="tmForm">
        <!-- 品牌名称 -->
        <el-form-item
          label="品牌名称"
          :label-width="formLabelWidth"
          prop="tmName"
        >
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 品牌图片上传部分 -->
        <el-form-item
          label="品牌LOGO"
          :label-width="formLabelWidth"
          prop="logoUrl"
        >
          <!-- 将上传品牌的接口更改为后台管理项目的上传接口 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- 将上传 LOGO 的获取属性值更改 -->
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    const validateTmFrom = (rule, value, callback) => {
      if (value.length <= 2 || value.length > 10) {
        callback(new Error("请输入大于2小于10的品牌名称"));
      } else {
        callback();
      }
    };
    return {
      page: 1, // 第几页
      limit: 3, // 每页显示多少条数据
      trademarkList: [], // 品牌列表
      total: 0, // 总的记录数
      formLabelWidth: "120px", // 控制对话中的输入框宽度
      dialogFormVisible: false, // 控制对话框是否显示
      tmForm: {
        tmName: "", // 上传时收集到的品牌名称
        logoUrl: "", // 上传时收集到的品牌 LOGO
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" },
          { trigger: "change", validator: validateTmFrom },
        ],
        logoUrl: [
          // 这个触发写什么都无所谓，upload触发时机必须是整体校验
          { required: true, message: "请选择上传图片", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    // 点击修改按钮时的回调, row 所点击时所在行的 品牌信息
    handleEdit(row) {
      // 点修改按钮时显示对话1框
      this.dialogFormVisible = true;
      // 将 row 的内容重新赋值给 tmForm, 此时的 ... 只有一层时为深拷贝,
      this.tmForm = { ...row };
    },
    // 更改每页显示多少条数据
    handleSizeChange(val) {
      // 将分页组件所选中的赋值给 data 中的 limit
      this.limit = val;
      // 当每页显示多少条数据发生改变时, 需要重新调用接口
      this.getTrademarkList();
    },
    // 分页的请求接口, page 的默认值为 1, 点击分分页按钮时自动收集 当前所点击的分页
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page, // 接口需要的参数, 当前页
        this.limit // 接口需要的参数, 每页显示多少条数据
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records; // 将请求回来的数据列表
        this.total = result.data.total; // 响应回来的数据总条数
      }
    },

    // 添加或修改的接口, 弹出对话框点击确认所对应的回调
    addOrUpdate() {
      /* 
        第一步收集 tmForm 数据
        第二步对数据进行整理
        第三步对表单进行整体的验证
        第四步发送请求
        第五步对响应成功的数据进行处理
        第六步对响应错误进行处理

     */
      
      // 使用 ref 标识中的 validate 方法; 对话框确认时的整体验证, 值为布尔值  
      this.$refs.tmForm.validate(async (valid) => {
        // 验证通过进入 if 语句
        if (valid) {
          // 添加或修改接口需要传入对象, 当传入的对象中有 id 则为 修改, 否则为添加
          let trademark = this.tmForm;
          // 用来捕获错误信息
          try {
            // 调用接口
            const result = await this.$API.trademark.addOrUpdate(trademark);
            // 点击确认则隐藏对话框
            this.dialogFormVisible = false;
            // 处理响应成功信息
            this.$message.success(
              trademark.id ? "修改品牌成功" : "添加品牌成功"
            );
            // 添加或修改成功后重新调用 品牌列表接口, 更新页面列表, 有 id 则为修改, 停留在修改页面, 否则跳转到初始第一页
            this.getTrademarkList(trademark.id ? this.page : 1);
          } catch (error) {
            // 处理响应失败时的错误信息
            this.$message.error(trademark.id ? "修改品牌失败" : "添加品牌失败");
          }
        }
      });
    },
    // 上传成功后的回调
    handleAvatarSuccess(res, file) {
      // 上传成功以后才是正真收集返回真实图片地址;  网络路径在fileUpload返回的信息内容当中
      this.tmForm.logoUrl = res.data;
    },
    // 上传前的回调函数, 可以进行图片大小的限制, 信息提示
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 控制对话框的显示与隐藏
    showAddDialog() {
      // 点击添加按钮时显示对话框
      this.dialogFormVisible = true;
      // 显示对话框的同时重置对话框的内容, 否则会出现关闭对话框之后, 再次显示对话框之前输入的内容依然显示
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    // 删除品牌数据接口
    handleDelete(row) {
      // 点击删除按钮会再次弹出确认对话框, 做数据的删除时必须要有再次确认
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 调用删除接口, 需要传入 id 值
          await this.$API.trademark.delete(row.id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          // 同样删除成功后需要重新调用 品牌列表接口, 更新 data 中的 trademarkList 数组中的数据
          this.getTrademarkList(
            // 当点击删除按钮时, 需要停留在当前删除数据的页面, 当 trademarkList 数组中的数据小于 1 时, 则自动跳转到上一页
            this.trademarkList.length > 1 ? this.page : this.page - 1
          );
        })
        // 捕获响应失败时的错误数据
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  // 当页面渲染完毕后调用接口渲染页面
  mounted() {
    this.getTrademarkList();
  },
};
</script>

<style scoped lang="scss">
.block {
  margin-top: 20px;
}
::v-deep.avatar-uploader .el-upload {
  border: 1px dashed #1ad0d6;
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