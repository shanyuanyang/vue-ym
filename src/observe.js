/**
 * observer 用于给data中所有的数据添加getter和setter
 * 方便我们在获取数据或者设置data中数据的时候，实现我们的逻辑
 * 
 * 
 */

class observer {
  constructor(data) {
    // console.log(123);
    // console.log(data);
    this.data = data;
    this.walk(data)
  }


  /**核心方法 */
  /**遍历data中的数据，都添加上getter和setter */
  walk(data) {
    if (!data || typeof data != 'object') {
      return;
    }
    console.log(Object.keys(data))
    Object.keys(data).forEach(key => {
      console.log(data)
      console.log(data[key])
      // 给data对象的key设置getter和setter
      this.defineReactive(data, key, data[key])
      // 如果data[key]是一个复杂的类型，递归walk
      this.walk(data[key])
    })
  }

  // 定义响应式的数据，（也就是数据劫持）
  defineReactive(obj, key, value) {
    console.log(obj)
    let that = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log(`你获取了值${value}`)
      },
      set(newValue) {
        if (value === newValue) {
          return
        }
        console.log('你设置了值' + newValue)
        value = newValue;
        // 如果newValue是个对象，也应该进行劫持
        that.walk(newValue)
      }
    })
  }
}