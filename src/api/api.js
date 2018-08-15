import axios from 'axios'

let base = 'https://www.easy-mock.com/mock/5b1e1cf2d4a14a3247a6cdfb/example';

// 店铺首页
export const getSellerData = params => {
    return axios.get(`${base}/api/seller`, {
        params
    })
}
// 商品详情
export const getGoodsData = params => {
    return axios.get(`${base}/api/goods`,{
        params
    })
}
// 用户评价
export const getRatingsData = params => {
    return axios.get(`${base}/api/ratings`,{
        params
    })
}