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
  "DELAYED_PAYMENT": "DELAYED_PAYMENT",
  "RECEIVED": "RECEIVED",
  "DENIED": "DENIED",
  "OCCUPIED": "OCCUPIED",
  "REMOVED_CLIENT": "REMOVED_CLIENT",
  "REMOVED_REALTOR": "REMOVED_REALTOR",
  "REMOVED_REALTOR_PAYMENT_DELAYED": "REMOVED_REALTOR_PAYMENT_DELAYED"
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