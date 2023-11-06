import { serverSupabaseServiceRole, serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import authConfirm from '~/server/auth/auth-confirm';
import { appErrorHandler } from '~/server/utils/error-handler';
import { RoutingModel } from '~/shared/routing';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  if (!user) {
    return await authConfirm(event);
  }

  let data, error;
  try {
    const response = await client
      .from('subscriptions')
      .select('podcast_id, podcast_image, podcast_title')
      .eq('user_id', user.id);

    data = response.data;
    error = response.error;
  } catch (error) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while deleting subscription.' }, error);
  }

  if (error) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' }, error);
  }

  return (data || []).map((val) => ({
    id: val.podcast_id,
    title: val.podcast_title,
    image: val.podcast_image,
    link: new RoutingModel().getPodcastLink(val.podcast_id),
  }));
});
