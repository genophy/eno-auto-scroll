<!--
    FileDesc  :
    Author    :  g_eno_phy
    Date      :  2020-03-01 15:08
    Version   :
    Usage     :
        - template
            <EnoAutoScroll></EnoAutoScroll>

        - props
            :duration               Number              3000                经过scrollScope范围，过程时间(ms)
            :scrollScope            [Number, String]    'component'         在duration时间内滚动的范围。('component' | 'content' | Number) component，表示该组件可视高度。content，表示整个列表。否则指定高度数字(px)
            :isMouseStop            Boolean             true                鼠标划过是否暂停
            :isDaemon               Boolean             false               是否以守护程序方式继续后台运行，默认false。当页面隐藏的时候，不会滚动
            :isMouseWheelControl    Boolean             true                是否支持鼠标滑轮控制，必须开启[:isMouseStop]，这个操作的设置才有效
            :isScrollFromBottom     Boolean             true                是否从底部开始滚动
            :animateDuration        Number              300                 动画时间间隔(ms)
            :orientation            String              'vertical'          滚动方向 ( 'vertical' | 'horizontal')
        - event
            @on-progress            Number             进度改变值
        - method
-->

<template>
    <div class="eno-auto-scroll" style="position : relative;overflow : hidden;">
        <div ref="enoAutoScroll" style="width:100%;height:100%;overflow: hidden;">
            <div ref="enoAutoScrollContent" style="display : inline-block;">
                <slot></slot>
            </div>
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
        // 在duration时间内滚动的范围。component，表示该组件可视高度。content，表示整个列表。否则指定高度数字(px)
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
        isMouseWheelControl: {
            type   : Boolean,
            default: true
        },
        // 是否从底部开始滚动
        isScrollFromBottom : {
            type   : Boolean,
            default: true
        },

        // 动画时间间隔(ms)
        animateDuration: {
            type   : Number,
            default: 300
        },
        // 滚动方向
        orientation    : {
            type   : String,
            default: 'vertical' // horizontal
        }
    },
    data() {
        return {
            componentSize      : 0, // 组件高度px
            contentSize        : 0, // 内容高度px
            scrollScopeDuration: 0, // 滚动范围内，滚动结束所需要的时间px
            scrollOffsetCurrent: 0, // 当前应该滚动的高度，用于累加赋值px
            scrollSizeUnit100ms: 0, // 每100毫秒滚动的高度px
            interval           : null // 轮循
        };
    },
    computed: {
        // 滚动的百分比
        scrollPerNum() {
            const scrollPerNum = Math.floor((this.scrollOffsetCurrent + this.componentSize) / (this.contentSize + this.componentSize) * 100);
            return scrollPerNum < 0 ? 0 : (scrollPerNum > 100 ? 100 : scrollPerNum);
        }
    },
    watch   : {
        '$slots.default': {
            handler  : function (v) {
                if (v && v[0]) {
                    this.$nextTick(() => {
                        this.$_initScroll().then(() => {
                            this.$_startScroll();
                        });
                    });
                }
            },
            // deep     : true,
            immediate: true
        },
        scrollPerNum(v) {
            this.$emit('on-progress', v);
        }

    },
    beforeDestroy() {
        this.$_stopScroll();
    },
    mounted() {
        window.addEventListener('visibilitychange', (e) => {
            if (!this.isDaemon) {
                if (document.visibilityState === 'hidden') {
                    this.$_stopScroll();
                } else {
                    this.$_startScroll();
                }
            }
        });
    },
    methods : {
        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________ [ handle ] ____________________________________________________ */

        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________ [ public ] ____________________________________________________ */

        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________________________________________________________________________ */
        /* _____________________ [ private: *,query,fetch,action,init ] ________________________ */

        $_initScroll() {
            const that = this;
            return new Promise((resolve) => {
                if (that.$refs.enoAutoScrollContent) {
                    if (that.orientation === 'vertical') {
                        that.componentSize = that.$refs.enoAutoScroll.offsetHeight;
                        that.contentSize   = that.$refs.enoAutoScrollContent.offsetHeight;
                    } else {
                        that.componentSize = that.$refs.enoAutoScroll.offsetWidth;
                        that.contentSize   = that.$refs.enoAutoScrollContent.offsetWidth;
                    }
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
                    // 若从底部开始滚动
                    if (that.isScrollFromBottom) {
                        that.scrollOffsetCurrent                         = -that.componentSize;
                        that.$refs.enoAutoScrollContent.style.visibility = 'hidden';
                        that.$refs.enoAutoScrollContent.style.transition = 'all 0ms linear';
                        that.$refs.enoAutoScrollContent.style.transform  = that.orientation === 'vertical' ? `translateY(${-that.scrollOffsetCurrent}px)` : `translateX(${-that.scrollOffsetCurrent}px)`;
                    }

                    // 监听鼠标
                    // 若允许鼠标划过，即停止滚动，则设置监听
                    if (that.isMouseStop) {
                        that.$refs.enoAutoScroll.addEventListener('mouseover', (e) => {
                            e.preventDefault();
                            that.$_stopScroll();
                        });
                        that.$refs.enoAutoScroll.addEventListener('mouseout', (e) => {
                            e.preventDefault();
                            that.$_startScroll();
                        });
                        if (that.isMouseWheelControl) {
                            that.$refs.enoAutoScroll.addEventListener('mousewheel', (e) => {
                                e.preventDefault();

                                const scrollOffsetCurrent = that.scrollOffsetCurrent + e.wheelDeltaY;
                                if (scrollOffsetCurrent > -that.componentSize && scrollOffsetCurrent < that.contentSize) {
                                    that.scrollOffsetCurrent                        = scrollOffsetCurrent;
                                    that.$refs.enoAutoScrollContent.style.transform = that.orientation === 'vertical' ? `translateY(${-that.scrollOffsetCurrent}px)` : `translateX(${-that.scrollOffsetCurrent}px)`;
                                }
                            });
                        }
                    }

                    resolve();
                }
            });
        },

        $_startScroll() {
            const that    = this;
            that.interval = setInterval(() => {
                that.scrollOffsetCurrent = that.scrollOffsetCurrent + that.scrollSizeUnit100ms;
                // 若scrollOffsetCurrent长度超过总长度，则从0开始
                if (that.scrollOffsetCurrent >= that.contentSize) {
                    that.scrollOffsetCurrent                         = -that.componentSize;
                    that.$refs.enoAutoScrollContent.style.visibility = 'hidden';
                    that.$refs.enoAutoScrollContent.style.transition = 'all 0ms linear';
                } else {
                    that.$refs.enoAutoScrollContent.style.visibility = 'visible';
                    //  若允许后台运行，且已经在后台，则设置动画间隔时间为0ms
                    if (this.isDaemon && document.visibilityState === 'hidden') {
                        that.$refs.enoAutoScrollContent.style.transition = 'all 0ms linear';
                    } else {
                        that.$refs.enoAutoScrollContent.style.transition = `all ${that.animateDuration}ms linear`;
                    }
                }
                that.$refs.enoAutoScrollContent.style.transform = that.orientation === 'vertical' ? `translateY(${-that.scrollOffsetCurrent}px)` : `translateX(${-that.scrollOffsetCurrent}px)`;
            }, that.animateDuration);
        },
        $_stopScroll() {
            if (this.interval) {
                this.$refs.enoAutoScrollContent.style.transition = 'all 0ms linear';
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    }
};
</script>
