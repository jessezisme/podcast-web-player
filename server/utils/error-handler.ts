import type { H3Event, EventHandlerRequest } from 'h3';

export const appErrorHandler = async (
  event: H3Event<EventHandlerRequest>,
  options: { message: string; statusCode: number },
  err?: any
) => {
  setResponseStatus(event, options?.statusCode || 424);
  return {
    statusCode: options?.statusCode || 424,
    message: options?.message || 'An error occurred while loading podcasts.',
    data: err,
  };
};
