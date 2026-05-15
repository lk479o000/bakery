import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Address extends Model {
  declare id: string;
  declare user_id: string;
  declare name: string;
  declare phone: string;
  declare province: string;
  declare city: string;
  declare district: string;
  declare detail: string;
  declare is_default: number;
  declare created_at: Date;
  declare deleted_at: Date | null;
}

Address.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      comment: '主键，地址唯一标识'
    },
    user_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '用户ID，关联t_user.id'
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '收货人姓名'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '收货人手机号'
    },
    province: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '省'
    },
    city: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '市'
    },
    district: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '区/县'
    },
    detail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '详细地址'
    },
    is_default: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: '是否默认地址：0-否，1-是'
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
    tableName: 't_address',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: false,
    deletedAt: 'deleted_at',
    indexes: [
      {
        fields: ['user_id'],
        name: 'idx_user_id'
      }
    ]
  }
);

export default Address;