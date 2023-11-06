import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    setResponseStatus(event, 401);
    return event.node.res.end({
      statusCode: 401,
      message: 'Please login to continue.',
    });
  }
});
