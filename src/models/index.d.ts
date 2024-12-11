import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";

export enum BookingStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  VIEWING = "VIEWING",
  VIEWED = "VIEWED",
  SOLD = "SOLD",
  PAID = "PAID",
  RECEIVED = "RECEIVED",
  DENIED = "DENIED"
}



type EagerRealtorReview = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<RealtorReview, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly rating?: number | null;
  readonly review?: string | null;
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
  readonly adults?: string | null;
  readonly kids?: string | null;
  readonly infants?: string | null;
  readonly clientFirstName?: string | null;
  readonly clientLastName?: string | null;
  readonly clientPhoneNumber?: string | null;
  readonly purpose?: string | null;
  readonly duration?: string | null;
  readonly checkInDate?: string | null;
  readonly checkOutDate?: string | null;
  readonly propertyType?: string | null;
  readonly accommodationType?: string | null;
  readonly nameOfType?: string | null;
  readonly totalPrice?: number | null;
  readonly realtorPrice?: number | null;
  readonly bookingLat?: number | null;
  readonly bookingLng?: number | null;
  readonly status?: BookingStatus | keyof typeof BookingStatus | null;
  readonly userID: string;
  readonly realtorID: string;
  readonly PostID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBooking = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Booking, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly adults?: string | null;
  readonly kids?: string | null;
  readonly infants?: string | null;
  readonly clientFirstName?: string | null;
  readonly clientLastName?: string | null;
  readonly clientPhoneNumber?: string | null;
  readonly purpose?: string | null;
  readonly duration?: string | null;
  readonly checkInDate?: string | null;
  readonly checkOutDate?: string | null;
  readonly propertyType?: string | null;
  readonly accommodationType?: string | null;
  readonly nameOfType?: string | null;
  readonly totalPrice?: number | null;
  readonly realtorPrice?: number | null;
  readonly bookingLat?: number | null;
  readonly bookingLng?: number | null;
  readonly status?: BookingStatus | keyof typeof BookingStatus | null;
  readonly userID: string;
  readonly realtorID: string;
  readonly PostID?: string | null;
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
  readonly profilePic?: string | null;
  readonly phoneNumber?: string | null;
  readonly address?: string | null;
  readonly PostReviews?: (PostReview | null)[] | null;
  readonly RealtorReviews?: (RealtorReview | null)[] | null;
  readonly push_token?: string | null;
  readonly Bookings?: (Booking | null)[] | null;
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
  readonly profilePic?: string | null;
  readonly phoneNumber?: string | null;
  readonly address?: string | null;
  readonly PostReviews: AsyncCollection<PostReview>;
  readonly RealtorReviews: AsyncCollection<RealtorReview>;
  readonly push_token?: string | null;
  readonly Bookings: AsyncCollection<Booking>;
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
  readonly myDescription?: string | null;
  readonly profilePic?: string | null;
  readonly email?: string | null;
  readonly address?: string | null;
  readonly phoneNumber?: string | null;
  readonly bankname?: string | null;
  readonly accountName?: string | null;
  readonly accountNumber?: string | null;
  readonly Post?: (Post | null)[] | null;
  readonly push_token?: string | null;
  readonly Bookings?: (Booking | null)[] | null;
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
  readonly myDescription?: string | null;
  readonly profilePic?: string | null;
  readonly email?: string | null;
  readonly address?: string | null;
  readonly phoneNumber?: string | null;
  readonly bankname?: string | null;
  readonly accountName?: string | null;
  readonly accountNumber?: string | null;
  readonly Post: AsyncCollection<Post>;
  readonly push_token?: string | null;
  readonly Bookings: AsyncCollection<Booking>;
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
  readonly availableDocs?: string | null;
  readonly accommodationParts?: string | null;
  readonly media?: (string | null)[] | null;
  readonly description: string;
  readonly available?: boolean | null;
  readonly address: string;
  readonly lat?: number | null;
  readonly lng?: number | null;
  readonly price: number;
  readonly cautionFee?: number | null;
  readonly totalPrice: number;
  readonly bed?: string | null;
  readonly bedrooms?: string | null;
  readonly amenities?: string | null;
  readonly policies?: string | null;
  readonly PostReviews?: (PostReview | null)[] | null;
  readonly country: string;
  readonly state?: string | null;
  readonly city?: string | null;
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
  readonly availableDocs?: string | null;
  readonly accommodationParts?: string | null;
  readonly media?: (string | null)[] | null;
  readonly description: string;
  readonly available?: boolean | null;
  readonly address: string;
  readonly lat?: number | null;
  readonly lng?: number | null;
  readonly price: number;
  readonly cautionFee?: number | null;
  readonly totalPrice: number;
  readonly bed?: string | null;
  readonly bedrooms?: string | null;
  readonly amenities?: string | null;
  readonly policies?: string | null;
  readonly PostReviews: AsyncCollection<PostReview>;
  readonly country: string;
  readonly state?: string | null;
  readonly city?: string | null;
  readonly realtorID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Post = LazyLoading extends LazyLoadingDisabled ? EagerPost : LazyPost

export declare const Post: (new (init: ModelInit<Post>) => Post) & {
  copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}