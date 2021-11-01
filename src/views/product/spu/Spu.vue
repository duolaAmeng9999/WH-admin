<template>
  <div>
    <!--三级分类下拉选项 -->
    <el-card>
      <CategorySelector
        @changeCategory="changeCategory"
        :isShowList="isShowList"
      ></CategorySelector>
    </el-card>

    <!-- spu 名称列表 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button
        type="primary"
        class="el-icon-plus"
        @click="showAddDialog"
        :disabled="!category3Id"
        v-show="!isShowList && !isShowSpuForm"
        >添加SPU</el-button
      >
      <el-table border style="width: 100%" v-show="!isShowList" :data="spuList">
        <el-table-column label="序号" width="80" align="center" type="index">
        </el-table-column>
        <el-table-column label="SPU 名称" prop="spuName"></el-table-column>
        <el-table-column label="SPU 描述" prop="description"> </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="{ row }">
            <!-- 添加按钮 -->
            <HintButton
              type="success"
              class="el-icon-plus"
              size="mini"
              title="添加SKU"
              @click="showAddSku(row)"
            ></HintButton>
            <HintButton
              type="warning"
              class="el-icon-edit"
              size="mini"
              title="修改SPU"
              @click="showUpdateSpu(row)"
            ></HintButton>
            <HintButton
              type="info"
              class="el-icon-circle-plus-outline"
              size="mini"
              title="查看SKU"
              style="marginright: 10px"
            ></HintButton>
            <el-popconfirm
              :title="`确认删除${row.attrName}吗？`"
              @onConfirm="handleDelete(row)"
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
    </el-card>

    <!-- 添加与修改页 -->
    <div>
      <el-card v-show="isShowSpuForm">
        <SpuForm
          ref="spu"
          @cancel="cancel"
          @successBlack="successBlack"
        ></SpuForm>
      </el-card>
    </div>

    <!-- SKU页 -->
    <div v-show="isShowSkuForm">
      <el-card> <SkuForm ref="sku"></SkuForm> </el-card>
    </div>

    <!-- 分页组件 -->
    <div class="block" align="center" v-show="!isShowList && !isShowSpuForm">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getSpuList"
        :current-page="page"
        :page-sizes="[3, 7, 9, 11]"
        :page-size="10"
        layout="prev, pager, next, jumper, sizes,total "
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "", // 一级分类id
      category2Id: "", // 二级分类id
      category3Id: "", // 三级分类id
      page: 1, // 第几页
      limit: 3, // 每页显示多少条数据
      total: 0, // 总的记录数
      isShowList: false, // 控制属性列表的显示于隐藏默认隐藏 添加和修改属性列表
      isShowSpuForm: false,
      isShowSkuForm: false,
      spuList: [], // SPU 名称列表
    };
  },
  methods: {
    // 自定义事件的回调函数, 将子组件传递的 三级分类 id 分别赋值给 data 中的数据
    changeCategory({ categoryId, level }) {
      // 使用 子组件传递的 level 值进行判断, 根据值来将 id 赋值给不同的对象
      if (level === 1) {
        // 当一级分类改变时, 同时需要清除 二、三级分类的数据
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
        this.category1Id = categoryId;
      } else if (level === 2) {
        // 当二级分类改变时, 同时需要清除三级分类的数据
        this.category3Id = "";
        this.spuList = [];
        this.category2Id = categoryId;
      } else if (level === 3) {
        this.category3Id = categoryId;
        // 当三级分类选项发生改变时, 调用 数据列表接口; 调用属性列表的条件为 三级分类选项改变
        this.getSpuList();
      }
    },

    // 添加属性名列表, 当点击添加按钮时, 需要将属性名表隐藏, 可编辑属性名列表显示
    showAddDialog() {
      this.isShowList = true;
      this.isShowSpuForm = true;
      this.$refs.spu.initAddSpuFormData(this.category3Id);
    },

    // 更改每页显示多少条数据
    handleSizeChange(val) {
      // 将分页组件所选中的赋值给 data 中的 limit
      this.limit = val;
    },
    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      const result = await this.$API.spu.getList(
        page, // 接口需要的参数, 当前页
        limit, // 接口需要的参数, 每页显示多少条数据
        category3Id
      );
      if (result.code === 200) {
        this.spuList = result.data.records; // 将请求回来的数据列表
        this.total = result.data.total; // 响应回来的数据总条数
      }
    },
    // SPU 名称列表添加 Sku 按钮
    showAddSku(row) {
      this.isShowList = true;
      this.isShowSkuForm = true;
      this.$refs.sku.initAddSkuFormData(row, this.category1Id, this.category2Id);
    },
    // SPU 名称列表修改 Spu 按钮
    showUpdateSpu(row) {
      this.isShowList = true;
      this.isShowSpuForm = true;
      this.flag = row.id;
      this.$refs.spu.initUpdateSpuFormData(row);
    },
    // SPU 名称列表删除 Spu 按钮
    handleDelete(row) {
      this.$API.spu.deleteSpu(row.id);
      this.getSpuList();
    },

    cancel() {
      this.isShowList = false;
      this.isShowSpuForm = false;
      this.flag = null;
    },
    // 保存数据的回调
    successBlack() {
      if (this.flag) {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
      this.flag = null;
    },
  },
};
</script>

<style>
</style>