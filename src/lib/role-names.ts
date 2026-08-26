export const STAFF_ROLES = [
  'ADMIN',
  'HOD_SPORTS',
  'HEAD_OF_SPORTS',
  'COACH',
] as const;

export const EXEC_ROLES = [
  'ADMIN',
  'HOD_SPORTS',
  'HEAD_OF_SPORTS',
] as const;

export function isStaff(role?: string | null): boolean {
  return !!role && (STAFF_ROLES as readonly string[]).includes(role);
}

export function isExec(role?: string | null): boolean {
  return !!role && (EXEC_ROLES as readonly string[]).includes(role);
}
