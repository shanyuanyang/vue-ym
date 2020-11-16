// 定义一个类，创建vue实例
class Vue {
  constructor(options = {}) {
    this.$el = options.el;
    this.$data = options.data;
    this.$methods = options.methods;

    // 监视data中数据的变化

    new observer(this.$data);

    // 如果指定了el参数，对el进行解析
    if (this.$el) {
      // compile负责解析模板的内容
      // 需要模板和数据
      new Compile(this.$el, this);
    }
  }

}