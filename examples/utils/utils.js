/**
 * @description 通用类
 * @author  g_eno_phy
 * @version 0.1
 * Date      :  2020-06-16 10:22
 */
export default {

  /**
   * 随机字符串的列表
   * @returns {string[]}
   */
  randomList() {
    const listTotal = Math.floor(Math.random() * 10 + 20);
    const list      = new Array(listTotal);
    list.fill('');
    return list.map(() => {
      const nums = [];
      for (let i = 0; i < Math.round(Math.random() * 10) + 2; i++) {
        nums.push(String.fromCharCode(Math.round(Math.random() * 26) + (Math.round(Math.random()) > 0 ? 65 : 97)));
      }
      return nums.join('');
    });
  }
};
