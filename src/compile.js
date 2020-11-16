class Compile {
  constructor(el, vm) {
    // el new vue 传递的选择器
    this.el = typeof el === "string" ? document.querySelector(el) : el;
    //vm new的vue的实例
    this.vm = vm;

    // 编译模板
    if (this.el) {
      // 1 把el中所有的子节点都放入到内存中，fragment
      let fragment = this.node2fragment(this.el);
      // 2 在内存中编译fragment
      this.compile(fragment);
      // 3 把fragment一次性加到页面
      this.el.appendChild(fragment);
    }
  }



  // 核心方法
  node2fragment(node) {
    let fragment = document.createDocumentFragment();
    let childNodes = node.childNodes;
    this.toArray(childNodes).forEach(node => {
      fragment.appendChild(node);
    })
    return fragment;
  }

  compile(fragment) {
    let childNodes = fragment.childNodes;
    this.toArray(childNodes).forEach(node => {
      // 编译子节点
      // 如果是元素，需要解析指令
      if (this.isElementNode(node)) {
        this.compileElement(node);
      }
      // 如果是文本节点，需要解析插值表达式
      if (this.isTextNode(node)) {
        this.compileText(node);
      }
      // 如果当前节点还有子节点 需要递归
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    })
  }

  // 解析html标签
  compileElement(node) {
    // console.log(node.attributes);
    // 1获取当前节点下所有的属性
    let attributes = node.attributes;
    this.toArray(attributes).forEach(attr => {
      // 2 解析vue指令 v- 开头的属性
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        let type = attrName.slice(2);
        let expr = attr.value;

        if (this.isEventDirective(type)) {
          CompileUtil['eventHandler'](node, this.vm, type, expr)
        } else {
          CompileUtil[type] && CompileUtil[type](node, this.vm, expr);
        }
      }
    })
  }
  // 解析文本节点
  compileText(node) {
    CompileUtil.mustache(node, this.vm)

  }
  // 工具方法 
  // 类数组转数组
  toArray(likeArray) {
    return [].slice.call(likeArray)
  }
  // 元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
  //文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 以v-开头
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 事件
  isEventDirective(type) {
    return type.split(":")[0] === 'on'
  }
}

// 
let CompileUtil = {
  text(node, vm, expr) {
    node.textContent = this.getVMValue(vm, expr);
    debugger
    new watcher(vm, expr, (newValue, oldValue) => {
      console.log("进入watcher")
      node.textContent = newValue;
    })
  },
  html(node, vm, expr) {
    node.innerHTML = this.getVMValue(vm, expr);
    new watcher(vm, expr, (newValue, oldValue) => {
      console.log("进入watcher")

      node.innerHTML = newValue;
    })
  },
  model(node, vm, expr) {
    node.value = this.getVMValue(vm, expr);
    new watcher(vm, expr, (newValue, oldValue) => {
      console.log("进入watcher")

      node.value = newValue;
    })
  },
  // 函数
  eventHandler(node, vm, type, expr) {
    let eventType = type.split(':')[1];
    let fn = vm.$methods && vm.$methods[expr];
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm))
    }
  },
  // 用于获取vm中的数据
  getVMValue(vm, expr) {
    let data = vm.$data;
    expr.split('.').forEach(i => {
      data = data[i];
    })
    // console.log(data)
    return data;
  },
  // 文本节点
  mustache(node, vm) {
    let txt = node.textContent;
    let reg = /\{\{(.+)\}\}/;
    if (reg.test(txt)) {
      let expr = RegExp.$1;
      // console.log(expr)
      node.textContent = txt.replace(reg, this.getVMValue(vm, expr))
    }
  }
}

