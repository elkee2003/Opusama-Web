// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const BookingStatus = {
  "PENDING": "PENDING",
  "ACCEPTED": "ACCEPTED",
  "VIEWING": "VIEWING",
  "VIEWED": "VIEWED",
  "SOLD": "SOLD",
  "PAID": "PAID",
  "RECEIVED": "RECEIVED",
  "DENIED": "DENIED"
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