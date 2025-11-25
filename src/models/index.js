// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const VendorTransactionType = {
  "CREDIT": "CREDIT",
  "PAYOUT": "PAYOUT"
};

const TransactionStatus = {
  "PENDING": "PENDING",
  "COMPLETED": "COMPLETED",
  "FAILED": "FAILED"
};

const UploadStatus = {
  "UPLOADING": "UPLOADING",
  "COMPLETED": "COMPLETED",
  "COMPLETED_EDITED": "COMPLETED_EDITED",
  "FAILED": "FAILED"
};

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

const PickUpStatus = {
  "PENDING": "PENDING",
  "PREPARING": "PREPARING",
  "READY": "READY",
  "PICKED_UP": "PICKED_UP"
};

const BookingPostOptionType = {
  "RESERVATION": "RESERVATION",
  "VOUCHER": "VOUCHER",
  "PICKUP": "PICKUP"
};

const { VendorBalance, VendorTransaction, Notification, CommunityLike, CommunityReply, CommunityDiscussion, PostComment, PostLike, RealtorReview, PostReview, Booking, User, VendorScanner, Realtor, BookingPostOptions, Post } = initSchema(schema);

export {
  VendorBalance,
  VendorTransaction,
  Notification,
  CommunityLike,
  CommunityReply,
  CommunityDiscussion,
  PostComment,
  PostLike,
  RealtorReview,
  PostReview,
  Booking,
  User,
  VendorScanner,
  Realtor,
  BookingPostOptions,
  Post,
  VendorTransactionType,
  TransactionStatus,
  UploadStatus,
  BookingStatus,
  PickUpStatus,
  BookingPostOptionType
};