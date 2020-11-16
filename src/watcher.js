/**
 * watcher模块复杂把compile模块和observe模块关联起来
 */


class watcher {
  // vm当前的vue实例
  // expr:date中数据的名字
  // 一旦数据发送变化，需要回调cb
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb

    // debugger
    // 存储到Dep.target
    Dep.target = this;


    // 需要把旧值存起来
    this.oldValue = this.getVMValue(vm, expr);

    // 清空Dep.target

    Dep.target = null
  }

  // 对外暴露一个更新方法，用于更新页面
  update() {
    let oldValue = this.oldValue;
    let newValue = this.getVMValue(this.vm, this.expr);
    if (oldValue != newValue) {
      this.cb(newValue, oldValue)
    }
  }

  // 用于获取vm中的数据
  getVMValue(vm, expr) {
    let data = vm.$data;
    expr.split('.').forEach(i => {
      data = data[i];
    })
    // console.log(data)
    return data;
  }
}


class Dep {
  constructor() {
    this.subs = []
  }

  // 添加订阅者
  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 通知
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}