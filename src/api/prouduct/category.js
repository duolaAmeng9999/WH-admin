// 三级分类的获取接口
import request from "@/utils/request";
const api_name = `/admin/product`;

/* 

GET /admin/product/getCategory1                   getCategory1

GET /admin/product/getCategory2/{category1Id}     getCategory2

GET /admin/product/getCategory3/{category2Id}     getCategory3


*/
export default {
    // 获取一级分类
    getCategory1() {
        return request(`${api_name}/getCategory1`)
    },
    // 获取二级分类
    getCategory2(category1Id) {
        return request(`${api_name}/getCategory2/${category1Id}`)
    },
    // 获取三级分类
    getCategory3(category2Id) {
        return request(`${api_name}/getCategory3/${category2Id}`)
    }
}