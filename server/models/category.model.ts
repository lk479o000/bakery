import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Category extends Model {
  declare id: string;
  declare name: string;
  declare icon: string | null;
  declare sort: number;
  declare status: number;
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
    }
  },
  {
    sequelize,
    tableName: 't_category',
    timestamps: false
  }
);

export default Category;