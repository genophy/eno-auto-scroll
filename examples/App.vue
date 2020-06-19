<template>
  <div id="app">
    <ul class="btn-switch" :class="{'is-visible':isVisibility}" @click="isVisibility = !isVisibility">
      <li class="item visible">显示</li>
      <li class="item invisible">隐藏</li>
    </ul>

    <div v-if="isVisibility" class="demo-scroll">
      <EnoAutoScroll :duration="1000" @on-progress="progressNum=$event" @on-scroll-end="scrollCount ++">
        <div v-for="(item,idx) in list" :key="idx">{{idx + 1}}/{{list.length}}--{{item}}</div>
      </EnoAutoScroll>
    </div>

    <button @click="handleGenerateList">重新生成列表</button>
    <button @click="list = []">清空列表</button>

    <span class="per-num">{{progressNum}}%</span>
    <span class="per-num">{{scrollCount}}times</span>
  </div>
</template>

<script>
import utils from './utils/utils';

export default {
  name   : 'App',
  data() {
    return {
      list        : [],
      progressNum : 0,
      scrollCount : 0,
      interval    : null,
      isVisibility: true
    };
  },
  created() {
    // 模拟创建随机列表
    this.list     = utils.randomList();
    this.interval = setInterval(() => {
      this.list = utils.randomList();
    }, 30000);
  },
  beforeDestroy() {
    // 清空interval
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },
  methods: {
    handleGenerateList() {
      this.list = utils.randomList();
    },
    /**
     * 滚动结束
     */
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

.btn-switch {
  display         : flex;
  justify-content : center;
}

.btn-switch .item {
  list-style : none;
  font-size  : 14px;
  color      : #fff;
  padding    : 4px 8px;
  cursor     : pointer;
}

.btn-switch:not(.is-visible) .visible, .btn-switch.is-visible .invisible {
  background-color : #cbcbf5;
}

.btn-switch:not(.is-visible) .invisible, .btn-switch.is-visible .visible {
  background-color : #23b1c5;
}

</style>
