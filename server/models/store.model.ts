import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Store extends Model {
  declare id: string;
  declare name: string;
  declare address: string;
  declare phone: string | null;
  declare business_hours: string | null;
  declare latitude: number;
  declare longitude: number;
  declare is_open: number;
  declare can_delivery: number;
  declare can_pickup: number;
  declare can_express: number;
  declare sort: number;
  declare status: number;
  declare created_at: Date;
}

Store.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，门店唯一标识'
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: '门店名称'
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '门店地址'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '联系电话'
    },
    business_hours: {
      type: DataTypes.STRING(32),
      allowNull: true,
      comment: '营业时间'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      comment: '纬度'
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      comment: '经度'
    },
    is_open: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '营业状态：0-休息中，1-营业中'
    },
    can_delivery: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: '可外送'
    },
    can_pickup: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '可自取'
    },
    can_express: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: '可快递'
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序'
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态：0-禁用，1-启用'
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
    tableName: 't_store',
    timestamps: false
  }
);

export default Store;