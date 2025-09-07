import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";

export enum BookingStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  VIEWING = "VIEWING",
  CHECKED_IN = "CHECKED_IN",
  VISITING = "VISITING",
  VIEWED = "VIEWED",
  CHECKED_OUT = "CHECKED_OUT",
  VISITED = "VISITED",
  SOLD = "SOLD",
  PAID = "PAID",
  DELAYED_PAYMENT = "DELAYED_PAYMENT",
  RECEIVED = "RECEIVED",
  DENIED = "DENIED",
  OCCUPIED = "OCCUPIED",
  REMOVED_CLIENT = "REMOVED_CLIENT",
  REMOVED_REALTOR = "REMOVED_REALTOR",
  REMOVED_REALTOR_PAYMENT_DELAYED = "REMOVED_REALTOR_PAYMENT_DELAYED"
}



type EagerNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly creatorID?: string | null;
  readonly recipientID?: string | null;
  readonly recipientType?: string | null;
  readonly type?: string | null;
  readonly entityID?: string | null;
  readonly message?: string | null;
  readonly read?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly creatorID?: string | null;
  readonly recipientID?: string | null;
  readonly recipientType?: string | null;
  readonly type?: string | null;
  readonly entityID?: string | null;
  readonly message?: string | null;
  readonly read?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Notification = LazyLoading extends LazyLoadingDisabled ? EagerNotification : LazyNotification

export declare const Notification: (new (init: ModelInit<Notification>) => Notification) & {
  copyOf(source: Notification, mutator: (draft: MutableModel<Notification>) => MutableModel<Notification> | void): Notification;
}

type EagerCommunityLike = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CommunityLike, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly like?: boolean | null;
  readonly likedByID?: string | null;
  readonly communitydiscussionID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCommunityLike = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CommunityLike, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly like?: boolean | null;
  readonly likedByID?: string | null;
  readonly communitydiscussionID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CommunityLike = LazyLoading extends LazyLoadingDisabled ? EagerCommunityLike : LazyCommunityLike

export declare const CommunityLike: (new (init: ModelInit<CommunityLike>) => CommunityLike) & {
  copyOf(source: CommunityLike, mutator: (draft: MutableModel<CommunityLike>) => MutableModel<CommunityLike> | void): CommunityLike;
}

type EagerCommunityReply = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CommunityReply, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly comment?: string | null;
  readonly media?: (string | null)[] | null;
  readonly commenterID?: string | null;
  readonly communitydiscussionID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCommunityReply = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CommunityReply, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly comment?: string | null;
  readonly media?: (string | null)[] | null;
  readonly commenterID?: string | null;
  readonly communitydiscussionID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CommunityReply = LazyLoading extends LazyLoadingDisabled ? EagerCommunityReply : LazyCommunityReply

export declare const CommunityReply: (new (init: ModelInit<CommunityReply>) => CommunityReply) & {
  copyOf(source: CommunityReply, mutator: (draft: MutableModel<CommunityReply>) => MutableModel<CommunityReply> | void): CommunityReply;
}

