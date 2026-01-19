export const NodeEnvMap = {
  development: 'development',
  production: 'production',
  test: 'test',
} as const;

export type NodeEnv = (typeof NodeEnvMap)[keyof typeof NodeEnvMap];
