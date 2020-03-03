/**
 FileDesc  :
 Author    :  g_eno_phy
 Date      :  2020-03-04 00:54
 Version   :
 */
import EnoAutoScroll from './eno-auto-scroll';

const components = [
    EnoAutoScroll
];

const install = function (Vue) {
    if (install.installed) return;
    install.installed = true;
    // 遍历并注册全局组件
    components.map(component => {
        Vue.component(component.name, component);
    });
};
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
export default {
    // 导出的对象必须具备一个 install 方法
    install,
    // 组件列表
    ...components
};
