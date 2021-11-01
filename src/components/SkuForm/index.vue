<template>
  <div>
    <el-form label-width="80px" :model="skuForm">
      <el-form-item label="SPU名称">
        <span>{{ spuName }}</span>
      </el-form-item>

      <el-form-item label="SKU名称">
        <el-input v-model="skuForm.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格">
        <el-input v-model="skuForm.price"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input v-model="skuForm.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述" prop="desc">
        <el-input
          type="textarea"
          placeholder="SKU规格描述"
          v-model="skuForm.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdValueId">
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性" :inline="true">
        <el-form :inline="true">
          <el-form-item
            :label="spuSaleAttr.saleAttrName"
            v-for="spuSaleAttr in spuSaleAttrList"
            :key="spuSaleAttr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="spuSaleAttr.spuAttrIdValueId"
            >
              <el-option
                v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                :label="spuSaleAttrValue.saleAttrValueName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          :data="spuImageList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="60" align="center">
          </el-table-column>
          <el-table-column label="图片" width="100" align="center">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"> </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                @click="setDefault(row)"
                v-if="row.isDefault === '0'"
                >设置默认</el-button
              >
              <el-tag v-else>默认</el-tag>
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
  name: "SkuForm",
  data() {
    return {
      skuForm: {
        category3Id: 0, // 收集三级分类的 id
        spuName: "", // SPU 名称
        skuName: "", // SKU 名称
        price: 0, // 商品价格
        weight: "", // 商品重量
        skuDesc: "", // SKU 规格描述
        tmId: "", // 品牌 id
        spuId: "", // 用来确认当前 SKU 对应那个 SPU 上
        skuDefultImage: "", // SKU 设置的默认图片
        skuImageList: [], // SKU 收集上传图片的的数据
        skuSaleAttrValueList: [], // SKU 销售属性可能会出现既要收集 id 又要收取 name
        skuValueList: [], // 属性操作时既要收集 id 又要收集 name
      },
      spu: {},
      attrList: [],
      spuSaleAttrList: [],
      spuImageList: [],
      checkedImageList: [],
    };
  },

  methods: {
    async initAddSkuFormData(row, category1Id, category2Id) {
      this.spu = row;
      const promise1 = await this.$API.attr.getList(
        category1Id,
        category2Id,
        row.category3Id
      );
      const promise2 = await this.$API.sku.getSpuSaleAttrList(row.id);
      const promise3 = await this.$API.sku.getImageList(row.id);
      const result = await Promise.all([promise1, promise2, promise3]);
      this.attrList = result[0].data;
      this.spuSaleAttrList = result[1].data;
      let spuImageList = result[2].data;
      spuImageList.forEach((item) => (item.isDefault = "0"));
      this.spuImageList = spuImageList;
    },

    handleSelectionChange(value) {
      this.checkedImageList = value;
    },

    setDefault(row) {
      this.spuImageList.forEach((item) => (item.isDefault = "0"));
      row.isDefault = "1";
      this.skuForm.skuDefultImage = row.imgUrl;
    },

    async save() {
      let { skuForm, attrList, spuSaleAttrList, checkedImageList, spu } = this;
      skuForm.tmId = spu.tmId;
      skuForm.spuId = spu.id;
    },
  },
};
</script>

<style>
</style>