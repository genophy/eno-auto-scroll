<template>
    <div id="app">
        <div class="demo-scroll">
            <EnoAutoScroll @on-progress="progressNum=$event" @on-scroll-end="scrollCount ++">
                <div style="padding:10px 0;">
                    <div v-for="(item,idx) in list" :key="idx">{{idx + 1}}/{{list.length}}--{{item}}</div>
                </div>
            </EnoAutoScroll>
        </div>

        <span class="per-num">{{progressNum}}%</span>
        <span class="per-num">{{scrollCount}}times</span>
    </div>
</template>

<script>

export default {
    name   : 'App',
    data() {
        return {
            list       : [],
            progressNum: 0,
            scrollCount: 0,
            interval   : null
        };
    },
    created() {
        this.list = new Array(Math.floor(Math.random() * 10 + 20));
        this.list.fill('abcdefg');
        this.interval = setInterval(() => {
            this.list = new Array(Math.floor(Math.random() * 10 + 20));
            this.list.fill('abcdefg');
        }, 10000);
    },
    beforeDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    methods: {
        handleScrollEnd() {
            console.log('scroll end');
        }
    }
};
</script>

<style>
#app {
    font-family             : Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing  : antialiased;
    -moz-osx-font-smoothing : grayscale;
    text-align              : center;
    color                   : #2c3e50;
    margin-top              : 60px;
}

.demo-scroll {
    height           : 200px;
    width            : 200px;
    background-color : aquamarine;
    margin           : auto;
}

.per-num {
    display     : block;
    color       : #a6cb61;
    font-size   : 40px;
    font-weight : 800;
    padding     : 20px;
}

</style>
