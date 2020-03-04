# eno-auto-scroll

自动循环滚动

## Plugin example
![example.gif](example.gif)

## Plugin install
```
npm install --save eno-auto-scroll
```

## Plugin setup
> src/main.js

```
import EnoAutoScroll from 'eno-auto-scroll';

Vue.use(EnoAutoScroll);
```

### Component usage
```
<EnoAutoScroll style="height: 100px;">
    <div>第1行</div>
    <div>第2行</div>
    <div>第3行</div>
    <div>第4行</div>
    <div>第...行</div>
</EnoAutoScroll>
```

### Component Props

| name | type | default | describe |
| --- | --- |--- | --- |
| duration | Number | 3000 | 经过scrollScope范围，过程时间(ms) |
| scroll-scope | Number, String | 'component' | 在duration时间内滚动的范围。('component':组件可视区域 , 'content':整个列表 , Number:指定(px)) |
| isMouseStop | Boolean | true | 鼠标划过是否暂停 |
| isDaemon | Boolean | false | 是否以守护程序方式继续后台运行。当页面隐藏的时候，不会滚动 |
| isMouseWheelControl | Boolean | true | 是否支持鼠标滑轮控制，必须开启[:isMouseStop]，这个操作的设置才有效 |
| isScrollFromBottom | Boolean | true | 是否从末尾开始滚动 |
| animateDuration | Number | 300 | 动画刷新时间间隔(ms) |
| orientation | String | 'vertical' |  滚动方向 ( 'vertical' , 'horizontal') |


### Component Event
| name | type | describe |
| --- | --- |--- |
| on-progress | Number | 进度改变值(0 - 100) |
