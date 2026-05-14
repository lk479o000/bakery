import Category from '../models/category.model';

class CategoryService {
  async getCategoryList() {
    const categories = await Category.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC']]
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      sort: category.sort
    }));
  }
}

export default new CategoryService();