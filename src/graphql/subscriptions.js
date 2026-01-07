/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateVendorBalance = /* GraphQL */ `
  subscription OnCreateVendorBalance(
    $filter: ModelSubscriptionVendorBalanceFilterInput
  ) {
    onCreateVendorBalance(filter: $filter) {
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
export const onUpdateVendorBalance = /* GraphQL */ `
  subscription OnUpdateVendorBalance(
    $filter: ModelSubscriptionVendorBalanceFilterInput
  ) {
    onUpdateVendorBalance(filter: $filter) {
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
export const onDeleteVendorBalance = /* GraphQL */ `
  subscription OnDeleteVendorBalance(
    $filter: ModelSubscriptionVendorBalanceFilterInput
  ) {
    onDeleteVendorBalance(filter: $filter) {
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
export const onCreateVendorTransaction = /* GraphQL */ `
  subscription OnCreateVendorTransaction(
    $filter: ModelSubscriptionVendorTransactionFilterInput
  ) {
    onCreateVendorTransaction(filter: $filter) {
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
export const onUpdateVendorTransaction = /* GraphQL */ `
  subscription OnUpdateVendorTransaction(
    $filter: ModelSubscriptionVendorTransactionFilterInput
  ) {
    onUpdateVendorTransaction(filter: $filter) {
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
export const onDeleteVendorTransaction = /* GraphQL */ `
  subscription OnDeleteVendorTransaction(
    $filter: ModelSubscriptionVendorTransactionFilterInput
  ) {
    onDeleteVendorTransaction(filter: $filter) {
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
export const onCreateNotification = /* GraphQL */ `
  subscription OnCreateNotification(
    $filter: ModelSubscriptionNotificationFilterInput
  ) {
    onCreateNotification(filter: $filter) {
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
export const onUpdateNotification = /* GraphQL */ `
  subscription OnUpdateNotification(
    $filter: ModelSubscriptionNotificationFilterInput
  ) {
    onUpdateNotification(filter: $filter) {
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
export const onDeleteNotification = /* GraphQL */ `
  subscription OnDeleteNotification(
    $filter: ModelSubscriptionNotificationFilterInput
  ) {
    onDeleteNotification(filter: $filter) {
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
export const onCreateCommunityLike = /* GraphQL */ `
  subscription OnCreateCommunityLike(
    $filter: ModelSubscriptionCommunityLikeFilterInput
  ) {
    onCreateCommunityLike(filter: $filter) {
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
export const onUpdateCommunityLike = /* GraphQL */ `
  subscription OnUpdateCommunityLike(
    $filter: ModelSubscriptionCommunityLikeFilterInput
  ) {
    onUpdateCommunityLike(filter: $filter) {
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
export const onDeleteCommunityLike = /* GraphQL */ `
  subscription OnDeleteCommunityLike(
    $filter: ModelSubscriptionCommunityLikeFilterInput
  ) {
    onDeleteCommunityLike(filter: $filter) {
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
export const onCreateCommunityReply = /* GraphQL */ `
  subscription OnCreateCommunityReply(
    $filter: ModelSubscriptionCommunityReplyFilterInput
  ) {
    onCreateCommunityReply(filter: $filter) {
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
export const onUpdateCommunityReply = /* GraphQL */ `
  subscription OnUpdateCommunityReply(
    $filter: ModelSubscriptionCommunityReplyFilterInput
  ) {
    onUpdateCommunityReply(filter: $filter) {
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
export const onDeleteCommunityReply = /* GraphQL */ `
  subscription OnDeleteCommunityReply(
    $filter: ModelSubscriptionCommunityReplyFilterInput
  ) {
    onDeleteCommunityReply(filter: $filter) {
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
export const onCreateCommunityDiscussion = /* GraphQL */ `
  subscription OnCreateCommunityDiscussion(
    $filter: ModelSubscriptionCommunityDiscussionFilterInput
  ) {
    onCreateCommunityDiscussion(filter: $filter) {
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
export const onUpdateCommunityDiscussion = /* GraphQL */ `
  subscription OnUpdateCommunityDiscussion(
    $filter: ModelSubscriptionCommunityDiscussionFilterInput
  ) {
    onUpdateCommunityDiscussion(filter: $filter) {
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
export const onDeleteCommunityDiscussion = /* GraphQL */ `
  subscription OnDeleteCommunityDiscussion(
    $filter: ModelSubscriptionCommunityDiscussionFilterInput
  ) {
    onDeleteCommunityDiscussion(filter: $filter) {
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
export const onCreatePostComment = /* GraphQL */ `
  subscription OnCreatePostComment(
    $filter: ModelSubscriptionPostCommentFilterInput
  ) {
    onCreatePostComment(filter: $filter) {
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
export const onUpdatePostComment = /* GraphQL */ `
  subscription OnUpdatePostComment(
    $filter: ModelSubscriptionPostCommentFilterInput
  ) {
    onUpdatePostComment(filter: $filter) {
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
export const onDeletePostComment = /* GraphQL */ `
  subscription OnDeletePostComment(
    $filter: ModelSubscriptionPostCommentFilterInput
  ) {
    onDeletePostComment(filter: $filter) {
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
export const onCreatePostLike = /* GraphQL */ `
  subscription OnCreatePostLike($filter: ModelSubscriptionPostLikeFilterInput) {
    onCreatePostLike(filter: $filter) {
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
export const onUpdatePostLike = /* GraphQL */ `
  subscription OnUpdatePostLike($filter: ModelSubscriptionPostLikeFilterInput) {
    onUpdatePostLike(filter: $filter) {
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
export const onDeletePostLike = /* GraphQL */ `
  subscription OnDeletePostLike($filter: ModelSubscriptionPostLikeFilterInput) {
    onDeletePostLike(filter: $filter) {
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
export const onCreateRealtorReview = /* GraphQL */ `
  subscription OnCreateRealtorReview(
    $filter: ModelSubscriptionRealtorReviewFilterInput
  ) {
    onCreateRealtorReview(filter: $filter) {
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
export const onUpdateRealtorReview = /* GraphQL */ `
  subscription OnUpdateRealtorReview(
    $filter: ModelSubscriptionRealtorReviewFilterInput
  ) {
    onUpdateRealtorReview(filter: $filter) {
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
export const onDeleteRealtorReview = /* GraphQL */ `
  subscription OnDeleteRealtorReview(
    $filter: ModelSubscriptionRealtorReviewFilterInput
  ) {
    onDeleteRealtorReview(filter: $filter) {
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
export const onCreatePostReview = /* GraphQL */ `
  subscription OnCreatePostReview(
    $filter: ModelSubscriptionPostReviewFilterInput
  ) {
    onCreatePostReview(filter: $filter) {
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
export const onUpdatePostReview = /* GraphQL */ `
  subscription OnUpdatePostReview(
    $filter: ModelSubscriptionPostReviewFilterInput
  ) {
    onUpdatePostReview(filter: $filter) {
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
export const onDeletePostReview = /* GraphQL */ `
  subscription OnDeletePostReview(
    $filter: ModelSubscriptionPostReviewFilterInput
  ) {
    onDeletePostReview(filter: $filter) {
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
export const onCreateBooking = /* GraphQL */ `
  subscription OnCreateBooking($filter: ModelSubscriptionBookingFilterInput) {
    onCreateBooking(filter: $filter) {
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
export const onUpdateBooking = /* GraphQL */ `
  subscription OnUpdateBooking($filter: ModelSubscriptionBookingFilterInput) {
    onUpdateBooking(filter: $filter) {
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
export const onDeleteBooking = /* GraphQL */ `
  subscription OnDeleteBooking($filter: ModelSubscriptionBookingFilterInput) {
    onDeleteBooking(filter: $filter) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateVendorScanner = /* GraphQL */ `
  subscription OnCreateVendorScanner(
    $filter: ModelSubscriptionVendorScannerFilterInput
  ) {
    onCreateVendorScanner(filter: $filter) {
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
export const onUpdateVendorScanner = /* GraphQL */ `
  subscription OnUpdateVendorScanner(
    $filter: ModelSubscriptionVendorScannerFilterInput
  ) {
    onUpdateVendorScanner(filter: $filter) {
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
export const onDeleteVendorScanner = /* GraphQL */ `
  subscription OnDeleteVendorScanner(
    $filter: ModelSubscriptionVendorScannerFilterInput
  ) {
    onDeleteVendorScanner(filter: $filter) {
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
export const onCreateRealtor = /* GraphQL */ `
  subscription OnCreateRealtor($filter: ModelSubscriptionRealtorFilterInput) {
    onCreateRealtor(filter: $filter) {
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
export const onUpdateRealtor = /* GraphQL */ `
  subscription OnUpdateRealtor($filter: ModelSubscriptionRealtorFilterInput) {
    onUpdateRealtor(filter: $filter) {
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
export const onDeleteRealtor = /* GraphQL */ `
  subscription OnDeleteRealtor($filter: ModelSubscriptionRealtorFilterInput) {
    onDeleteRealtor(filter: $filter) {
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
export const onCreateBookingPostOptions = /* GraphQL */ `
  subscription OnCreateBookingPostOptions(
    $filter: ModelSubscriptionBookingPostOptionsFilterInput
  ) {
    onCreateBookingPostOptions(filter: $filter) {
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
export const onUpdateBookingPostOptions = /* GraphQL */ `
  subscription OnUpdateBookingPostOptions(
    $filter: ModelSubscriptionBookingPostOptionsFilterInput
  ) {
    onUpdateBookingPostOptions(filter: $filter) {
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
export const onDeleteBookingPostOptions = /* GraphQL */ `
  subscription OnDeleteBookingPostOptions(
    $filter: ModelSubscriptionBookingPostOptionsFilterInput
  ) {
    onDeleteBookingPostOptions(filter: $filter) {
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost($filter: ModelSubscriptionPostFilterInput) {
    onCreatePost(filter: $filter) {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost($filter: ModelSubscriptionPostFilterInput) {
    onUpdatePost(filter: $filter) {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost($filter: ModelSubscriptionPostFilterInput) {
    onDeletePost(filter: $filter) {
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
