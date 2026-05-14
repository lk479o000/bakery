import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Cart extends Model {
  declare id: string;
  declare user_id: string;
  declare product_id: string;
  declare quantity: number;
  declare selected: number;
  declare created_at: Date;
}

Cart.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，购物车项唯一标识'
    },
    user_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '用户ID，关联t_user.id'
    },
    product_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '商品ID，关联t_product.id'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '商品数量'
    },
    selected: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '是否选中：0-否，1-是'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    }
  },
  {
    sequelize,
    tableName: 't_cart',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id'],
        name: 'uk_user_product'
      },
      {
        fields: ['user_id'],
        name: 'idx_user_id'
      }
    ]
  }
);

export default Cart;