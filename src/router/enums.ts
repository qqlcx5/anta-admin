// 基础版路由 rank 枚举，方便维护

const home = 0, // 平台规定只有 home 路由的 rank 才能为 0 ，所以后端在返回 rank 的时候需要从非 0 开始
  error = 1,
  permission = 2;

export { home, error, permission };
