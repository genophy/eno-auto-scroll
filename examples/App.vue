<template>
    <div id="app">
        <EnoAutoScroll style="height: 100px;width: 200px;background-color: aquamarine;margin: auto;" @on-progress="progressNum=$event">
            <div>
                <div v-for="(item,idx) in list" :key="idx">{{item}}</div>
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
            progressNum: 0
        };
    },
    created() {
        this.list = new Array(50);
        this.list.fill('abcdefg');
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
