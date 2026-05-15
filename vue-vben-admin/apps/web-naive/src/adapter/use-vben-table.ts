import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { defineComponent, h } from 'vue';

import { NButton, useDialog } from 'naive-ui';

import { useVbenVxeGrid } from './vxe-table';

export interface BakeryTableColumn {
  field: string;
  title: string;
  width?: number;
  fixed?: 'left' | 'right';
  /** Bakery shorthand: (value) or (value, row) */
  formatter?: (val: any, row?: any) => string;
}

export interface BakeryTableToolbarItem {
  component: string;
  componentProps?: Record<string, any>;
  children?: string;
}

export interface BakeryTableActionButton {
  text: string;
  onClick: (row: any) => void;
  type?: 'danger' | 'default' | 'primary';
  hidden?: (row: any) => boolean;
}

export interface UseVbenTableOptions {
  api: (...args: any[]) => Promise<any>;
  columns: BakeryTableColumn[];
  toolBarSchema?: BakeryTableToolbarItem[];
  actionColumn?: {
    width?: number;
    buttons: BakeryTableActionButton[];
  };
  searchSchema?: any[];
}

function normalizeListResult(raw: any): { items: any[]; total: number } {
  if (Array.isArray(raw)) {
    return { items: raw, total: raw.length };
  }
  if (raw && typeof raw === 'object') {
    const items = raw.list ?? raw.items ?? raw.records ?? [];
    const total = raw.total ?? items.length ?? 0;
    return { items, total };
  }
  return { items: [], total: 0 };
}

function stripHtmlTags(s: string) {
  return s.replace(/<[^>]*>/g, '').trim();
}

function mapColumn(col: BakeryTableColumn): VxeGridPropTypes.Column {
  const base: VxeGridPropTypes.Column = {
    field: col.field,
    title: col.title,
    width: col.width,
    fixed: col.fixed,
  };

  if (['image', 'icon', 'avatar'].includes(col.field)) {
    return {
      ...base,
      cellRender: { name: 'CellImage' },
    };
  }

  if (col.formatter) {
    return {
      ...base,
      formatter: ({ cellValue, row }: { cellValue: any; row: any }) => {
        try {
          const out =
            col.formatter!.length >= 2
              ? col.formatter!(cellValue, row)
              : col.formatter!(cellValue);
          if (typeof out !== 'string') {
            return String(out ?? '');
          }
          return out.includes('<') ? stripHtmlTags(out) : out;
        } catch {
          return '';
        }
      },
    };
  }

  return base;
}

export function useVbenTable(options: UseVbenTableOptions) {
  const dialog = useDialog();

  const dataColumns = options.columns
    .filter((c) => c.field !== 'action')
    .map(mapColumn);

  const actionWidth = options.actionColumn?.width ?? 180;
  const actionButtons = options.actionColumn?.buttons ?? [];

  const columns: VxeGridPropTypes.Column[] = [...dataColumns];
  if (actionButtons.length > 0) {
    columns.push({
      field: 'action',
      title: '操作',
      width: actionWidth,
      fixed: 'right',
      showOverflow: false,
      slots: { default: 'action_default' },
    });
  }

  const hasSearch = (options.searchSchema?.length ?? 0) > 0;

  const [BaseGrid, gridApi] = useVbenVxeGrid({
    showSearchForm: hasSearch,
    formOptions: hasSearch
      ? {
          schema: options.searchSchema,
          submitOnChange: false,
        }
      : undefined,
    gridOptions: {
      columns,
      pagerConfig: {
        enabled: true,
      },
      proxyConfig: {
        ajax: {
          query: async (pageParams: any, ...rest: any[]) => {
            const page = pageParams?.page ?? {
              currentPage: 1,
              pageSize: 20,
            };
            const formOrExtra = rest[0];
            const formValues =
              formOrExtra &&
              typeof formOrExtra === 'object' &&
              !(formOrExtra instanceof PointerEvent)
                ? formOrExtra
                : {};
            const queryParams = {
              page: page.currentPage,
              pageSize: page.pageSize,
              ...formValues,
            };
            const raw = await options.api(queryParams);
            return normalizeListResult(raw);
          },
        },
      },
    },
  });

  const tableAction = {
    refresh: () => gridApi.reload(),
    confirm: (content: string) =>
      new Promise<boolean>((resolve) => {
        let settled = false;
        const finish = (v: boolean) => {
          if (!settled) {
            settled = true;
            resolve(v);
          }
        };
        dialog.warning({
          title: '提示',
          content,
          positiveText: '确定',
          negativeText: '取消',
          maskClosable: false,
          onPositiveClick: () => {
            finish(true);
          },
          onNegativeClick: () => {
            finish(false);
          },
          onClose: () => {
            finish(false);
          },
        });
      }),
  };

  const Grid = defineComponent({
    name: 'VbenBakeryTable',
    setup(_, { attrs }) {
      const toolbarItems = options.toolBarSchema ?? [];
      return () =>
        h(
          BaseGrid,
          {
            ...attrs,
            api: gridApi,
          },
          {
            'toolbar-actions': () =>
              h(
                'div',
                { class: 'flex flex-wrap items-center gap-2' },
                toolbarItems.map((item) => {
                  if (item.component === 'NButton') {
                    const props = { ...(item.componentProps ?? {}) };
                    return h(
                      NButton,
                      {
                        ...props,
                        type: props.type ?? 'default',
                        onClick: props.onClick,
                      },
                      { default: () => item.children ?? '' },
                    );
                  }
                  return null;
                }),
              ),
            ...(actionButtons.length > 0
              ? {
                  action_default: ({ row }: { row: any }) =>
                    h(
                      'div',
                      { class: 'flex flex-wrap items-center justify-center gap-2' },
                      actionButtons
                        .filter((b) => !b.hidden?.(row))
                        .map((b) =>
                          h(
                            NButton,
                            {
                              size: 'small',
                              type:
                                b.type === 'danger'
                                  ? 'error'
                                  : b.type === 'primary'
                                    ? 'primary'
                                    : 'default',
                              quaternary: b.type !== 'danger',
                              onClick: () => b.onClick(row),
                            },
                            { default: () => b.text },
                          ),
                        ),
                    ),
                }
              : {}),
          },
        );
    },
  });

  return [Grid, tableAction] as const;
}
