import { serverSupabaseServiceRole, serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import authConfirm from '~/server/auth/auth-confirm';
import { appErrorHandler } from '~/server/utils/error-handler';
import { RoutingModel } from '~/shared/routing';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  const eventQuery = getQuery(event);

  if (!user) {
    return await authConfirm(event);
  }

  if (!eventQuery.id) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' });
  }

  let data;
  try {
    const response = await client
      .from('subscriptions')
      .delete()
      .eq('podcast_id', eventQuery.id)
      .eq('user_id', user.id)
      .select('podcast_id, podcast_image, podcast_title');

    data = response.data;
    if (response.error) {
      return appErrorHandler(
        event,
        { statusCode: 424, message: 'An error occurred while loading podcasts.' },
        response.error
      );
    }
  } catch (error) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading subscriptions.' }, error);
  }

  return (data || []).map((val) => ({
    id: val.podcast_id,
    title: val.podcast_title,
    image: val.podcast_image,
    link: new RoutingModel().getPodcastLink(val.podcast_id),
  }));
});
