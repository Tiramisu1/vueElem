<template>
    <section id="starList">
        <div class="star" :class="starType">
            <span v-for="(item, index) in itemClasses" :key="index" :class="item" class="star-item"></span>
        </div>
    </section>
</template>
<script>
const LENGTH = 5;
const CLS_ON = "on";
const CLS_OFF = "off";
const CLS_HALF = "half";

export default {
    props: {
        size: {
            type: Number
        },
        score: {
            type: Number
        }
    },
    computed: {
        starType() {
            return "star-" + this.size;
        },
        itemClasses() {
            let result = [];
            let score = Math.floor(this.score * 2) / 2; //向下取0.5倍
            let hasDEcimal = score % 1 !== 0; //小数
            let integer = Math.floor(score); //整数
            for (let i = 0; i < integer; i++) {
                // 整数为几放入多少全星
                result.push(CLS_ON);
            }
            if (hasDEcimal) {
                // 放入半星，半星最多为一个，没有就不放
                result.push(CLS_HALF);
            }
            while (result.length < LENGTH) {
                //判断是否长度达到五星，没有就添加黑星
                result.push(CLS_OFF);
            }
            return result;
        }
    }
};
</script>
<style lang="less">
.star {
    font-size: 0;
    display: inline-block;
    background-repeat: no-repeat;
}
.star-48 {
    .star-item {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 22px;
        background-size: 20px 20px;
        background-repeat: no-repeat;
    }
    :last-child {
        margin-right: 0;
    }
    .on {
        background-image: url(../assets/img/star48_on@2x.png);
    }
    .half {
        background-image: url(../assets/img/star48_half@2x.png);
    }
    .off {
        background-image: url(../assets/img/star48_off@2x.png);
    }
}
.star-36 {
    .star-item {
        width: 15px;
        height: 15px;
        display: inline-block;
        margin-right: 5px;
        background-size: 15px 15px;
        background-repeat: no-repeat;
    }
    :last-child {
        margin-right: 0;
    }
    .on {
        background-image: url(../assets/img/star36_on@2x.png);
    }
    .half {
        background-image: url(../assets/img/star36_half@2x.png);
    }
    .off {
        background-image: url(../assets/img/star36_off@2x.png);
    }
}
.star-24 {
    .star-item {
        width: 10px;
        height: 10px;
        display: inline-block;
        margin-right: 3px;
        background-size: 10px 10px;
        background-repeat: no-repeat;
    }
    :last-child {
        margin-right: 0;
    }
    .on {
        background-image: url(../assets/img/star24_on@2x.png);
    }
    .half {
        background-image: url(../assets/img/star24_half@2x.png);
    }
    .off {
        background-image: url(../assets/img/star24_off@2x.png);
    }
}
</style>


