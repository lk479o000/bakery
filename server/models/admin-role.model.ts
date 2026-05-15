import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class AdminRole extends Model {
  declare admin_id: string;
  declare role_id: string;
}

AdminRole.init(
  {
    admin_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '管理员ID，关联t_admin.id',
    },
    role_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '角色ID，关联t_role.id',
    },
  },
  {
    sequelize,
    tableName: 't_admin_role',
    timestamps: false,
  },
);

export default AdminRole;
