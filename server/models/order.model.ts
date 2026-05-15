import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Order extends Model {
  declare id: string;
  declare user_id: string;
  declare order_no: string;
  declare type: 'store' | 'recharge' | 'payment' | 'coupon';
  declare status: number;
  declare total_amount: number;
  declare discount_amount: number;
  declare pay_amount: number;
  declare pay_type: 'wechat' | 'balance' | null;
  declare remark: string | null;
  declare create_time: Date;
  declare pay_time: Date | null;
  declare deleted_at: Date | null;
}

Order.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，订单唯一标识'
    },
    user_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '用户ID，关联t_user.id'
    },
    order_no: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false,
      comment: '订单编号'
    },
    type: {
      type: DataTypes.ENUM('store', 'recharge', 'payment', 'coupon'),
      allowNull: false,
      defaultValue: 'store',
      comment: '订单类型：store-门店订单，recharge-储值订单，payment-买单订单，coupon-券包订单'
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: '订单状态：0-待支付，1-已支付，2-制作中，3-待取餐，4-已完成，5-已取消'
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '订单总金额（元）'
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '优惠金额（元）'
    },
    pay_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '实付金额（元）'
    },
    pay_type: {
      type: DataTypes.ENUM('wechat', 'balance'),
      allowNull: true,
      comment: '支付方式：wechat-微信支付，balance-余额支付'
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '订单备注'
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    },
    pay_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '支付时间'
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '删除时间（软删除）'
    }
  },
  {
    sequelize,
    tableName: 't_order',
    timestamps: true,
    paranoid: true,
    createdAt: 'create_time',
    updatedAt: false,
    deletedAt: 'deleted_at'
  }
);

export default Order;