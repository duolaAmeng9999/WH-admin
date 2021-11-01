import request from "@/utils/request";

const api_name = `/admin/product`

/* 
    GET /admin/product/baseSaleAttrList                 getBaseSaleAttrList

    DELETE /admin/product/deleteSpu/{spuId}             deleteSpu

    GET /admin/product/findSpuInfoByKeyword/{keyword}   findSpuInfoByKeyword

    GET /admin/product/getSpuById/{spuId}               获取spu基本信息

    POST /admin/product/inner/findSpuInfoBySpuIdList    findSpuInfoBySpuIdList

    POST /admin/product/saveSpuInfo                     saveSpuInfo

    POST /admin/product/updateSpuInfo                   更改spu信息

    GET /admin/product/{page}/{limit}                   index
*/
export default {
    // 获取 spu 所有销售属性列表
    getSaleAttrList() {
        return request.get(`${api_name}/baseSaleAttrList`)
    },

    // 删除指定的 spu 
    deleteSpu(spuId) {
        return request.delete(`${api_name}/deleteSpu/${spuId}`);
    },
    // 根据关键字来对 spu 进行查找
    findSpuInfoByKeyword(keyword) {
        return request.get(`${api_name}/findSpuInfoByKeyword/${keyword}`)
    },
    // 根据 id 获取对应 spu 的详情
    get(spuId) {
        return request.get(`${api_name}/getSpuById/${spuId}`)
    },
    // 更新或者添加, 有 id 则为修改, 无 id 则为添加
    addUpdate(spuInfo) {
        return request.post(`${api_name}/${spuInfo.id ? 'update' : 'save'}SpuInfo`, spuInfo)
    },
    //  获取 spu 分页列表数据
    getList(page, limit, category3Id) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'GET',
            params: { category3Id }
        })
    }

}