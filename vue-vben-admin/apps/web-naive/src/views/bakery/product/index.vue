<script lang="ts" setup>
import { ref, computed } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenTable } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';

import { NButton, NCard, useMessage } from 'naive-ui';

import { getProductListApi, createProductApi, updateProductApi, deleteProductApi, type ProductApi } from '#/api/bakery/product';
import { getCategoryListApi, type CategoryApi } from '#/api/bakery/category';

const message = useMessage();
const categories = ref<CategoryApi.Category[]>([]);

const categoryOptions = computed(() => {
  return categories.value.map(cat => ({ label: cat.name, value: cat.id }));
});

const [table, tableAction] = useVbenTable({
  api: getProductListApi,
  columns: [
    { field: 'name', title: '商品名称', width: 150 },
    { field: 'categoryName', title: '所属分类', width: 120 },
    { field: 'price', title: '售价', width: 100, formatter: (val: number) => `¥${val.toFixed(2)}` },
    { field: 'originalPrice', title: '原价', width: 100, formatter: (val: number) => `¥${val.toFixed(2)}` },
    { field: 'stock', title: '库存', width: 80 },
    { field: 'status', title: '状态', width: 80, formatter: (val: number) => val === 1 ? '上架' : '下架' },
    { field: 'sort', title: '排序', width: 80 },
    { field: 'createdAt', title: '创建时间', width: 150 },
    { field: 'action', title: '操作', width: 180, fixed: 'right' },
  ],
  searchSchema: [
    { component: 'Input', fieldName: 'name', label: '商品名称' },
    { component: 'Select', fieldName: 'categoryId', label: '分类', componentProps: { options: categoryOptions } },
  ],
  toolBarSchema: [
    { component: 'NButton', componentProps: { type: 'primary', onClick: () => modalApi.open() }, children: '新增商品' },
  ],
  actionColumn: {
    width: 180,
    buttons: [
      { text: '编辑', onClick: (row) => modalApi.open({ data: row }) },
      { text: '删除', onClick: handleDelete, type: 'danger' },
    ],
  },
});

async function handleDelete(row: ProductApi.Product) {
  if (await tableAction.confirm(`确定删除商品「${row.name}」吗？`)) {
    await deleteProductApi(row.id);
    message.success('删除成功');
    tableAction.refresh();
  }
}

const [Modal, modalApi] = useVbenModal({
  title: '商品管理',
  bodyStyle: { maxHeight: 'calc(100vh - 200px)', overflow: 'auto' },
});

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  handleSubmit: async (values) => {
    const data = values as ProductApi.CreateProductParams;
    if (modalApi.getCurrentData()?.id) {
      await updateProductApi({ ...data, id: modalApi.getCurrentData().id });
      message.success('更新成功');
    } else {
      await createProductApi(data);
      message.success('创建成功');
    }
    modalApi.close();
    tableAction.refresh();
  },
  schema: [
    { component: 'Select', fieldName: 'categoryId', label: '所属分类', rules: 'required', componentProps: { options: categoryOptions } },
    { component: 'Input', fieldName: 'name', label: '商品名称', rules: 'required' },
    { component: 'Input', fieldName: 'description', label: '商品描述', componentProps: { type: 'textarea' } },
    { component: 'InputNumber', fieldName: 'price', label: '售价', rules: 'required', componentProps: { min: 0, step: 0.01 } },
    { component: 'InputNumber', fieldName: 'originalPrice', label: '原价', componentProps: { min: 0, step: 0.01 } },
    { component: 'Input', fieldName: 'image', label: '商品图片URL' },
    { component: 'InputNumber', fieldName: 'stock', label: '库存', componentProps: { min: 0 } },
    { component: 'RadioGroup', fieldName: 'status', label: '状态', rules: 'selectRequired', componentProps: { options: [{ value: 1, label: '上架' }, { value: 0, label: '下架' }] } },
    { component: 'InputNumber', fieldName: 'sort', label: '排序', componentProps: { min: 0 } },
  ],
});

modalApi?.onOpen?.((data) => {
  if (data?.id) {
    formApi.setValues(data);
  } else {
    formApi.reset();
  }
});

async function loadCategories() {
  categories.value = await getCategoryListApi();
}

loadCategories();
</script>

<template>
  <Page title="商品管理" description="管理商品信息">
    <NCard>
      <table />
    </NCard>
    <Modal>
      <Form />
    </Modal>
  </Page>
</template>