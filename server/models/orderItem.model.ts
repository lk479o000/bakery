import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class OrderItem extends Model {
  declare id: string;
  declare order_id: string;
  declare product_id: string;
  declare product_name: string;
  declare product_image: string | null;
  declare price: number;
  declare quantity: number;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，订单商品唯一标识'
    },
    order_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '订单ID，关联t_order.id'
    },
    product_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '商品ID，关联t_product.id'
    },
    product_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: '商品名称（快照）'
    },
    product_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '商品图片（快照）'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '商品单价（元）'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品数量'
    }
  },
  {
    sequelize,
    tableName: 't_order_item',
    timestamps: false
  }
);

export default OrderItem;