type EagerCommunityDiscussion = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CommunityDiscussion, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly category?: string | null;
  readonly title?: string | null;
  readonly content?: string | null;
  readonly instigatorID?: string | null;
  readonly media?: (string | null)[] | null;
  readonly CommunityReplies?: (CommunityReply | null)[] | null;
  readonly CommunityLikes?: (CommunityLike | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCommunityDiscussion = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CommunityDiscussion, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly category?: string | null;
  readonly title?: string | null;
  readonly content?: string | null;
  readonly instigatorID?: string | null;
  readonly media?: (string | null)[] | null;
  readonly CommunityReplies: AsyncCollection<CommunityReply>;
  readonly CommunityLikes: AsyncCollection<CommunityLike>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CommunityDiscussion = LazyLoading extends LazyLoadingDisabled ? EagerCommunityDiscussion : LazyCommunityDiscussion

export declare const CommunityDiscussion: (new (init: ModelInit<CommunityDiscussion>) => CommunityDiscussion) & {
  copyOf(source: CommunityDiscussion, mutator: (draft: MutableModel<CommunityDiscussion>) => MutableModel<CommunityDiscussion> | void): CommunityDiscussion;
}

type EagerPostComment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PostComment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly comment?: string | null;
  readonly commenterID?: string | null;
  readonly realtorID?: string | null;
  readonly postID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPostComment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PostComment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly comment?: string | null;
  readonly commenterID?: string | null;
  readonly realtorID?: string | null;
  readonly postID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PostComment = LazyLoading extends LazyLoadingDisabled ? EagerPostComment : LazyPostComment

export declare const PostComment: (new (init: ModelInit<PostComment>) => PostComment) & {
  copyOf(source: PostComment, mutator: (draft: MutableModel<PostComment>) => MutableModel<PostComment> | void): PostComment;
}

type EagerPostLike = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PostLike, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly like?: boolean | null;
  readonly likedByID?: string | null;
  readonly postID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPostLike = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PostLike, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly like?: boolean | null;
  readonly likedByID?: string | null;
  readonly postID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PostLike = LazyLoading extends LazyLoadingDisabled ? EagerPostLike : LazyPostLike

export declare const PostLike: (new (init: ModelInit<PostLike>) => PostLike) & {
  copyOf(source: PostLike, mutator: (draft: MutableModel<PostLike>) => MutableModel<PostLike> | void): PostLike;
}

type EagerRealtorReview = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RealtorReview, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly rating?: number | null;
  readonly review?: string | null;
  readonly realtorID: string;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRealtorReview = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RealtorReview, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly rating?: number | null;
  readonly review?: string | null;
  readonly realtorID: string;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type RealtorReview = LazyLoading extends LazyLoadingDisabled ? EagerRealtorReview : LazyRealtorReview

export declare const RealtorReview: (new (init: ModelInit<RealtorReview>) => RealtorReview) & {
  copyOf(source: RealtorReview, mutator: (draft: MutableModel<RealtorReview>) => MutableModel<RealtorReview> | void): RealtorReview;
}

type EagerPostReview = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PostReview, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly rating?: number | null;
  readonly review?: string | null;
  readonly realtorID?: string | null;
  readonly postID: string;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPostReview = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PostReview, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly rating?: number | null;
  readonly review?: string | null;
  readonly realtorID?: string | null;
  readonly postID: string;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PostReview = LazyLoading extends LazyLoadingDisabled ? EagerPostReview : LazyPostReview

export declare const PostReview: (new (init: ModelInit<PostReview>) => PostReview) & {
  copyOf(source: PostReview, mutator: (draft: MutableModel<PostReview>) => MutableModel<PostReview> | void): PostReview;
}

type EagerBooking = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Booking, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly adults?: number | null;
  readonly kids?: number | null;
  readonly infants?: number | null;
  readonly numberOfPeople?: number | null;
  readonly clientFirstName?: string | null;
  readonly clientLastName?: string | null;
  readonly clientPhoneNumber?: string | null;
  readonly purpose?: string | null;
  readonly duration?: string | null;
  readonly checkInDate?: string | null;
  readonly checkOutDate?: string | null;
  readonly bookedSessionDuration?: string | null;
  readonly subscription?: boolean | null;
  readonly propertyType?: string | null;
  readonly accommodationType?: string | null;
  readonly nameOfType?: string | null;
  readonly totalPrice?: number | null;
  readonly realtorPrice?: number | null;
  readonly bookingLat?: number | null;
  readonly bookingLng?: number | null;
  readonly status?: BookingStatus | keyof typeof BookingStatus | null;
  readonly userID: string;
  readonly transactionReference?: string | null;
  readonly transactionStatus?: string | null;
  readonly realtorID: string;
  readonly PostID?: string | null;
  readonly ticketID?: string | null;
  readonly qrCodeUrl?: string | null;
  readonly ticketStatus?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBooking = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Booking, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly adults?: number | null;
  readonly kids?: number | null;
  readonly infants?: number | null;
  readonly numberOfPeople?: number | null;
  readonly clientFirstName?: string | null;
  readonly clientLastName?: string | null;
  readonly clientPhoneNumber?: string | null;
  readonly purpose?: string | null;
  readonly duration?: string | null;
  readonly checkInDate?: string | null;
  readonly checkOutDate?: string | null;
  readonly bookedSessionDuration?: string | null;
  readonly subscription?: boolean | null;
  readonly propertyType?: string | null;
  readonly accommodationType?: string | null;
  readonly nameOfType?: string | null;
  readonly totalPrice?: number | null;
  readonly realtorPrice?: number | null;
  readonly bookingLat?: number | null;
  readonly bookingLng?: number | null;
  readonly status?: BookingStatus | keyof typeof BookingStatus | null;
  readonly userID: string;
  readonly transactionReference?: string | null;
  readonly transactionStatus?: string | null;
  readonly realtorID: string;
  readonly PostID?: string | null;
  readonly ticketID?: string | null;
  readonly qrCodeUrl?: string | null;
  readonly ticketStatus?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Booking = LazyLoading extends LazyLoadingDisabled ? EagerBooking : LazyBooking

export declare const Booking: (new (init: ModelInit<Booking>) => Booking) & {
  copyOf(source: Booking, mutator: (draft: MutableModel<Booking>) => MutableModel<Booking> | void): Booking;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly firstName: string;
  readonly lastName?: string | null;
  readonly username?: string | null;
  readonly profilePic?: string | null;
  readonly phoneNumber?: string | null;
  readonly PostReviews?: (PostReview | null)[] | null;
  readonly RealtorReviews?: (RealtorReview | null)[] | null;
  readonly address?: string | null;
  readonly Bookings?: (Booking | null)[] | null;
  readonly cardNumber?: string | null;
  readonly cardExpiry?: string | null;
  readonly cardCvv?: string | null;
  readonly push_token?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly firstName: string;
  readonly lastName?: string | null;
  readonly username?: string | null;
  readonly profilePic?: string | null;
  readonly phoneNumber?: string | null;
  readonly PostReviews: AsyncCollection<PostReview>;
  readonly RealtorReviews: AsyncCollection<RealtorReview>;
  readonly address?: string | null;
  readonly Bookings: AsyncCollection<Booking>;
  readonly cardNumber?: string | null;
  readonly cardExpiry?: string | null;
  readonly cardCvv?: string | null;
  readonly push_token?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerRealtor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Realtor, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly username?: string | null;
  readonly myDescription?: string | null;
  readonly profilePic?: string | null;
  readonly email?: string | null;
  readonly address?: string | null;
  readonly phoneNumber?: string | null;
  readonly bankName?: string | null;
  readonly Post?: (Post | null)[] | null;
  readonly bankCode?: string | null;
  readonly Bookings?: (Booking | null)[] | null;
  readonly RealtorReview?: (RealtorReview | null)[] | null;
  readonly accountName?: string | null;
  readonly accountNumber?: string | null;
  readonly directPayment?: boolean | null;
  readonly push_token?: string | null;
  readonly isVerified?: boolean | null;
  readonly isPartner?: boolean | null;
  readonly isPremium?: boolean | null;
  readonly isElite?: boolean | null;
  readonly isTrusted?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRealtor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Realtor, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly username?: string | null;
  readonly myDescription?: string | null;
  readonly profilePic?: string | null;
  readonly email?: string | null;
  readonly address?: string | null;
  readonly phoneNumber?: string | null;
  readonly bankName?: string | null;
  readonly Post: AsyncCollection<Post>;
  readonly bankCode?: string | null;
  readonly Bookings: AsyncCollection<Booking>;
  readonly RealtorReview: AsyncCollection<RealtorReview>;
  readonly accountName?: string | null;
  readonly accountNumber?: string | null;
  readonly directPayment?: boolean | null;
  readonly push_token?: string | null;
  readonly isVerified?: boolean | null;
  readonly isPartner?: boolean | null;
  readonly isPremium?: boolean | null;
  readonly isElite?: boolean | null;
  readonly isTrusted?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Realtor = LazyLoading extends LazyLoadingDisabled ? EagerRealtor : LazyRealtor

export declare const Realtor: (new (init: ModelInit<Realtor>) => Realtor) & {
  copyOf(source: Realtor, mutator: (draft: MutableModel<Realtor>) => MutableModel<Realtor> | void): Realtor;
}

type EagerPost = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Post, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly propertyType: string;
  readonly type: string;
  readonly nameOfType?: string | null;
  readonly packageType?: string | null;
  readonly availableDocs?: string | null;
  readonly accommodationParts?: string | null;
  readonly media?: (string | null)[] | null;
  readonly description: string;
  readonly eventDateTime?: string | null;
  readonly eventEndDateTime?: string | null;
  readonly recurrence?: string | null;
  readonly eventFrequency?: string | null;
  readonly capacity?: string | null;
  readonly dressCode?: string | null;
  readonly available?: boolean | null;
  readonly address?: string | null;
  readonly fullAddress?: string | null;
  readonly generalLocation?: string | null;
  readonly PostReviews?: (PostReview | null)[] | null;
  readonly lat?: number | null;
  readonly lng?: number | null;
  readonly price?: number | null;
  readonly cautionFee?: number | null;
  readonly totalPrice: number;
  readonly inspectionFee?: number | null;
  readonly otherFeesName?: string | null;
  readonly otherFeesPrice?: number | null;
  readonly otherFeesName2?: string | null;
  readonly otherFeesPrice2?: number | null;
  readonly vendorCommissionAmount?: number | null;
  readonly vendorCommissionBreakdown?: string | null;
  readonly PostComments?: (PostComment | null)[] | null;
  readonly clientServiceFee?: number | null;
  readonly timeFrame?: string | null;
  readonly bed?: string | null;
  readonly bedrooms?: string | null;
  readonly amenities?: string | null;
  readonly policies?: string | null;
  readonly PostLikes?: (PostLike | null)[] | null;
  readonly country: string;
  readonly state?: string | null;
  readonly city?: string | null;
  readonly isApproved?: boolean | null;
  readonly isSubscription?: boolean | null;
  readonly bookingMode?: string | null;
  readonly allowMultiple?: boolean | null;
  readonly maxCapacity?: number | null;
  readonly sessionDuration?: number | null;
  readonly sessionGap?: number | null;
  readonly serviceDay?: (string | null)[] | null;
  readonly openingHour?: string | null;
  readonly closingHour?: string | null;
  readonly realtorID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPost = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Post, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly propertyType: string;
  readonly type: string;
  readonly nameOfType?: string | null;
  readonly packageType?: string | null;
  readonly availableDocs?: string | null;
  readonly accommodationParts?: string | null;
  readonly media?: (string | null)[] | null;
  readonly description: string;
  readonly eventDateTime?: string | null;
  readonly eventEndDateTime?: string | null;
  readonly recurrence?: string | null;
  readonly eventFrequency?: string | null;
  readonly capacity?: string | null;
  readonly dressCode?: string | null;
  readonly available?: boolean | null;
  readonly address?: string | null;
  readonly fullAddress?: string | null;
  readonly generalLocation?: string | null;
  readonly PostReviews: AsyncCollection<PostReview>;
  readonly lat?: number | null;
  readonly lng?: number | null;
  readonly price?: number | null;
  readonly cautionFee?: number | null;
  readonly totalPrice: number;
  readonly inspectionFee?: number | null;
  readonly otherFeesName?: string | null;
  readonly otherFeesPrice?: number | null;
  readonly otherFeesName2?: string | null;
  readonly otherFeesPrice2?: number | null;
  readonly vendorCommissionAmount?: number | null;
  readonly vendorCommissionBreakdown?: string | null;
  readonly PostComments: AsyncCollection<PostComment>;
  readonly clientServiceFee?: number | null;
  readonly timeFrame?: string | null;
  readonly bed?: string | null;
  readonly bedrooms?: string | null;
  readonly amenities?: string | null;
  readonly policies?: string | null;
  readonly PostLikes: AsyncCollection<PostLike>;
  readonly country: string;
  readonly state?: string | null;
  readonly city?: string | null;
  readonly isApproved?: boolean | null;
  readonly isSubscription?: boolean | null;
  readonly bookingMode?: string | null;
  readonly allowMultiple?: boolean | null;
  readonly maxCapacity?: number | null;
  readonly sessionDuration?: number | null;
  readonly sessionGap?: number | null;
  readonly serviceDay?: (string | null)[] | null;
  readonly openingHour?: string | null;
  readonly closingHour?: string | null;
  readonly realtorID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Post = LazyLoading extends LazyLoadingDisabled ? EagerPost : LazyPost

export declare const Post: (new (init: ModelInit<Post>) => Post) & {
  copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}