/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getVendorBalance = /* GraphQL */ `
  query GetVendorBalance($id: ID!) {
    getVendorBalance(id: $id) {
      id
      realtorID
      totalEarned
      totalPaid
      pendingBalance
      lastPayoutDate
      Realtor {
        id
        sub
        firstName
        lastName
        username
        myDescription
        profilePic
        email
        address
        phoneNumber
        bankName
        bankCode
        accountName
        accountNumber
        directPayment
        push_token
        isVerified
        isPartner
        isPremium
        isElite
        isTrusted
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      VendorTransactions {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listVendorBalances = /* GraphQL */ `
  query ListVendorBalances(
    $filter: ModelVendorBalanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVendorBalances(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        realtorID
        totalEarned
        totalPaid
        pendingBalance
        lastPayoutDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncVendorBalances = /* GraphQL */ `
  query SyncVendorBalances(
    $filter: ModelVendorBalanceFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncVendorBalances(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        realtorID
        totalEarned
        totalPaid
        pendingBalance
        lastPayoutDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const vendorBalancesByRealtorID = /* GraphQL */ `
  query VendorBalancesByRealtorID(
    $realtorID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelVendorBalanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    vendorBalancesByRealtorID(
      realtorID: $realtorID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        realtorID
        totalEarned
        totalPaid
        pendingBalance
        lastPayoutDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getVendorTransaction = /* GraphQL */ `
  query GetVendorTransaction($id: ID!) {
    getVendorTransaction(id: $id) {
      id
      vendorBalanceID
      realtorID
      bookingID
      type
      amount
      status
      createdAt
      updatedAt
      VendorBalance {
        id
        realtorID
        totalEarned
        totalPaid
        pendingBalance
        lastPayoutDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      Realtor {
        id
        sub
        firstName
        lastName
        username
        myDescription
        profilePic
        email
        address
        phoneNumber
        bankName
        bankCode
        accountName
        accountNumber
        directPayment
        push_token
        isVerified
        isPartner
        isPremium
        isElite
        isTrusted
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      Booking {
        id
        opusingFor
        otherUsername
        opusedBy
        adults
        kids
        infants
        numberOfPeople
        numberOfItems
        clientFirstName
        clientLastName
        clientPhoneNumber
        guestEmail
        purpose
        selectedOption
        duration
        checkInDate
        checkOutDate
        bookedSessionDuration
        isOfflineBooking
        subscription
        propertyType
        accommodationType
        nameOfType
        totalPrice
        realtorPrice
        opusamaCommission
        serviceCharge
        overAllPrice
        bookingLat
        bookingLng
        status
        userID
        transactionReference
        transactionStatus
        realtorID
        paymentRecordID
        PostID
        ticketID
        qrCodeUrl
        ticketStatus
        checkedInByID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listVendorTransactions = /* GraphQL */ `
  query ListVendorTransactions(
    $filter: ModelVendorTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVendorTransactions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        vendorBalanceID
        realtorID
        bookingID
        type
        amount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncVendorTransactions = /* GraphQL */ `
  query SyncVendorTransactions(
    $filter: ModelVendorTransactionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncVendorTransactions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        vendorBalanceID
        realtorID
        bookingID
        type
        amount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const vendorTransactionsByVendorBalanceID = /* GraphQL */ `
  query VendorTransactionsByVendorBalanceID(
    $vendorBalanceID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelVendorTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    vendorTransactionsByVendorBalanceID(
      vendorBalanceID: $vendorBalanceID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        vendorBalanceID
        realtorID
        bookingID
        type
        amount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const vendorTransactionsByRealtorID = /* GraphQL */ `
  query VendorTransactionsByRealtorID(
    $realtorID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelVendorTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    vendorTransactionsByRealtorID(
      realtorID: $realtorID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        vendorBalanceID
        realtorID
        bookingID
        type
        amount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const vendorTransactionsByBookingID = /* GraphQL */ `
  query VendorTransactionsByBookingID(
    $bookingID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelVendorTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    vendorTransactionsByBookingID(
      bookingID: $bookingID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        vendorBalanceID
        realtorID
        bookingID
        type
        amount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getNotification = /* GraphQL */ `
  query GetNotification($id: ID!) {
    getNotification(id: $id) {
      id
      creatorID
      recipientID
      recipientType
      type
      entityID
      commentID
      message
      read
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listNotifications = /* GraphQL */ `
  query ListNotifications(
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        creatorID
        recipientID
        recipientType
        type
        entityID
        commentID
        message
        read
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncNotifications = /* GraphQL */ `
  query SyncNotifications(
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncNotifications(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        creatorID
        recipientID
        recipientType
        type
        entityID
        commentID
        message
        read
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getCommunityLike = /* GraphQL */ `
  query GetCommunityLike($id: ID!) {
    getCommunityLike(id: $id) {
      id
      like
      likedByID
      communitydiscussionID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listCommunityLikes = /* GraphQL */ `
  query ListCommunityLikes(
    $filter: ModelCommunityLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommunityLikes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        like
        likedByID
        communitydiscussionID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncCommunityLikes = /* GraphQL */ `
  query SyncCommunityLikes(
    $filter: ModelCommunityLikeFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCommunityLikes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        like
        likedByID
        communitydiscussionID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const communityLikesByCommunitydiscussionID = /* GraphQL */ `
  query CommunityLikesByCommunitydiscussionID(
    $communitydiscussionID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommunityLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    communityLikesByCommunitydiscussionID(
      communitydiscussionID: $communitydiscussionID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        like
        likedByID
        communitydiscussionID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getCommunityReply = /* GraphQL */ `
  query GetCommunityReply($id: ID!) {
    getCommunityReply(id: $id) {
      id
      comment
      media
      commenterID
      communitydiscussionID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listCommunityReplies = /* GraphQL */ `
  query ListCommunityReplies(
    $filter: ModelCommunityReplyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommunityReplies(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        comment
        media
        commenterID
        communitydiscussionID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncCommunityReplies = /* GraphQL */ `
  query SyncCommunityReplies(
    $filter: ModelCommunityReplyFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCommunityReplies(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        comment
        media
        commenterID
        communitydiscussionID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const communityRepliesByCommunitydiscussionID = /* GraphQL */ `
  query CommunityRepliesByCommunitydiscussionID(
    $communitydiscussionID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommunityReplyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    communityRepliesByCommunitydiscussionID(
      communitydiscussionID: $communitydiscussionID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        comment
        media
        commenterID
        communitydiscussionID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getCommunityDiscussion = /* GraphQL */ `
  query GetCommunityDiscussion($id: ID!) {
    getCommunityDiscussion(id: $id) {
      id
      category
      title
      content
      instigatorID
      media
      CommunityReplies {
        nextToken
        startedAt
        __typename
      }
      CommunityLikes {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listCommunityDiscussions = /* GraphQL */ `
  query ListCommunityDiscussions(
    $filter: ModelCommunityDiscussionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommunityDiscussions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        category
        title
        content
        instigatorID
        media
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncCommunityDiscussions = /* GraphQL */ `
  query SyncCommunityDiscussions(
    $filter: ModelCommunityDiscussionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCommunityDiscussions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        category
        title
        content
        instigatorID
        media
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getPostComment = /* GraphQL */ `
  query GetPostComment($id: ID!) {
    getPostComment(id: $id) {
      id
      comment
      commenterID
      realtorID
      postID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listPostComments = /* GraphQL */ `
  query ListPostComments(
    $filter: ModelPostCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPostComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        comment
        commenterID
        realtorID
        postID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncPostComments = /* GraphQL */ `
  query SyncPostComments(
    $filter: ModelPostCommentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPostComments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        comment
        commenterID
        realtorID
        postID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const postCommentsByPostID = /* GraphQL */ `
  query PostCommentsByPostID(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPostCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postCommentsByPostID(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        comment
        commenterID
        realtorID
        postID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getPostLike = /* GraphQL */ `
  query GetPostLike($id: ID!) {
    getPostLike(id: $id) {
      id
      like
      likedByID
      postID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listPostLikes = /* GraphQL */ `
  query ListPostLikes(
    $filter: ModelPostLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPostLikes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        like
        likedByID
        postID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncPostLikes = /* GraphQL */ `
  query SyncPostLikes(
    $filter: ModelPostLikeFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPostLikes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        like
        likedByID
        postID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const postLikesByPostID = /* GraphQL */ `
  query PostLikesByPostID(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPostLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postLikesByPostID(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        like
        likedByID
        postID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getRealtorReview = /* GraphQL */ `
  query GetRealtorReview($id: ID!) {
    getRealtorReview(id: $id) {
      id
      rating
      review
      realtorID
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listRealtorReviews = /* GraphQL */ `
  query ListRealtorReviews(
    $filter: ModelRealtorReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRealtorReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        rating
        review
        realtorID
        userID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncRealtorReviews = /* GraphQL */ `
  query SyncRealtorReviews(
    $filter: ModelRealtorReviewFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncRealtorReviews(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        rating
        review
        realtorID
        userID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const realtorReviewsByRealtorID = /* GraphQL */ `
  query RealtorReviewsByRealtorID(
    $realtorID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRealtorReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    realtorReviewsByRealtorID(
      realtorID: $realtorID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        rating
        review
        realtorID
        userID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const realtorReviewsByUserID = /* GraphQL */ `
  query RealtorReviewsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRealtorReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    realtorReviewsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        rating
        review
        realtorID
        userID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getPostReview = /* GraphQL */ `
  query GetPostReview($id: ID!) {
    getPostReview(id: $id) {
      id
      rating
      review
      realtorID
      postID
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listPostReviews = /* GraphQL */ `
  query ListPostReviews(
    $filter: ModelPostReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPostReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        rating
        review
        realtorID
        postID
        userID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncPostReviews = /* GraphQL */ `
  query SyncPostReviews(
    $filter: ModelPostReviewFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPostReviews(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        rating
        review
        realtorID
        postID
        userID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const postReviewsByPostID = /* GraphQL */ `
  query PostReviewsByPostID(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPostReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postReviewsByPostID(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        rating
        review
        realtorID
        postID
        userID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const postReviewsByUserID = /* GraphQL */ `
  query PostReviewsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPostReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postReviewsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        rating
        review
        realtorID
        postID
        userID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getBooking = /* GraphQL */ `
  query GetBooking($id: ID!) {
    getBooking(id: $id) {
      id
      opusingFor
      otherUsername
      opusedBy
      adults
      kids
      infants
      numberOfPeople
      numberOfItems
      clientFirstName
      clientLastName
      clientPhoneNumber
      guestEmail
      purpose
      selectedOption
      duration
      checkInDate
      checkOutDate
      bookedSessionDuration
      isOfflineBooking
      subscription
      propertyType
      accommodationType
      nameOfType
      totalPrice
      realtorPrice
      opusamaCommission
      serviceCharge
      overAllPrice
      bookingLat
      bookingLng
      status
      userID
      transactionReference
      transactionStatus
      realtorID
      paymentRecordID
      PostID
      ticketID
      qrCodeUrl
      ticketStatus
      checkedInByID
      VendorTransactions {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listBookings = /* GraphQL */ `
  query ListBookings(
    $filter: ModelBookingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        opusingFor
        otherUsername
        opusedBy
        adults
        kids
        infants
        numberOfPeople
        numberOfItems
        clientFirstName
        clientLastName
        clientPhoneNumber
        guestEmail
        purpose
        selectedOption
        duration
        checkInDate
        checkOutDate
        bookedSessionDuration
        isOfflineBooking
        subscription
        propertyType
        accommodationType
        nameOfType
        totalPrice
        realtorPrice
        opusamaCommission
        serviceCharge
        overAllPrice
        bookingLat
        bookingLng
        status
        userID
        transactionReference
        transactionStatus
        realtorID
        paymentRecordID
        PostID
        ticketID
        qrCodeUrl
        ticketStatus
        checkedInByID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncBookings = /* GraphQL */ `
  query SyncBookings(
    $filter: ModelBookingFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncBookings(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        opusingFor
        otherUsername
        opusedBy
        adults
        kids
        infants
        numberOfPeople
        numberOfItems
        clientFirstName
        clientLastName
        clientPhoneNumber
        guestEmail
        purpose
        selectedOption
        duration
        checkInDate
        checkOutDate
        bookedSessionDuration
        isOfflineBooking
        subscription
        propertyType
        accommodationType
        nameOfType
        totalPrice
        realtorPrice
        opusamaCommission
        serviceCharge
        overAllPrice
        bookingLat
        bookingLng
        status
        userID
        transactionReference
        transactionStatus
        realtorID
        paymentRecordID
        PostID
        ticketID
        qrCodeUrl
        ticketStatus
        checkedInByID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const bookingsByUserID = /* GraphQL */ `
  query BookingsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBookingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    bookingsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        opusingFor
        otherUsername
        opusedBy
        adults
        kids
        infants
        numberOfPeople
        numberOfItems
        clientFirstName
        clientLastName
        clientPhoneNumber
        guestEmail
        purpose
        selectedOption
        duration
        checkInDate
        checkOutDate
        bookedSessionDuration
        isOfflineBooking
        subscription
        propertyType
        accommodationType
        nameOfType
        totalPrice
        realtorPrice
        opusamaCommission
        serviceCharge
        overAllPrice
        bookingLat
        bookingLng
        status
        userID
        transactionReference
        transactionStatus
        realtorID
        paymentRecordID
        PostID
        ticketID
        qrCodeUrl
        ticketStatus
        checkedInByID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const bookingsByRealtorID = /* GraphQL */ `
  query BookingsByRealtorID(
    $realtorID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBookingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    bookingsByRealtorID(
      realtorID: $realtorID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        opusingFor
        otherUsername
        opusedBy
        adults
        kids
        infants
        numberOfPeople
        numberOfItems
        clientFirstName
        clientLastName
        clientPhoneNumber
        guestEmail
        purpose
        selectedOption
        duration
        checkInDate
        checkOutDate
        bookedSessionDuration
        isOfflineBooking
        subscription
        propertyType
        accommodationType
        nameOfType
        totalPrice
        realtorPrice
        opusamaCommission
        serviceCharge
        overAllPrice
        bookingLat
        bookingLng
        status
        userID
        transactionReference
        transactionStatus
        realtorID
        paymentRecordID
        PostID
        ticketID
        qrCodeUrl
        ticketStatus
        checkedInByID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const bookingsByPaymentRecordID = /* GraphQL */ `
  query BookingsByPaymentRecordID(
    $paymentRecordID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBookingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    bookingsByPaymentRecordID(
      paymentRecordID: $paymentRecordID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        opusingFor
        otherUsername
        opusedBy
        adults
        kids
        infants
        numberOfPeople
        numberOfItems
        clientFirstName
        clientLastName
        clientPhoneNumber
        guestEmail
        purpose
        selectedOption
        duration
        checkInDate
        checkOutDate
        bookedSessionDuration
        isOfflineBooking
        subscription
        propertyType
        accommodationType
        nameOfType
        totalPrice
        realtorPrice
        opusamaCommission
        serviceCharge
        overAllPrice
        bookingLat
        bookingLng
        status
        userID
        transactionReference
        transactionStatus
        realtorID
        paymentRecordID
        PostID
        ticketID
        qrCodeUrl
        ticketStatus
        checkedInByID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      sub
      firstName
      lastName
      username
      email
      isVerified
      profilePic
      PostReviews {
        nextToken
        startedAt
        __typename
      }
      RealtorReviews {
        nextToken
        startedAt
        __typename
      }
      phoneNumber
      Bookings {
        nextToken
        startedAt
        __typename
      }
      address
      cardNumber
      cardExpiry
      cardCvv
      push_token
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        firstName
        lastName
        username
        email
        isVerified
        profilePic
        phoneNumber
        address
        cardNumber
        cardExpiry
        cardCvv
        push_token
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        sub
        firstName
        lastName
        username
        email
        isVerified
        profilePic
        phoneNumber
        address
        cardNumber
        cardExpiry
        cardCvv
        push_token
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getVendorScanner = /* GraphQL */ `
  query GetVendorScanner($id: ID!) {
    getVendorScanner(id: $id) {
      id
      vendorID
      name
      token
      expiresAt
      isActive
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listVendorScanners = /* GraphQL */ `
  query ListVendorScanners(
    $filter: ModelVendorScannerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVendorScanners(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        vendorID
        name
        token
        expiresAt
        isActive
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncVendorScanners = /* GraphQL */ `
  query SyncVendorScanners(
    $filter: ModelVendorScannerFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncVendorScanners(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        vendorID
        name
        token
        expiresAt
        isActive
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getRealtor = /* GraphQL */ `
  query GetRealtor($id: ID!) {
    getRealtor(id: $id) {
      id
      sub
      firstName
      lastName
      username
      myDescription
      profilePic
      email
      address
      phoneNumber
      bankName
      bankCode
      accountName
      accountNumber
      directPayment
      push_token
      isVerified
      isPartner
      isPremium
      isElite
      isTrusted
      Post {
        nextToken
        startedAt
        __typename
      }
      Bookings {
        nextToken
        startedAt
        __typename
      }
      RealtorReview {
        nextToken
        startedAt
        __typename
      }
      VendorBalance {
        id
        realtorID
        totalEarned
        totalPaid
        pendingBalance
        lastPayoutDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      VendorTransactions {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listRealtors = /* GraphQL */ `
  query ListRealtors(
    $filter: ModelRealtorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRealtors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        firstName
        lastName
        username
        myDescription
        profilePic
        email
        address
        phoneNumber
        bankName
        bankCode
        accountName
        accountNumber
        directPayment
        push_token
        isVerified
        isPartner
        isPremium
        isElite
        isTrusted
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncRealtors = /* GraphQL */ `
  query SyncRealtors(
    $filter: ModelRealtorFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncRealtors(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        sub
        firstName
        lastName
        username
        myDescription
        profilePic
        email
        address
        phoneNumber
        bankName
        bankCode
        accountName
        accountNumber
        directPayment
        push_token
        isVerified
        isPartner
        isPremium
        isElite
        isTrusted
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getBookingPostOptions = /* GraphQL */ `
  query GetBookingPostOptions($id: ID!) {
    getBookingPostOptions(id: $id) {
      id
      postID
      bookingPostOptionType
      bookingName
      optionPrice
      minSpend
      pickupStatus
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listBookingPostOptions = /* GraphQL */ `
  query ListBookingPostOptions(
    $filter: ModelBookingPostOptionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookingPostOptions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postID
        bookingPostOptionType
        bookingName
        optionPrice
        minSpend
        pickupStatus
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncBookingPostOptions = /* GraphQL */ `
  query SyncBookingPostOptions(
    $filter: ModelBookingPostOptionsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncBookingPostOptions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        postID
        bookingPostOptionType
        bookingName
        optionPrice
        minSpend
        pickupStatus
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const bookingPostOptionsByPostID = /* GraphQL */ `
  query BookingPostOptionsByPostID(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelBookingPostOptionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    bookingPostOptionsByPostID(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postID
        bookingPostOptionType
        bookingName
        optionPrice
        minSpend
        pickupStatus
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      propertyType
      type
      nameOfType
      packageType
      availableDocs
      accommodationParts
      media
      description
      eventName
      eventDateTime
      eventEndDateTime
      recurrence
      eventFrequency
      capacity
      dressCode
      available
      address
      fullAddress
      PostReviews {
        nextToken
        startedAt
        __typename
      }
      generalLocation
      lat
      lng
      price
      cautionFee
      totalPrice
      inspectionFee
      otherFeesName
      otherFeesPrice
      otherFeesName2
      otherFeesPrice2
      vendorCommissionAmount
      PostComments {
        nextToken
        startedAt
        __typename
      }
      vendorCommissionBreakdown
      clientServiceFee
      timeFrame
      bed
      bedrooms
      amenities
      PostLikes {
        nextToken
        startedAt
        __typename
      }
      policies
      country
      state
      city
      isApproved
      isSubscription
      bookingMode
      allowMultiple
      maxCapacity
      sessionDuration
      sessionGap
      servicingDay
      BookingPostOptions {
        nextToken
        startedAt
        __typename
      }
      openingHour
      closingHour
      realtorID
      uploadStatus
      uploadErrorMessage
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        propertyType
        type
        nameOfType
        packageType
        availableDocs
        accommodationParts
        media
        description
        eventName
        eventDateTime
        eventEndDateTime
        recurrence
        eventFrequency
        capacity
        dressCode
        available
        address
        fullAddress
        generalLocation
        lat
        lng
        price
        cautionFee
        totalPrice
        inspectionFee
        otherFeesName
        otherFeesPrice
        otherFeesName2
        otherFeesPrice2
        vendorCommissionAmount
        vendorCommissionBreakdown
        clientServiceFee
        timeFrame
        bed
        bedrooms
        amenities
        policies
        country
        state
        city
        isApproved
        isSubscription
        bookingMode
        allowMultiple
        maxCapacity
        sessionDuration
        sessionGap
        servicingDay
        openingHour
        closingHour
        realtorID
        uploadStatus
        uploadErrorMessage
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncPosts = /* GraphQL */ `
  query SyncPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPosts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        propertyType
        type
        nameOfType
        packageType
        availableDocs
        accommodationParts
        media
        description
        eventName
        eventDateTime
        eventEndDateTime
        recurrence
        eventFrequency
        capacity
        dressCode
        available
        address
        fullAddress
        generalLocation
        lat
        lng
        price
        cautionFee
        totalPrice
        inspectionFee
        otherFeesName
        otherFeesPrice
        otherFeesName2
        otherFeesPrice2
        vendorCommissionAmount
        vendorCommissionBreakdown
        clientServiceFee
        timeFrame
        bed
        bedrooms
        amenities
        policies
        country
        state
        city
        isApproved
        isSubscription
        bookingMode
        allowMultiple
        maxCapacity
        sessionDuration
        sessionGap
        servicingDay
        openingHour
        closingHour
        realtorID
        uploadStatus
        uploadErrorMessage
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const postsByRealtorID = /* GraphQL */ `
  query PostsByRealtorID(
    $realtorID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByRealtorID(
      realtorID: $realtorID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        propertyType
        type
        nameOfType
        packageType
        availableDocs
        accommodationParts
        media
        description
        eventName
        eventDateTime
        eventEndDateTime
        recurrence
        eventFrequency
        capacity
        dressCode
        available
        address
        fullAddress
        generalLocation
        lat
        lng
        price
        cautionFee
        totalPrice
        inspectionFee
        otherFeesName
        otherFeesPrice
        otherFeesName2
        otherFeesPrice2
        vendorCommissionAmount
        vendorCommissionBreakdown
        clientServiceFee
        timeFrame
        bed
        bedrooms
        amenities
        policies
        country
        state
        city
        isApproved
        isSubscription
        bookingMode
        allowMultiple
        maxCapacity
        sessionDuration
        sessionGap
        servicingDay
        openingHour
        closingHour
        realtorID
        uploadStatus
        uploadErrorMessage
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
