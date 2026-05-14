import Address from '../models/address.model';

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

class AddressService {
  /**
   * 获取用户地址列表
   * @param userId 用户ID
   * @returns 地址列表
   */
  async getAddressList(userId: string) {
    const addresses = await Address.findAll({ where: { user_id: userId } });

    return addresses.map(address => ({
      id: address.id,
      user_id: address.user_id,
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      is_default: address.is_default,
      created_at: address.created_at
    }));
  }

  /**
   * 获取默认地址
   * @param userId 用户ID
   * @returns 默认地址
   */
  async getDefaultAddress(userId: string) {
    const address = await Address.findOne({ where: { user_id: userId, is_default: 1 } });

    if (!address) {
      return null;
    }

    return {
      id: address.id,
      user_id: address.user_id,
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      is_default: address.is_default,
      created_at: address.created_at
    };
  }

  /**
   * 获取地址详情
   * @param userId 用户ID
   * @param addressId 地址ID
   * @returns 地址详情
   */
  async getAddressDetail(userId: string, addressId: string) {
    const address = await Address.findOne({ where: { id: addressId, user_id: userId } });
    if (!address) {
      throw new Error('地址不存在');
    }

    return {
      id: address.id,
      user_id: address.user_id,
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      is_default: address.is_default,
      created_at: address.created_at
    };
  }

  /**
   * 创建地址
   * @param userId 用户ID
   * @param addressData 地址数据
   * @returns 创建的地址
   */
  async createAddress(userId: string, addressData: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    is_default: number;
  }) {
    // 开始事务
    const transaction = await Address.sequelize!.transaction();

    try {
      // 如果设置为默认地址，先将其他地址设为非默认
      if (addressData.is_default === 1) {
        await Address.update({ is_default: 0 }, { where: { user_id: userId }, transaction });
      }

      // 创建地址
      const address = await Address.create(
        {
          id: generateId(),
          user_id: userId,
          name: addressData.name,
          phone: addressData.phone,
          province: addressData.province,
          city: addressData.city,
          district: addressData.district,
          detail: addressData.detail,
          is_default: addressData.is_default
        },
        { transaction }
      );

      // 提交事务
      await transaction.commit();

      return {
        id: address.id,
        user_id: address.user_id,
        name: address.name,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        detail: address.detail,
        is_default: address.is_default,
        created_at: address.created_at
      };
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 更新地址
   * @param userId 用户ID
   * @param addressId 地址ID
   * @param addressData 地址数据
   * @returns 更新后的地址
   */
  async updateAddress(userId: string, addressId: string, addressData: {
    name?: string;
    phone?: string;
    province?: string;
    city?: string;
    district?: string;
    detail?: string;
    is_default?: number;
  }) {
    // 开始事务
    const transaction = await Address.sequelize!.transaction();

    try {
      // 查找地址
      const address = await Address.findOne({ where: { id: addressId, user_id: userId }, transaction });
      if (!address) {
        throw new Error('地址不存在');
      }

      // 如果设置为默认地址，先将其他地址设为非默认
      if (addressData.is_default === 1) {
        await Address.update({ is_default: 0 }, { where: { user_id: userId }, transaction });
      }

      // 更新地址
      await address.update(addressData, { transaction });

      // 提交事务
      await transaction.commit();

      return {
        id: address.id,
        user_id: address.user_id,
        name: address.name,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        detail: address.detail,
        is_default: address.is_default,
        created_at: address.created_at
      };
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 删除地址
   * @param userId 用户ID
   * @param addressId 地址ID
   * @returns 删除结果
   */
  async deleteAddress(userId: string, addressId: string) {
    const address = await Address.findOne({ where: { id: addressId, user_id: userId } });
    if (!address) {
      throw new Error('地址不存在');
    }

    await address.destroy();

    return { success: true };
  }

  /**
   * 设置默认地址
   * @param userId 用户ID
   * @param addressId 地址ID
   * @returns 设置结果
   */
  async setDefaultAddress(userId: string, addressId: string) {
    // 开始事务
    const transaction = await Address.sequelize!.transaction();

    try {
      // 查找地址
      const address = await Address.findOne({ where: { id: addressId, user_id: userId }, transaction });
      if (!address) {
        throw new Error('地址不存在');
      }

      // 将其他地址设为非默认
      await Address.update({ is_default: 0 }, { where: { user_id: userId }, transaction });

      // 设置当前地址为默认
      await address.update({ is_default: 1 }, { transaction });

      // 提交事务
      await transaction.commit();

      return {
        id: address.id,
        is_default: 1
      };
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
  }
}

export default new AddressService();