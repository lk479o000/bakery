import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class User extends Model {
  declare id: string;
  declare openid: string;
  declare nickname: string | null;
  declare avatar: string | null;
  declare phone: string | null;
  declare points: number;
  declare balance: number;
  declare member_level: number;
  declare created_at: Date;
  declare updated_at: Date;
}

User.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，用户唯一标识'
    },
    openid: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
      comment: '微信openid'
    },
    nickname: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: '用户昵称'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '用户头像URL'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '手机号'
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '积分余额'
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '账户余额（元）'
    },
    member_level: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '会员等级：1-普通会员'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: 'NOW()',
      comment: '更新时间'
    }
  },
  {
    sequelize,
    tableName: 't_user',
    timestamps: false
  }
);

export default User;