<template>
    <div class="ratingSelect">
        <div class="rating-type">
            <span @click="select(2, $event)" class="block positive" :class="{'active': ratingType === 2}">{{desc.all}}
                <span class="count">{{ratings.length}}</span>
            </span>
            <span @click="select(0, $event)" class="block positive" :class="{'active': ratingType === 0}">{{desc.positive}}
                <span class="count">{{positives.length}}</span>
            </span>
            <span @click="select(1, $event)" class="block negative" :class="{'active': ratingType === 1}">{{desc.negative}}
                <span class="count">{{negatives.length}}</span>
            </span>
        </div>
        <div @click="toggle" class="switch" :class="{'on': only}">
            <i class="iconfont icon-gou"></i>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>
<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
    props: {
        ratings: {
            type: Array,
            default() {
                return [];
            }
        },
        selectType: {
            type: Number
        },
        onlyContent: {
            type: Boolean
        },
        desc: {
            type: Object,
            default() {
                return {
                    all: "全部",
                    positive: "满意",
                    negative: "不满意"
                };
            }
        }
    },
    data() {
        return {
            ratingType: this.selectType,
            only: this.onlyContent
        };
    },
    computed: {
        positives() {
            return this.ratings.filter(rating => {
                return rating.rateType === POSITIVE;
            });
        },
        negatives() {
            return this.ratings.filter(rating => {
                return rating.rateType === NEGATIVE;
            });
        }
    },
    methods: {
        select(type, event) {
            if (!event._constructed) {
                return;
            }
            this.ratingType = type;
            this.$emit("selectRating", type);
        },
        toggle(event) {
            if (!event._constructed) {
                return;
            }
            this.only = !this.only;
            this.$emit("toggleRating", this.only);
        }
    }
};
</script>
<style lang="less">
.ratingSelect {
    .rating-type {
        padding: 18px 0;
        margin: 0 18px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        font-size: 0;
        .block {
            display: inline-block;
            padding: 8px 12px;
            margin-right: 8px;
            border-radius: 1px;
            font-size: 12px;
            color: rgb(77, 85, 93);
            &.active {
                color: #ffffff;
            }
            .count {
                margin-left: 2px;
                line-height: 16px;
                font-size: 8px;
            }
        }
        .positive {
            background: rgba(0, 160, 200, 0.2);
            &.active {
                background: rgb(0, 160, 220);
            }
        }
        .negative {
            background: rgba(77, 85, 93, 0.2);
            &.active {
                background: rgb(77, 85, 93);
            }
        }
    }
    .switch {
        padding: 12px 18px;
        line-height: 24px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        color: rgb(147, 153, 159);
        font-size: 0;
        &.on {
            .icon-gou {
                color: #00c850;
            }
        }
        .icon-gou {
            display: inline-block;
            vertical-align: top;
            font-size: 24px;
            margin-right: 4px;
        }
        .text {
            font-size: 12px;
            display: inline-block;
            vertical-align: top;
        }
    }
}
</style>

