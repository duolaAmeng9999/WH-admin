// 利用 api/index 对接口进行统一的暴露; 引入并暴露出去

// 品牌管理接口
export { default as trademark } from './prouduct/trademark.js';
// 属性管理接口
export { default as attr } from './prouduct/attr.js'
// 获取三级分类接口
export { default as category } from "./prouduct/category.js"
// spu 相关接口
export { default as spu } from "./prouduct/spu.js"
// sku 相关接口
export { default as sku } from "./prouduct/sku.js"

export { default as permission } from './acl/permission'
export { default as role } from './acl/role'

export * as user from './acl/user'
