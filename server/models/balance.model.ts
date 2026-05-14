import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class BalanceRecord extends Model {
  declare id: string;
  declare user_id: string;
  declare type: 'recharge' | 'consume' | 'refund';
  declare amount: number;
  declare balance: number;
  declare remark: string | null;
  declare create_time: Date;
}

BalanceRecord.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，记录唯一标识'
    },
    user_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '用户ID，关联t_user.id'
    },
    type: {
      type: DataTypes.ENUM('recharge', 'consume', 'refund'),
      allowNull: false,
      comment: '变动类型：recharge-充值，consume-消费，refund-退款'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '变动金额（元），正数为增加，负数为减少'
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '变动后余额（元）'
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '备注说明'
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    }
  },
  {
    sequelize,
    tableName: 't_balance_record',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id'],
        name: 'idx_user_id'
      }
    ]
  }
);

export default BalanceRecord;