<template>
    <div id="app">
        <EnoAutoScroll style="height: 100px;width: 200px;background-color: aquamarine;margin: auto;" scroll-scope="content" @on-progress="progressNum=$event">
            <div>
                <div v-for="(item,idx) in list" :key="idx">{{idx + 1}}/{{list.length}}--{{item}}</div>
            </div>
        </EnoAutoScroll>
        {{progressNum}}%
    </div>
</template>

<script>

export default {
    name: 'App',
    data() {
        return {
            list       : [],
            progressNum: 0,
            interval   : null
        };
    },
    created() {
        this.interval = setInterval(() => {
            this.list = new Array(Math.floor(Math.random() * 50 + 20));
            this.list.fill('abcdefg');
        }, 30000);
    },
    beforeDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
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
</style>
