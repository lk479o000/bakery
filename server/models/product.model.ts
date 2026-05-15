import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Product extends Model {
  declare id: string;
  declare category_id: string;
  declare name: string;
  declare description: string | null;
  declare price: number;
  declare original_price: number | null;
  declare image: string | null;
  declare stock: number;
  declare status: number;
  declare can_pickup: number;
  declare can_delivery: number;
  declare can_express: number;
  declare sort: number;
  declare created_at: Date;
  declare deleted_at: Date | null;
}

Product.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，商品唯一标识'
    },
    category_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '分类ID，关联t_category.id'
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: '商品名称'
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '商品描述'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '售价（元）'
    },
    original_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: '原价（元）'
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '商品主图URL'
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '库存数量'
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态：0-下架，1-上架'
    },
    can_pickup: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '自取可售'
    },
    can_delivery: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '外卖可售'
    },
    can_express: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '快递可售'
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序号，越小越靠前'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '删除时间（软删除）'
    }
  },
  {
    sequelize,
    tableName: 't_product',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: false,
    deletedAt: 'deleted_at'
  }
);

export default Product;