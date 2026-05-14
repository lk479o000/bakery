import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Banner extends Model {
  declare id: string;
  declare image: string;
  declare link: string;
  declare sort: number;
  declare status: number;
}

Banner.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，轮播图唯一标识'
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '轮播图图片URL'
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '跳转链接'
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
    tableName: 't_banner',
    timestamps: false
  }
);

export default Banner;