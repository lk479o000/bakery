import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Admin extends Model {
  declare id: string;
  declare username: string;
  declare password: string;
  declare nickname: string | null;
  declare avatar: string | null;
  declare phone: string | null;
  declare email: string | null;
  declare status: number;
  declare last_login_time: Date | null;
  declare created_at: Date;
  declare updated_at: Date;
  declare deleted_at: Date | null;
}

Admin.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，管理员唯一标识'
    },
    username: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
      comment: '登录用户名'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '密码（BCrypt加密）'
    },
    nickname: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: '管理员昵称'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '管理员头像URL'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '手机号'
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: '邮箱'
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态：0-禁用，1-启用'
    },
    last_login_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间'
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
      comment: '更新时间'
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '删除时间（软删除）'
    }
  },
  {
    sequelize,
    tableName: 't_admin',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

export default Admin;