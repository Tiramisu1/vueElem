<template>
    <section class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current': currentIndex == index}" @click="selectMenu(index, $event)">
                    <span class="text">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="food-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <!-- 特殊变量 $event 在内联语句处理器中访问原始的 DOM 事件 -->
                        <li  v-for="(food, num) in item.foods" :key="num" class="food-item"  @click="getFoods(food, $event)">
                            <div class="icon">
                                <img :src="food.icon" alt="" width="57px" height="57px" style="border-radius: 4px;">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="desc">
                                    <span style="margin-right: 12px">{{'月售'+food.sellCount+'份'}}</span>
                                    <span>{{'好评率'+food.rating+'%'}}</span>
                                </div>
                                <div class="price">
                                    <span>￥{{food.price}}</span>
                                    <span v-show="food.oldPrice !== ''" class="old-price">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cart-wrapper">
                                    <cartcontrol :food="food" @cartAdd="cartAdd"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcars ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" @cartFind="cartFind"></shopcars>
        <food :food="foodData" @foodAdd="find" ref="food"></food>
    </section>
</template>
<script>
import { getGoodsData, getSellerData } from "../api/api.js";
import BScroll from "better-scroll";
import shopcars from "./shopcars";
import cartcontrol from "./cartcontrol";
import food from './food'

export default {
    props: ["seller"],
    computed: {
        currentIndex() {
            for (var i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                if ( !height2 ||(this.scrollY >= height1 && this.scrollY < height2)) {
                    return i;
                }
            }
            return 0;
        },
        selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count){
                        foods.push(food)
                    }
                })
            });
            return foods
        }
    },
    created() {
        this.classMap = [
            "decrease",
            "discount",
            "special",
            "invoice",
            "guarantee"
        ];
        // 获取商品列表
        getGoodsData().then(data => {
            this.goods = data.data;
            this.$nextTick(() => {
                //数据修改后DOM渲染完成之后调用
                this.initScroll();
                this.calculateHeight();
            });
        });
    },
    components: {
        shopcars,
        cartcontrol,
        food
    },
    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            foodData: {}
        };
    },
    methods: {
        //设置右侧内容滚动
        initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                click: true //可以点击
            });
            this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
                probeType: 3, //检测滚动的位置
                click: true
            });
            // 获取滚动的Y轴
            this.foodScroll.on("scroll", pos => {
                this.scrollY = Math.abs(Math.round(pos.y));
            });
        },
        //获取右侧内容高度
        calculateHeight() {
            let foodList = this.$refs.foodsWrapper.getElementsByClassName(
                "food-list-hook"
            );
            let height = 0;
            this.listHeight.push(height);
            for (var i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                height += item.clientHeight; //元素内容及其边框所占据的空间大小
                this.listHeight.push(height);
            }
        },
        selectMenu(index, event) {
            if (!event._constructed) {
                //避免点击事件发生两次
                return;
            }
            let foodList = this.$refs.foodsWrapper.getElementsByClassName(
                "food-list-hook"
            );
            let el = foodList[index];
            this.foodScroll.scrollToElement(el, 300);
        },
        cartAdd (target) {
            this.$nextTick(() => { //异步执行动画更流畅，优化体验
                this.$refs.shopcart.drop(target)
            })
        },
        getFoods(food, event) {
             if (!event._constructed) {
                //避免点击事件发生两次
                return;
            }
            this.foodData = food;
            this.$refs.food.show(); //调用子组件show方法
        },
        find(target) {
            this.$nextTick(() => { //异步执行动画更流畅，优化体验
                this.$refs.shopcart.drop(target)
            })
        },
        cartFind(target) {
            this.$nextTick(() => {
                this.$refs.shopcart.drop(target)
            })
        }
    }
};
</script>
<style lang="less">
@import url(../assets/css/common.css);
.goods {
    display: flex;
    position: absolute;
    width: 100%;
    top: 174px;
    bottom: 46px;
    overflow: hidden;
    .menu-wrapper {
        flex: 0 0 80px;
        width: 80px;
        background: #f3f5f7;
        .menu-item {
            display: table; //垂直居中
            width: 56px;
            height: 54px;
            line-height: 14px;
            font-size: 0;
            margin: 0 auto;
            .icon {
                display: inline-block;
                vertical-align: top;
                width: 12px;
                height: 12px;
                margin-right: 2px;
                background-size: 12px 12px;
                background-repeat: no-repeat;
            }
            .text {
                display: table-cell;
                font-size: 12px;
                vertical-align: middle;
                width: 56px;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            }
        }
        .current {
            position: relative;
            z-index: 10;
            margin-top: -1px;
            font-weight: 700;
            background: #fff;
            text-align: center;
            width: 80px;
            .text {
                border: none;
            }
        }
    }
    .food-wrapper {
        flex: 1;
        .title {
            padding-left: 14px;
            height: 26px;
            line-height: 26px;
            border-left: 2px solid #d9dde1;
            font-size: 12px;
            color: rgb(147, 153, 159);
            background: #f3f5f7;
        }
        .food-item {
            display: flex;
            margin: 18px;
            padding-bottom: 18px;
            position: relative;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            &:last-child {
                border-bottom: none;
            }
            .icon {
                flex: 0 0 57px;
                margin-right: 10px;
            }
            .content {
                flex: 1;
                .name {
                    margin: 2px 0px 8px 0px;
                    font-size: 14px;
                    line-height: 14px;
                    color: rgb(7, 17, 27);
                }
                .desc {
                    margin: 0px 0px 8px 0px;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                    line-height: 14px;
                }
                .price {
                    font-size: 14px;
                    color: rgb(240, 20, 20);
                    line-height: 24px;
                    font-weight: 700;
                    .old-price {
                        font-size: 10px;
                        margin-left: 4px;
                        color: rgb(147, 153, 159);
                        text-decoration: line-through;
                    }
                    .add {
                        color: rgb(0, 160, 200);
                        font-size: 24px;
                        line-height: 24px;
                        float: right;
                    }
                }
                .cart-wrapper{
                    position: absolute;
                    right: 0;
                    bottom: 12px;
                }
            }
        }
    }
}
</style>


