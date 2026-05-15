import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Coupon extends Model {
  declare id: string;
  declare name: string;
  declare type: 'full_reduction' | 'discount';
  declare value: number;
  declare min_amount: number;
  declare start_time: Date;
  declare end_time: Date;
  declare total_count: number;
  declare received_count: number;
  declare status: number;
  declare deleted_at: Date | null;
}

Coupon.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，优惠券唯一标识'
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: '优惠券名称'
    },
    type: {
      type: DataTypes.ENUM('full_reduction', 'discount'),
      allowNull: false,
      comment: '优惠券类型：full_reduction-满减券，discount-折扣券'
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '优惠值：满减券为减免金额，折扣券为折扣率'
    },
    min_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '最低消费金额（元）'
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '开始时间'
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '结束时间'
    },
    total_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '发放总量'
    },
    received_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '已领取数量'
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态：0-禁用，1-启用'
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '删除时间（软删除）'
    }
  },
  {
    sequelize,
    tableName: 't_coupon',
    timestamps: true,
    paranoid: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: 'deleted_at'
  }
);

export default Coupon;