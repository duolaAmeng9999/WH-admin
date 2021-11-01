import request from "@/utils/request" // 相当于前面我们封装的ajax

const api_name = "/admin/product"

export default {
    /*
      下架SKU
      GET /admin/product/cancelSale/{skuId}
      */
    cancelSale(skuId) {
        return request.get(`${api_name}/cancelSale/${skuId}`)
    },

    /*
      上架SKU
      GET /admin/product/onSale/{skuId}
      */
    onSale(skuId) {
        return request.get(`${api_name}/onSale/${skuId}`)
    },

    /*
      删除指定id的sku
      DELETE /admin/product/deleteSku/{skuId}
      */
    remove(skuId) {
        return request.delete(`${api_name}/deleteSku/${skuId}`)
    },

    /*
      根据指定的SPU的id查询所有对应的SKU的列表
      GET /admin/product/findBySpuId/{spuId}
      */
    getListBySpuId(spuId) {
        return request.get(`${api_name}/findBySpuId/${spuId}`)
    },

    /*
      根据SKU的id查询SKU的详细信息
      GET /admin/product/getSkuById/{skuId}
      */
    get(skuId) {
        return request.get(`${api_name}/getSkuById/${skuId}`)
    },

    /*
      获取SKU的分页列表
      GET /admin/product/list/{page}/{limit}
      */
    getList(page, limit) {
        return request.get(`${api_name}/list/${page}/${limit}`)
    },

    /*
      保存SKU
      POST /admin/product/saveSkuInfo
      POST /admin/product/updateSkuInfo
      */
    addUpdate(skuInfo) {
        return request.post(
            `${api_name}/${skuInfo.id ? "update" : "save"}SkuInfo`,
            skuInfo
        )
    },

    /*
      获取指定SPU的id对应的图片列表
      GET /admin/product/spuImageList/{spuId}
      */
    getSpuImageList(spuId) {
        return request.get(`${api_name}/spuImageList/${spuId}`)
    },

    /*
      获取指定SPU的id对应的销售属性列表
      GET /admin/product/spuSaleAttrList/{spuId}
      */
    getSpuSaleAttrList(spuId) {
        return request.get(`${api_name}/spuSaleAttrList/${spuId}`)
    }
}
