<template>
  <div>
    <el-form label-width="80px" :model="spuForm">
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName"></el-input>
      </el-form-item>

      <!-- 获取到品牌列表数据, 遍历, 通过 v-module 进行双向绑定 -->
      <!-- select 通过 v-model 默认收集到的时 value 的数据, 将收集到的 value 数据放入 spuForm 表单数据, 这里需要收集到 选中的 id  -->
      <el-form-item label="品牌">
        <el-select placeholder="请选择活动区域" v-model="spuForm.tmId">
          <el-option
            v-for="tm in trademarkList"
            :label="tm.tmName"
            :value="tm.id"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述" :inline="true">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          v-model="spuForm.description"
        ></el-input>
      </el-form-item>

      <!-- 
          SPU 上传图片部分
          1.确定上传图片的地址
          2.上传图片的数据格式为数组, 将上传图片的地址存放在外部定义的数组中
          3.上传成功时的回调 on-success 
          4.删除上传图片的 on-remove
       -->
      <el-form-item label="SPU图片">
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

      <!-- 自身销售属性 -->
      <el-form-item label="销售属性" :inline="true">
        <el-select
          :placeholder="
            unUsedSpuSaleAttrList.length > 0
              ? `还有${unUsedSpuSaleAttrList.length}未选`
              : `无`
          "
          v-model="spuSaleAttrIdName"
        >
          <el-option
            v-for="item in unUsedSpuSaleAttrList"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          class="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!spuSaleAttrIdName"
          >添加销售属性</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-table border style="width: 100%" :data="spuForm.spuSaleAttrList">
          <el-table-column label="序号" width="80" align="center" type="index">
          </el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                closable
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
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
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="{$index }">
              <el-popconfirm
                :title="`确认删除吗？`"
                @onConfirm="spuForm.spuSaleAttrList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  size="mini"
                  class="el-icon-delete"
                  type="danger"
                  title="删除SPU"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      spuForm: {
        category3Id: "", // 三级分类的 id 值
        description: "", // SPU 描述信息
        spuName: "", // SPU 属性名称
        tmId: "", // 品牌的 id
        spuSaleAttrId: "", // Spu 销售属性 id
        inputValue: "", // 添加自身销售属性 显示 input 框收集输入的内容
        spuImageList: [], // SPU 上传图片最终
        spuSaleAttrList: [], // SPU 销售属性列表
      },
      dialogImageUrl: "", //
      spuSaleAttrIdName: "", // 收集销售属性的下来选项的 id
      category3Id: "",
      dialogVisible: false,
      inputVisible: false, // 控制自身属性值 input 输入框的显示与隐藏
      spSaleAttrId: "", // 准备下拉选项选中收集的 id
      spuImageList: [], // 获取到 SPU 图片数据
      trademarkList: [], //获取品牌列表
      baseSaleAttrList: [], // 获取到的销售属性值列表
    };
  },
  methods: {
    handleDelete(row) {},

    // 上传相关
    // SPU 图片, 移除图片的回调函数, fileList 为移除之后的数据
    handleRemove(file, fileList) {
      // 将移除移除图片的最新数据替换掉之前的数据
      this.spuImageList = fileList;
    },
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 点击添加按钮的回调
    async initAddSpuFormData(category3Id) {
      this.category3Id = category3Id;
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }

      // 获取属性列表的接口
      let baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },

    // 点击修改按钮的回调
    async initUpdateSpuFormData(spu) {
      this.category3Id = spu.category3Id;
      // 获取 spu 详情接口
      let result = await this.$API.spu.get(spu.id);
      if (result.code === 200) {
        this.spuForm = result.data;
        console.log( result.data);

      }

      // 获取到SPU图片接口
      let imageResult = await this.$API.sku.getSpuImageList(spu.id);
      if (imageResult.code === 200) {
        let spuImageList = imageResult.data;
        spuImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = spuImageList;
      }

      // 获取品牌接口
      let trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }

      // 获取属性列表的接口
      let baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },
    // 点击添加按钮的回调
    async initAddSpuFormData(category3Id) {
      this.spuForm.category3Id = category3Id;
      // 获取品牌接口
      let trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }
      // 获取属性列表的接口
      let baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },

    // 添加自身属性值名称按钮
    handleInputConfirm(row) {
      let saleAttrValueName = row.inputValue;
      let baseSaleAttrId = row.baseSaleAttrId;
      if (saleAttrValueName.trim() === "") {
        row.inputValue = "";
        this.$message.info("输入的内容不能为空");
        this.$refs.saveTagInput.focus();
        return;
      }
      let isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === saleAttrValueName;
      });

      if (isRepeat) {
        this.$message.info("输入的属性值重复！请重新输入");
        row.inputValue = "";
        this.$refs.saveTagInput.focus();
        return;
      }
      let obj = {
        saleAttrValueName,
        baseSaleAttrId,
      };
      row.spuSaleAttrValueList.push(obj);
      row.inputValue = "";
      row.inputVisible = false;
    },

    // 添加销售属性按钮
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdName.split(":");
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuForm.spuSaleAttrList.push(obj);
      this.spuSaleAttrIdName = "";
    },
    // 控制自身属性值名称 input 输入框的显示与隐藏
    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    // 保存按钮
    async save() {
      let { spuForm, spuImageList } = this;
      spuForm.spuImageList = spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.url || item.response.data,
        };
      });
      spuForm.spuSaleAttrList.forEach((item) => {
        delete item.inputVisible;
        delete item.inputValue;
      });
      try {
        await this.$API.spu.addUpdate(spuForm);
        this.$message.success("保存成功");
        this.cancel();
        this.$emit("successBlack");
      } catch (error) {
        this.$message.error("保存失败");
      }
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
      Object.assign(this.$data, this.$options.data());
    },
  },
  computed: {
    unUsedSpuSaleAttrList() {
      return this.baseSaleAttrList.filter((baseSaleAttr) => {
        return this.spuForm.spuSaleAttrList.every((spuSaleAttr) => {
          return baseSaleAttr.name !== spuSaleAttr.saleAttrName;
        });
      });
    },
  },
};
</script>

<style>
</style>