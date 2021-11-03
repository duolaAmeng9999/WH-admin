import store from '@/store';
export function hasBtnPermmission() {
    // 当前用户所有的按钮权限
    const buttons = store.getters.buttons
    // 当用户拥有这个权限按钮; 那么这个用户返回 buttons 就包含这个权限的字符串; 否者没有
    return buttons.indexOf(str) !== -1;
}
// 需要全局注册按钮的权限; 放在 Vm 原型上