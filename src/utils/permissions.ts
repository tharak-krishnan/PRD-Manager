import { UserRole, Feature } from '../context/AuthContext';

export const canCreateCategory = (role: UserRole): boolean => {
  return ['admin', 'product_manager'].includes(role);
};

export const canDeleteCategory = (role: UserRole): boolean => {
  return role === 'admin';
};

export const canCreateFeature = (role: UserRole): boolean => {
  return ['admin', 'product_manager'].includes(role);
};

export const canDeleteFeature = (role: UserRole): boolean => {
  return role === 'admin';
};

export const canEditFeatureField = (
  role: UserRole,
  fieldName: string,
  feature: Feature,
  userId: number
): boolean => {
  const engineeringFields = ['engineeringComment', 'engineeringSignoff', 'engineeringComplexity'];
  const isEngineeringField = engineeringFields.includes(fieldName);

  if (role === 'admin') return true;

  if (role === 'product_manager') {
    return !isEngineeringField; // Can edit all EXCEPT engineering fields
  }

  if (role === 'engineer') {
    return isEngineeringField && feature.assignedEngineerId === userId;
  }

  return false; // Viewer cannot edit anything
};

export const canAssignEngineer = (role: UserRole): boolean => {
  return ['admin', 'product_manager'].includes(role);
};

export const shouldDisableField = (
  role: UserRole,
  fieldName: string,
  feature: Feature,
  userId: number
): boolean => {
  return !canEditFeatureField(role, fieldName, feature, userId);
};

export const canUpdateCategory = (role: UserRole): boolean => {
  return ['admin', 'product_manager'].includes(role);
};

export const canManageUsers = (role: UserRole): boolean => {
  return role === 'admin';
};
