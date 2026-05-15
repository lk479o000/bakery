import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model';
import Role from '../models/role.model';

const JWT_SECRET = process.env.JWT_SECRET || 'bakery_admin_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export interface LoginResult {
  accessToken: string;
}

export async function login(username: string, password: string): Promise<LoginResult> {
  const admin = await Admin.findOne({ where: { username } });
  
  if (!admin) {
    throw new Error('用户名或密码错误');
  }

  if (admin.status !== 1) {
    throw new Error('账号已被禁用');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  
  if (!isPasswordValid) {
    throw new Error('用户名或密码错误');
  }

  await Admin.update(
    { last_login_time: new Date() },
    { where: { id: admin.id } }
  );

  // 查询该用户的角色
  const roles = await Role.findAll({
    attributes: ['code'],
    include: [{
      model: Admin,
      where: { id: admin.id },
      through: { attributes: [] }
    }]
  });

  const roleCodes = roles.map(r => r.code);

  const token = jwt.sign(
    { adminId: admin.id, username: admin.username, roles: roleCodes },
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRES_IN } as any
  );

  return {
    accessToken: token,
  };
}

export async function verifyToken(token: string): Promise<{ adminId: string; username: string; roles: string[] }> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string; username: string; roles: string[] };
    return decoded;
  } catch {
    throw new Error('Token无效');
  }
}

export async function getAdminInfo(adminId: string) {
  const admin = await Admin.findByPk(adminId, {
    include: [
      {
        model: Role,
        through: { attributes: [] },
        attributes: ['code', 'name'],
      },
    ],
  });
  
  if (!admin) {
    throw new Error('管理员不存在');
  }

  const adminData = admin.toJSON() as any;
  const roles = adminData.Roles || [];

  return {
    userId: admin.id,
    username: admin.username,
    realName: admin.nickname || admin.username,
    avatar: admin.avatar || 'https://unpkg.com/@vbenjs/static@0.0.5/logo.png',
    desc: '后台管理员',
    homePath: '/analytics',
    roles: roles.map((r: any) => r.code),
  };
}

export async function getAccessCodes(adminId: string): Promise<string[]> {
  const admin = await Admin.findByPk(adminId, {
    include: [
      {
        model: Role,
        through: { attributes: [] },
        attributes: ['code'],
      },
    ],
  });
  
  if (!admin) {
    return [];
  }

  const adminData = admin.toJSON() as any;
  const roles = adminData.Roles || [];
  return roles.map((r: any) => r.code);
}
