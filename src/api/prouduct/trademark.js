// 品牌管理接口
import request from "@/utils/request";
const api_name = '/admin/product/baseTrademark'
export default {
    // 删除品牌接口
    delete(id) {
        return request.delete(`${api_name}/remove/${id}`)
    },
    // 新增和修改品牌接口, 新增和修改的时候会传入一个对象, 没有 id 值, 修改的时候会传入 id 值
    addOrUpdate(trademark) {
        // 传入的对象有 id 为修改操作, 否则为 添加操作
        if (trademark.id) {
            return request.put(`${api_name}/update`, trademark);
        } else {
            return request.post(`${api_name}/save`, trademark)
        }
    },
    // 获取品牌列表
    getPageList(page, limit) {
        // 当点击分页时, page 为当前页; limit 为每页显示多少条
        if (page && limit) {
            return request.get(`${api_name}/${page}/${limit}`);
        } else { // 获取品牌列表
            return request.get(`${api_name}/getTrademarkList`)
        }
    },
    // 获取品牌详情
    get(id) {
        return request.get(`${api_name}/get/${id}`)
    },
    // 关键字
    findBaseTrademarkByKeyWord(keyword) {
        return request.get(`${api_name}/findBaseTrademarkByKeyWord/${keyword}`);
    }
}