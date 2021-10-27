<template>
  <div style="padding: 20px">
    <!-- 第一 card 为三级分类的列表 -->
    <el-card class="box-card">
      <!-- 添加自定义事件, 来接收 子组件传递过来的 三级分类的 id, level -->
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>

    <!-- 第二 card 为属性列表 -->
    <el-card class="text" v-show="!isShowList">
      <!-- 添加按钮 -->
      <el-button
        type="primary"
        class="el-icon-plus"
        @click="showAddDialog"
        :disabled="!category3Id"
        >添加</el-button
      >

      <!-- 属性列表 -->
      <el-table :data="arrtList" style="width: 100%" stripe>
        <el-table-column label="序号" width="80" align="center" type="index">
        </el-table-column>
        <el-table-column label="属性名称" prop="attrName"></el-table-column>
        <el-table-column label="属性值列表" prop="valueName" align="center">
          <template slot-scope="{ row }">
            <el-tag
              type="success"
              v-for="value in row.attrValueList"
              :key="value.id"
              >{{ value.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="scope" scope="{row}">
            <!-- 公共组价, 修改和删除按钮 -->
            <HintButton
              size="mini"
              class="el-icon-edit"
              type="warning"
              title="修改属性"
              @click="handleEdit(row)"
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
                title="删除属性"
              ></HintButton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加或修改属性列表 -->
    <div v-show="isShowList">
      <el-card class="text">
        <!-- init 让内容为一行显示; 为表单单向绑定 data 里的 attrForm 数据 -->
        <el-form :inline="true" :data="attrForm">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          class="el-icon-plus"
          @click="addArrtValue"
          :disabled="!attrForm.attrName"
        >
          添加属性值</el-button
        >
        <el-button @click="isShowList = false">取消</el-button>

        <el-table
          :data="attrForm.attrValueList"
          border
          style="width: 100%"
          class="text"
        >
          <el-table-column label="序号" width="80" type="index">
          </el-table-column>
          <el-table-column label="属性名称" prop="valueName">
            <template slot-scope="{ row, $index }">
              <!--
                   收集用户输入的属性的名称; 通过双向数据绑定给 valueName 
                   ref根据索引值 index 来进行标识
                   使用 native 是因为 添加 添加事件时, 最终会将事件添加到 input 的最外层的原始标签
             -->
              <el-input
                :ref="$index"
                @blur="toLook(row, $index)"
                @keyup.enter.native="toLook(row, $index)"
                v-model="row.valueName"
                v-if="row.isEdit"
                placeholder="请输入属性名称"
              ></el-input>
              <!-- 将 span 变为 块级标签, 增加事件的点击范围 -->
              <span
                v-else
                style="display: block"
                @click="toEdit(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确认删除${row.valueName}吗？`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  size="mini"
                  class="el-icon-delete"
                  type="danger"
                  title="删除属性值"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" class="text el-icon-plus" @click="save">
          保存</el-button
        >
        <el-button class="text" @click="isShowList = false">取消</el-button>
      </el-card>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from "lodash";

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "", // 一级分类id
      category2Id: "", // 二级分类id
      category3Id: "", // 三级分类id
      arrtList: [], // 属性名列表的数据,
      isShowList: false, // 控制属性列表的显示于隐藏默认隐藏 添加和修改属性列表
      attrForm: {
        // 属性值列表数据
        attrName: "", // 属性名
        attrValueList: [], // 属性值名称
      },
    };
  },
  methods: {
    // 调用属性列表接口
    async getAttrList() {
      // 使用赋值结构的方式拿到 data 里的数据, 避免重复写多个 this
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.arrtList = result.data;
      }
    },

    // 自定义事件的回调函数, 将子组件传递的 三级分类 id 分别赋值给 data 中的数据
    changeCategory({ categoryId, level }) {
      // 使用 子组件传递的 level 值进行判断, 根据值来将 id 赋值给不同的对象
      if (level === 1) {
        // 当一级分类改变时, 同时需要清除 二、三级分类的数据
        this.category2Id = "";
        this.category3Id = "";
        this.arrtList = [];
        this.category1Id = categoryId;
      } else if (level === 2) {
        // 当二级分类改变时, 同时需要清除三级分类的数据
        this.category3Id = "";
        this.arrtList = [];
        this.category2Id = categoryId;
      } else if (level === 3) {
        this.category3Id = categoryId;
        // 当三级分类选项发生改变时, 调用 数据列表接口; 调用属性列表的条件为 三级分类选项改变
        this.getAttrList();
      }
    },

    // 添加属性名列表, 当点击添加按钮时, 需要将属性名表隐藏, 可编辑属性名列表显示
    showAddDialog() {
      /* 
          收集 第三级分类的 id ; 添加这行代码是因为 data 中无法使用 this 来获取 第三级分类的 id 值;
          需要使用第三级分类的 id 来渲染 属性列表; 
      */
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryLevel: 3,
        categoryId: this.category3Id,
      };
      this.isShowList = true;
    },
    // 修改属性值接口
    handleEdit(row) {
      // 控制可编辑表格的显示
      this.isShowList = true;
      // 点击修改按钮将原有的属性名列表里的数据进行深拷贝, ...运算符 和 Object.assgin 只有一层对象为深拷贝, 多层为浅拷贝
      // 使用浅拷贝, 修改时会将原来的数据也进行修改, 会发生数据的引用关系
      // 调用第三方库来 lodash 来完成深克隆; row 为属性名列表的原数据
      this.attrForm = cloneDeep(row);
      // 为每一个属性值对象添加一个标识 isEdit 来控制 input 框的显示于隐藏, 默认步显示
      // 对 对象进行修改会添加操作时需要使用 Vue.set() 或 this.$set() 方法
      this.attrForm.attrValueList.forEach((item) => {
        this.$set(item, "isEdit", false);
      });
    },

    // 点击 span 控制 input 框显示的回调; 根据 index 索引值来控制哪一行的显示
    toEdit(row, $index) {
      row.isEdit = true;
      // 为什么要用 $nextTick: 因为获取焦点时 input 还没有渲染, 必须要渲染完毕之后才能获取到焦点
      this.$nextTick(() => {
        // 根据 ref 标识 $index 来为 input 框获取焦点
        this.$refs[$index].focus();
      });
    },
    // 失去焦点的时候触发
    toLook(row, $index) {
      //收集数据
      let valueName = row.valueName;
      // 判断用户输入的属性值是否为空
      if (!valueName.trim()) {
        // 为空提示信息
        this.$message.info("输入的属性值不能为空！请重新输入");
        // 应为是双向数据绑定, 提示玩信息后将 input 输入框的内容清空
        row.valueName = "";
        this.$refs[$index].focus();
        // return 直接中断后续的代码的执行
        return;
      }
      // 判断属性值书否有重复的内容; 使用 some 遍历 attrValueList, 不会改变原数据
      let result = this.attrForm.attrValueList.some((item) => {
        // item 为 attrValueList 中的每一条对象, row 为 input 输入部分的对象
        if (item !== row) {
          // 如果有重复则返回 ture, 不相同则返回 false
          return item.valueName === valueName;
        }
      });

      // 当用户输入的属性值于之前输入的属性值重复则 result 接受到的值为 ture, 不同则为 false
      if (result) {
        // 属性值重复则提示信息
        this.$message.info("输入的属性值内容不能重复！请重新输入");
        // 提示信息后将重复输入的 input 框里的内容清空, 也是双向数据绑定
        row.valueName = "";
        this.$refs[$index].focus();
        // 重复则直接 retun 中断后续代码的执行
        return;
      }
      // 当 input 框失去焦点时需将将 input 框进行隐藏操作, 只显示 span 标签的部分
      row.isEdit = false;
    },
    // 添加属性名按钮的回调
    addArrtValue() {
      // 点击添加时, 会生成一条空的对象来实现占位; push 向 attrValueList 数组里添加数据
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, // 添加操作时, 不需要 id, 只有做修改操作才会用到 id 值
        valueName: "", // valueName 收集到到的为 input 框里输入的内容
        // 点击添加属性名按钮时, input 输入框默认显示
        isEdit: true,
      });
      // 点击添加属性名按钮时就要获取到 input 框的焦点(默认获取到最后输入框的焦点), 根据 attrValueList 数组的长度减一来获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },

    // 点击保存属性表单
    async save() {
      // 收集数据
      let attr = this.attrForm;
      //  判断用户输入的属性值是否为空, filter 为过滤, 数组中的每一个对象, 并不会改变原数组
      attr.attrValueList = attr.attrValueList.filter((item) => {
        if (item.valueName !== "") {
          // 删除无用的数据
          delete item.isEdit;
          // 返回一个 Boolen
          return true;
        }
      });

      // 根据 attrValueList 数据来判断用户在可编辑表单数据是否为空, 当可编辑表单为空时, 不让提交
      if (attr.attrValueList.length === 0) {
        this.$message.info("保存的数据不能为空");
        // 当为空时, 直接中断后续代码的执行
        return;
      }
      // 用来处理成功和错误信息
      try {
        // 调用保存可编辑表单的数据接口, 并将数据以对象的形式传给接口
        await this.$API.attr.addOrUpdate(attr);
        // 处理成功信息
        this.$message.success("保存成功");
        // 保存成功后需要返回属性名列表页, 只需将可编辑表单隐藏
        this.isShowList = false;
        // 返回属性名列表页后调用属性列表接口更新列表
        this.getAttrList();
      } catch (error) {
        // 处理错诶信息
        this.$message.error("保存失败");
      }
    },
    // 删除属性名
    async handleDelete(row) {
      try {
        // 调用删除属性名接口, 需要传递 id
        await this.$API.attr.deleteAttr(row.id);
        // 处理成功信息
        this.$message.success("删除成功");
        // 调用属性列表接口更新列表
        this.getAttrList();
      } catch (error) {
        // 处理错误信息
        this.$message.error("删除失败");
      }
    },
  },
};
</script>

<style lang="scss", scoped>
.text {
  margin-top: 30px;
}
</style>