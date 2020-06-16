<!--
    FileDesc  :
    Author    :  g_eno_phy
    Date      :  2020-03-01 15:08
    Version   :
    Usage     :
        - template
            <EnoAutoScroll></EnoAutoScroll>

        - props
            :duration                   Number              3000                经过scrollScope范围，过程时间(ms)
            :scroll-scope               [Number, String]    'component'         在duration时间内滚动的范围。('component' | 'content' | Number) component，表示该组件可视高度。content，表示整个列表。否则指定高度数字(px)
            :is-mouse-stop              Boolean             true                鼠标划过是否暂停
            :is-daemon                  Boolean             false               是否以守护程序方式继续后台运行，默认false。当页面隐藏的时候，不会滚动
            :is-mousewheel-control      Boolean             true                是否支持鼠标滑轮控制，必须开启[:isMouseStop]，这个操作的设置才有效
            :is-scroll-from-bottom      Boolean             true                是否从底部开始滚动
        - event
            @on-progress                Number              进度改变值
            @on-scroll-end                                  滚动到了底部，需要重新开始滚动，即可触发
        - method
            startScroll()               重新计算内容高度，并重新开始滚动
            stopScroll()                停止滚动，并且重置滚动位置
            keepScroll()                继续滚动
            pauseScroll()               暂停滚动
-->

<template>
    <div ref="enoAutoScroll" class="eno-auto-scroll">
        <div ref="enoAutoScrollContent" class="eno-auto-scroll_container" :class="{'scrolling':isScrolling}">
            <slot></slot>
        </div>
    </div>

</template>

<script>

