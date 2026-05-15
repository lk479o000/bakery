import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Role extends Model {
  declare id: string;
  declare name: string;
  declare code: string;
  declare description: string | null;
  declare status: number;
  declare created_at: Date;
  declare updated_at: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，角色唯一标识'
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: '角色名称'
    },
    code: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
      comment: '角色编码：super-超级管理员，admin-管理员，user-普通用户'
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '角色描述'
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
    tableName: 't_role',
    timestamps: false
  }
);

export default Role;