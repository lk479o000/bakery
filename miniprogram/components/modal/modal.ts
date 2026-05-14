Component({
  options: {
    multipleSlots: true
  },

  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    confirmText: {
      type: String,
      value: '确定'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    showCancel: {
      type: Boolean,
      value: true
    },
    showClose: {
      type: Boolean,
      value: true
    },
    showButtons: {
      type: Boolean,
      value: true
    },
    customClass: {
      type: String,
      value: ''
    }
  },

  methods: {
    onConfirm() {
      this.triggerEvent('confirm');
    },
    onCancel() {
      this.triggerEvent('cancel');
    },
    onMaskTap() {
      this.triggerEvent('cancel');
    },
    preventTouchMove() {
      // 阻止事件冒泡
    }
  }
});
