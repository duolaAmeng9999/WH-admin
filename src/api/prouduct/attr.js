// 平台属性管理接口
import request from "@/utils/request";
const api_name = `/admin/product`

/*

GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  attrInfoList

DELETE /admin/product/deleteAttr/{attrId}  deleteAttr

GET /admin/product/getAttrValueList/{attrId}  getAttrValueList

POST /admin/product/saveAttrInfo   saveAttrInfo

*/
export default {
    // 获取三级联动列表
    getList(category1Id, category2Id, category3Id) {
        return request.get(`${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },
    // 删除品牌属性
    deleteAttr(attrId) {
        return request.delete(`${api_name}/deleteAttr/${attrId}`)
    },
    // 获取属性值列表
    getAttrValueList(attrId) {
        return request.get(`${api_name}/getAttrValueList/${attrId}`)
    },
    // 更新或添加品牌属性
    addOrUpdate(attr) {
        return request.post(`${api_name}/saveAttrInfo`, attr)
    }
}