export default {
    name    : 'EnoAutoScroll',
    props   : {
        // 经过scrollScope范围，过程时间(ms)
        duration           : {
            type   : Number,
            default: 3000
        },
        // 在duration时间内滚动的范围。('component' | 'content' | Number) component，表示该组件可视高度。content，表示整个列表。否则指定高度数字(px)
        scrollScope        : {
            type   : [Number, String],
            default: 'component'
        },
        // 鼠标划过是否暂停
        isMouseStop        : {
            type   : Boolean,
            default: true
        },
        // 是否以守护程序方式继续后台运行，默认false。当页面隐藏的时候，不会滚动
        isDaemon           : {
            type   : Boolean,
            default: false
        },
        // 是否支持鼠标滑轮控制，必须开启[:isMouseStop]，这个操作的设置才有效
        isMousewheelControl: {
            type   : Boolean,
            default: true
        },
        // 是否从底部开始滚动
        isScrollFromBottom : {
            type   : Boolean,
            default: true
        }

    },
    data() {
        return {
            isScrolling        : false, // 是否正在滚动
            isListenered       : false, // 是否设置过监听
            componentSize      : 0, // 组件高度px
            contentSize        : 0, // 内容高度px
            scrollScopeDuration: 0, // 滚动范围内，滚动结束所需要的时间px
            scrollOffsetCurrent: 0, // 当前应该滚动的高度，用于累加赋值px
            scrollSizeUnit100ms: 0, // 每100毫秒滚动的高度px
            interval           : null, // 轮循
            animateDuration    : 600
        };
    },
    computed: {
        // 滚动的百分比
        scrollPerNum() {
            const scrollPerNum = Number((this.scrollOffsetCurrent + this.componentSize) / (this.contentSize + this.componentSize) * 100).toFixed();
            return scrollPerNum < 0 ? 0 : (scrollPerNum > 100 ? 100 : scrollPerNum);
        }
    },
    watch   : {
        scrollPerNum(v) {
            this.$emit('on-progress', v);
        }

    },
    updated() {
        this.initScrollListener();
        if (this.$_checkForSlotContentLengthChange() && this.$refs.enoAutoScrollContent) {
            this.startScroll();
        }
    },

    beforeDestroy() {
        this.pauseScroll();
    },
    methods: {
        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________ [ handle ] ____________________________________________________ */

        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________ [ public ] ____________________________________________________ */
        /**
         * init scroll
         * @return {boolean}
         */
        initScrollListener() {
            const that = this;

            // 若slot中没有值，则返回
            if (!that.$slots.default || !that.$slots.default[0]) {
                return false;
            }

            if (that.$refs.enoAutoScrollContent) {
                //  if is set listener before, return true
                if (that.isListenered) {
                    return true;
                }

                that.isListenered = true;

                // 监听鼠标
                // 若允许鼠标划过，即停止滚动，则设置监听
                if (that.isMouseStop) {
                    that.$refs.enoAutoScroll.addEventListener('mouseover', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        that.pauseScroll();
                    });
                    that.$refs.enoAutoScroll.addEventListener('mouseout', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        that.keepScroll();
                    });

                    if (that.isMousewheelControl) {
                        that.$refs.enoAutoScroll.addEventListener('mousewheel', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const scrollOffsetCurrent = that.scrollOffsetCurrent + Math.floor(e.wheelDeltaY / 3);
                            if (scrollOffsetCurrent > -that.componentSize && scrollOffsetCurrent < that.contentSize) {
                                // 若内容高度小于等于组件高度不进行滚动 直接设置0
                                that.scrollOffsetCurrent                        = that.contentSize <= that.componentSize ? 0 : scrollOffsetCurrent;
                                that.$refs.enoAutoScrollContent.style.transform = `translateY(${-that.scrollOffsetCurrent}px)`;
                            }
                        });
                    }
                }

                window.addEventListener('visibilitychange', (e) => {
                    // 若非后台运行，则当窗口可见改变的时候，进行相关操作
                    if (!this.isDaemon) {
                        if (document.visibilityState === 'hidden') {
                            this.pauseScroll();
                        } else {
                            this.keepScroll();
                        }
                    }
                });
                return true;
            }
        },
        /**
         * begin scroll
         *  1. pause scroll
         *  2. calculate size
         *  3. reset scroll position
         *  4. start scroll
         */
        startScroll() {
            this.pauseScroll();
            this.$_calculateSize();
            this.resetScroll();
            this.keepScroll();
        },

        /**
         * stop scroll
         *  1. pause scroll
         *  2. reset scroll
         */
        stopScroll() {
            // 暂停滚动
            this.pauseScroll();
            // 重置滚动属性
            this.resetScroll();
        },
        /**
         * start scroll
         */
        keepScroll() {
            const that = this;

            if (this.interval) {
                clearInterval(this.interval);
            }
            if (!that.$refs.enoAutoScrollContent) {
                return;
            }

            // 只有初始化滚动条完毕 ，且当内容高度 大于 当前组件可视高度，才会自动滚动
            if (that.contentSize > that.componentSize) {
                that.interval = setInterval(() => {
                    that.scrollOffsetCurrent = that.scrollOffsetCurrent + that.scrollSizeUnit100ms;

                    // 若scrollOffsetCurrent长度超过总长度，则从组件以下区域开始
                    if (that.scrollOffsetCurrent >= that.contentSize) {
                        that.scrollOffsetCurrent                         = -that.componentSize;
                        that.$refs.enoAutoScrollContent.style.visibility = 'hidden';
                        that.isScrolling                                 = false;
                        that.$emit('on-scroll-end');
                    } else {
                        that.$refs.enoAutoScrollContent.style.visibility = 'visible';
                        //  若允许后台运行，且已经在后台，则设置动画间隔时间为0ms
                        this.isScrolling                                 = !(this.isDaemon && document.visibilityState === 'hidden');
                    }
                    that.$refs.enoAutoScrollContent.style.transform = `translateY(${-that.scrollOffsetCurrent}px)`;
                }, that.animateDuration);
            } else {
                that.resetScroll();
            }
        },
        /**
         * pause scroll
         */
        pauseScroll() {
            if (this.interval) {
                this.isScrolling = false;
                clearInterval(this.interval);
                this.interval = null;
            }
        },
        /**
         * reset scroll offset
         * @param isToTop 是否定位到顶部
         */
        resetScroll(isToTop = true) {
            // 内容高度 大于 当前组件可视高度 ,且允许从底部滚动，才允许重置到底部
            if (isToTop) {
                this.scrollOffsetCurrent = 0;
            } else {
                this.scrollOffsetCurrent = this.contentSize > this.componentSize && this.isScrollFromBottom ? -this.componentSize : 0;
            }
            this.$refs.enoAutoScrollContent.style.visibility = 'hidden';
            this.isScrolling                                 = false;
            this.$refs.enoAutoScrollContent.style.transform  = `translateY(${-this.scrollOffsetCurrent}px)`;
            this.$refs.enoAutoScrollContent.style.visibility = 'visible';
        },

        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________ [ private: *,query,fetch,action,init ] ________________________ */

        /**
         * 检查slot内容高度是否改变
         * @returns {boolean}
         */
        $_checkForSlotContentLengthChange() {
            if (this.$slots.default && this.$slots.default[0] && this.$slots.default[0].elm && this.$slots.default[0].elm.offsetHeight !== this.lengthPrev) {
                this.lengthPrev = this.$slots.default[0].elm.offsetHeight;
                return true;
            }
            return false;
        },
        /**
         * 计算尺寸
         */
        $_calculateSize() {
            const that = this;
            if (!that.$refs.enoAutoScrollContent) {
                return;
            }

            that.componentSize = that.$refs.enoAutoScroll.offsetHeight;
            that.contentSize   = that.$refs.enoAutoScrollContent.offsetHeight;

            // 计算出每100毫秒滚动的高度
            switch (that.scrollScope) {
                case 'component': // 组件高度
                    that.scrollSizeUnit100ms = that.componentSize / that.duration * that.animateDuration;
                    break;
                case 'content': // 整个内容高度
                    that.scrollSizeUnit100ms = that.contentSize / that.duration * that.animateDuration;
                    break;
                default: // 指定高度
                    that.scrollSizeUnit100ms = that.scrollScope / that.duration * that.animateDuration;
                    break;
            }
        }
        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________ [ private: *,query,fetch,action,init ] ________________________ */

    }
};
</script>
<style scoped>
.eno-auto-scroll {
    position : relative;
    overflow : hidden;
    height   : 100%;
    width    : 100%;
}

.eno-auto-scroll_container {
    display : block;
    width   : 100%;
}

.eno-auto-scroll_container:not(.scrolling) {
    transition : all 0ms linear 0ms;
}

.eno-auto-scroll_container.scrolling {
    transition : all 600ms linear 0ms;
}
</style>
