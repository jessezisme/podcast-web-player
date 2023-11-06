import { serverSupabaseServiceRole, serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import authConfirm from '~/server/auth/auth-confirm';
import { appErrorHandler } from '~/server/utils/error-handler';

export default defineEventHandler(async (event) => {
  const serviceRoleUser = await serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event);

  if (!user || user.email?.toLowerCase() === 'podnexus@mailinator.com') {
    return await authConfirm(event);
  }

  let data, error;
  try {
    const response = await serviceRoleUser.auth.admin.deleteUser(user.id);
    data = response.data;
    error = response.error;
  } catch (error) {
    appErrorHandler(event, { statusCode: 424, message: 'An error occurred while deleting account.' }, error);
  }

  if (error) {
    appErrorHandler(event, { statusCode: 424, message: 'An error occurred while deleting account.' }, error);
  }

  return { data };
});
