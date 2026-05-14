import { addAddress, updateAddress } from '../../services/address';
import { Address } from '../../types/api';

Page({
  data: {
    // 页面状态
    isEditMode: false,
    addressId: null as string | null,
    loading: false,
    
    // 表单数据
    formData: {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    },
    
    // 表单错误
    formErrors: {} as Record<string, string>
  },

  onLoad(options: { id?: string }) {
    const { id } = options;
    this.setData({
      isEditMode: !!id,
      addressId: id || null
    });

    if (id) {
      this.loadAddressDetail(id);
    }
  },

  async loadAddressDetail(addressId: string) {
    this.setData({ loading: true });
    try {
      // 这里需要实现获取地址详情的API调用
      // 由于services/address.ts中没有提供getAddressDetail方法，这里暂时使用模拟数据
      // 实际项目中应该添加getAddressDetail方法到services/address.ts
      const mockAddress: Address = {
        id: addressId,
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南区高新南一道',
        isDefault: true
      };
      this.setData({
        formData: mockAddress,
        loading: false
      });
    } catch (error) {
      wx.showToast({
        title: '加载地址失败',
        icon: 'none'
      });
      this.setData({ loading: false });
      wx.navigateBack();
    }
  },

  handleInput(e: any) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
    // 实时校验
    this.validateField(field, value);
  },

  handleCheckboxChange(e: any) {
    const { value } = e.detail;
    this.setData({
      'formData.isDefault': value.length > 0
    });
  },

  validateField(field: string, value: any) {
    const errors: Record<string, string> = {};
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = '请输入收货人姓名';
        } else if (value.length > 20) {
          errors.name = '姓名长度不能超过20个字符';
        }
        break;
      case 'phone':
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!value.trim()) {
          errors.phone = '请输入手机号码';
        } else if (!phoneRegex.test(value)) {
          errors.phone = '请输入正确的手机号码';
        }
        break;
      case 'province':
        if (!value) {
          errors.province = '请选择省份';
        }
        break;
      case 'city':
        if (!value) {
          errors.city = '请选择城市';
        }
        break;
      case 'district':
        if (!value) {
          errors.district = '请选择区县';
        }
        break;
      case 'detail':
        if (!value.trim()) {
          errors.detail = '请输入详细地址';
        } else if (value.length > 200) {
          errors.detail = '详细地址长度不能超过200个字符';
        }
        break;
    }
    
    this.setData({
      [`formErrors.${field}`]: errors[field]
    });
  },

  validateForm() {
    const { formData } = this.data;
    const errors: Record<string, string> = {};
    
    // 姓名校验
    if (!formData.name.trim()) {
      errors.name = '请输入收货人姓名';
    } else if (formData.name.length > 20) {
      errors.name = '姓名长度不能超过20个字符';
    }
    
    // 手机号校验
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!formData.phone.trim()) {
      errors.phone = '请输入手机号码';
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = '请输入正确的手机号码';
    }
    
    // 地址校验
    if (!formData.province) {
      errors.province = '请选择省份';
    }
    if (!formData.city) {
      errors.city = '请选择城市';
    }
    if (!formData.district) {
      errors.district = '请选择区县';
    }
    if (!formData.detail.trim()) {
      errors.detail = '请输入详细地址';
    } else if (formData.detail.length > 200) {
      errors.detail = '详细地址长度不能超过200个字符';
    }
    
    this.setData({ formErrors: errors });
    return Object.keys(errors).length === 0;
  },

  async handleSave() {
    if (!this.validateForm()) {
      return;
    }
    
    this.setData({ loading: true });
    const { isEditMode, addressId, formData } = this.data;
    
    try {
      if (isEditMode && addressId) {
        // 编辑模式
        await updateAddress(addressId, formData);
      } else {
        // 新增模式
        await addAddress(formData);
      }
      
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  }
});