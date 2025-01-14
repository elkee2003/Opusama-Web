// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const BookingStatus = {
  "PENDING": "PENDING",
  "ACCEPTED": "ACCEPTED",
  "VIEWING": "VIEWING",
  "CHECKED_IN": "CHECKED_IN",
  "VISITING": "VISITING",
  "VIEWED": "VIEWED",
  "CHECKED_OUT": "CHECKED_OUT",
  "VISITED": "VISITED",
  "SOLD": "SOLD",
  "PAID": "PAID",
  "RECEIVED": "RECEIVED",
  "DENIED": "DENIED",
  "REMOVED_CLIENT": "REMOVED_CLIENT",
  "REMOVED_REALTOR": "REMOVED_REALTOR"
};

const { RealtorReview, PostReview, Booking, User, Realtor, Post } = initSchema(schema);

export {
  RealtorReview,
  PostReview,
  Booking,
  User,
  Realtor,
  Post,
  BookingStatus
};