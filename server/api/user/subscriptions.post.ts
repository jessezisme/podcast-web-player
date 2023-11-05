import type { Database } from '~/shared/types/database';
import type * as PodcastTypes from '~/shared/podcast/api/types/podcast-get';
import { serverSupabaseServiceRole, serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import authConfirm from '~/server/auth/auth-confirm';
import { appErrorHandler } from '~/server/utils/error-handler';

export default defineEventHandler(async (event) => {
  const superUser = serverSupabaseServiceRole<Database>(event);
  const client = await serverSupabaseClient<Database>(event);
  const user = await serverSupabaseUser(event);
  const eventQuery = getQuery(event);

  if (!user) {
    return await authConfirm(event);
  }

  if (!eventQuery.id) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' });
  }

  let podcastDetails;
  try {
    podcastDetails = await $fetch<PodcastTypes.ServerResponse>('/api/podcast/podcast-single', {
      query: { id: eventQuery.id },
    });

    if (!podcastDetails) {
      return appErrorHandler(
        event,
        { statusCode: 424, message: 'An error occurred while loading podcasts.' },
        { message: 'Empty podcast details in call to /api/podcast/podcast-single' }
      );
    }
  } catch (error) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' }, error);
  }

  let data, error;
  try {
    const selectResponse = await client
      .from('subscriptions')
      .select()
      .eq('podcast_id', eventQuery.id)
      .eq('user_id', user.id);

    if (selectResponse.data?.length) {
      return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' });
    }

    const insertResponse = await client
      .from('subscriptions')
      .insert({
        user_id: user.id,
        podcast_id: podcastDetails.id,
        podcast_image: podcastDetails.image || '',
        podcast_title: podcastDetails.title || '',
      })
      .select();

    data = insertResponse.data;
    error = insertResponse.error;
  } catch (error) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' });
  }

  if (error || !data) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' });
  }

  return (data || []).map((val) => ({ id: val.podcast_id, title: val.podcast_title, image: val.podcast_image }));
});
