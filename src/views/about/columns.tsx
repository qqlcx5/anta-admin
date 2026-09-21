export function useColumns() {
  const { pkg, lastBuildTime } = __APP_INFO__;
  const { version, engines } = pkg;
  const columns = [
    {
      label: "当前版本",
      minWidth: 100,
      cellRenderer: () => {
        return (
          <el-tag size="large" class="text-base!">
            {version}
          </el-tag>
        );
      }
    },
    {
      label: "最后编译时间",
      minWidth: 120,
      cellRenderer: () => {
        return (
          <el-tag size="large" class="text-base!">
            {lastBuildTime}
          </el-tag>
        );
      }
    },
    {
      label: "推荐 node 版本",
      minWidth: 140,
      cellRenderer: () => {
        return (
          <el-tag size="large" class="text-base!">
            {engines.node}
          </el-tag>
        );
      }
    },
    {
      label: "推荐 pnpm 版本",
      minWidth: 140,
      cellRenderer: () => {
        return (
          <el-tag size="large" class="text-base!">
            {engines.pnpm}
          </el-tag>
        );
      }
    },
    {
      label: "代码仓库地址",
      minWidth: 140,
      className: "anta-version",
      cellRenderer: () => {
        return (
          <a
            href="https://github.com/qqlcx5/anta-admin"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">Anta Admin 仓库</span>
          </a>
        );
      }
    },
    {
      label: "Issue 反馈",
      minWidth: 140,
      className: "anta-version",
      cellRenderer: () => {
        return (
          <a
            href="https://github.com/qqlcx5/anta-admin/issues"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">问题反馈与建议</span>
          </a>
        );
      }
    }
  ];

  return {
    columns
  };
}
