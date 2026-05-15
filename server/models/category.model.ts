import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Category extends Model {
  declare id: string;
  declare name: string;
  declare icon: string | null;
  declare sort: number;
  declare status: number;
  declare can_pickup: number;
  declare can_delivery: number;
  declare can_express: number;
  declare deleted_at: Date | null;
}

Category.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，分类唯一标识'
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '分类名称'
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '分类图标URL'
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序号，越小越靠前'
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态：0-禁用，1-启用'
    },
    can_pickup: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '自取场景可展示'
    },
    can_delivery: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '外卖场景可展示'
    },
    can_express: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '快递场景可展示'
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '删除时间（软删除）'
    }
  },
  {
    sequelize,
    tableName: 't_category',
    timestamps: true,
    paranoid: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: 'deleted_at'
  }
);

export default Category;