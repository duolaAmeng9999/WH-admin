<template>
  <div>
    <el-form
      :inline="true"
      class="demo-form-inline"
      v-model="cForm"
      :disabled="isShowList"
    >
      <el-form-item label="一级分类">
        <!-- change 默认收集 value 的值 -->
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          @change="changeCategory1Id"
        >
          <el-option
            v-for="c1 in category1IdList"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          @change="changeCategory2Id"
        >
          <el-option
            v-for="c2 in category2IdList"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          @change="changeCategory3Id"
        >
          <el-option
            v-for="c3 in category3IdList"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  props: ["isShowList"],
  data() {
    return {
      cForm: {
        category1Id: "", // 收集一级分类 id
        category2Id: "", // 收集二级分类 id
        category3Id: "", // 收集三级分类 id
      },
      category1IdList: [], // 一级分类列表
      category2IdList: [], // 二级分类列表
      category3IdList: [], // 三级分类列表
    };
  },

  methods: {
    // 一级分类发生改变时调用次函数, 调用接口
    async changeCategory1Id(category1Id) {
      // 当一级分类选项发生改变时; 同时需要清空二级分类、三级分类的选项; 也就是清除数据
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.category2IdList = [];
      this.category3IdList = [];
      const result = await this.$API.category.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2IdList = result.data;
      }
      // 子向父传递数据, 通过 emit 触发父组件的自定义事件, 将一级分类 id 传给父组件; level 作为一级分类的判断条件
      this.$emit("changeCategory", { categoryId: category1Id, level: 1 });
    },
    // 二级分类发生改变时调用次函数, 调用接口
    async changeCategory2Id(category2Id) {
      // 当二级分类选项发生改变时; 同时需要清空三级分类的选项; 也就是清除数据
      this.cForm.category3Id = "";
      this.category3IdList = [];
      const result = await this.$API.category.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3IdList = result.data;
      }
      // 子向父传递数据, 通过 emit 触发父组件的自定义事件, 将二级分类 id 传给父组件; level 作为二级分类的判断条件
      this.$emit("changeCategory", { categoryId: category2Id, level: 2 });
    },
    async changeCategory3Id(category3Id) {
      // 子向父传递数据, 通过 emit 触发父组件的自定义事件, 将三级分类 id 传给父组件; level 作为三级分类的判断条件
      this.$emit("changeCategory", { categoryId: category3Id, level: 3 });
    },
  },

  // 当组件挂在完毕后, 调用一级分类的接口
  async mounted() {
    const result = await this.$API.category.getCategory1();
    if (result.code === 200) {
      this.category1IdList = result.data;
    }
  },
};
</script>

<style>
</style>