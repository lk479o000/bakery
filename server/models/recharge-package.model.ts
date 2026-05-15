import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class RechargePackage extends Model {
  declare id: string;
  declare name: string;
  declare amount: number;
  declare gift_amount: number;
  declare is_recommended: number;
  declare description: string | null;
  declare sort: number;
  declare status: number;
  declare created_at: Date;
  declare deleted_at: Date | null;
}

RechargePackage.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，充值套餐唯一标识'
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: '活动名称'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '充值金额'
    },
    gift_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '赠送金额'
    },
    is_recommended: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: '是否推荐'
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '活动描述'
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
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '删除时间（软删除）'
    }
  },
  {
    sequelize,
    tableName: 't_recharge_package',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: false,
    deletedAt: 'deleted_at'
  }
);

export default RechargePackage;