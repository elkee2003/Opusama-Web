/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createVendorBalance = /* GraphQL */ `
  mutation CreateVendorBalance(
    $input: CreateVendorBalanceInput!
    $condition: ModelVendorBalanceConditionInput
  ) {
    createVendorBalance(input: $input, condition: $condition) {
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
export const updateVendorBalance = /* GraphQL */ `
  mutation UpdateVendorBalance(
    $input: UpdateVendorBalanceInput!
    $condition: ModelVendorBalanceConditionInput
  ) {
    updateVendorBalance(input: $input, condition: $condition) {
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
export const deleteVendorBalance = /* GraphQL */ `
  mutation DeleteVendorBalance(
    $input: DeleteVendorBalanceInput!
    $condition: ModelVendorBalanceConditionInput
  ) {
    deleteVendorBalance(input: $input, condition: $condition) {
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
export const createVendorTransaction = /* GraphQL */ `
  mutation CreateVendorTransaction(
    $input: CreateVendorTransactionInput!
    $condition: ModelVendorTransactionConditionInput
  ) {
    createVendorTransaction(input: $input, condition: $condition) {
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
export const updateVendorTransaction = /* GraphQL */ `
  mutation UpdateVendorTransaction(
    $input: UpdateVendorTransactionInput!
    $condition: ModelVendorTransactionConditionInput
  ) {
    updateVendorTransaction(input: $input, condition: $condition) {
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
export const deleteVendorTransaction = /* GraphQL */ `
  mutation DeleteVendorTransaction(
    $input: DeleteVendorTransactionInput!
    $condition: ModelVendorTransactionConditionInput
  ) {
    deleteVendorTransaction(input: $input, condition: $condition) {
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
export const createNotification = /* GraphQL */ `
  mutation CreateNotification(
    $input: CreateNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    createNotification(input: $input, condition: $condition) {
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
export const updateNotification = /* GraphQL */ `
  mutation UpdateNotification(
    $input: UpdateNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    updateNotification(input: $input, condition: $condition) {
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
export const deleteNotification = /* GraphQL */ `
  mutation DeleteNotification(
    $input: DeleteNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    deleteNotification(input: $input, condition: $condition) {
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
export const createCommunityLike = /* GraphQL */ `
  mutation CreateCommunityLike(
    $input: CreateCommunityLikeInput!
    $condition: ModelCommunityLikeConditionInput
  ) {
    createCommunityLike(input: $input, condition: $condition) {
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
export const updateCommunityLike = /* GraphQL */ `
  mutation UpdateCommunityLike(
    $input: UpdateCommunityLikeInput!
    $condition: ModelCommunityLikeConditionInput
  ) {
    updateCommunityLike(input: $input, condition: $condition) {
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
export const deleteCommunityLike = /* GraphQL */ `
  mutation DeleteCommunityLike(
    $input: DeleteCommunityLikeInput!
    $condition: ModelCommunityLikeConditionInput
  ) {
    deleteCommunityLike(input: $input, condition: $condition) {
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
export const createCommunityReply = /* GraphQL */ `
  mutation CreateCommunityReply(
    $input: CreateCommunityReplyInput!
    $condition: ModelCommunityReplyConditionInput
  ) {
    createCommunityReply(input: $input, condition: $condition) {
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
export const updateCommunityReply = /* GraphQL */ `
  mutation UpdateCommunityReply(
    $input: UpdateCommunityReplyInput!
    $condition: ModelCommunityReplyConditionInput
  ) {
    updateCommunityReply(input: $input, condition: $condition) {
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
export const deleteCommunityReply = /* GraphQL */ `
  mutation DeleteCommunityReply(
    $input: DeleteCommunityReplyInput!
    $condition: ModelCommunityReplyConditionInput
  ) {
    deleteCommunityReply(input: $input, condition: $condition) {
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
export const createCommunityDiscussion = /* GraphQL */ `
  mutation CreateCommunityDiscussion(
    $input: CreateCommunityDiscussionInput!
    $condition: ModelCommunityDiscussionConditionInput
  ) {
    createCommunityDiscussion(input: $input, condition: $condition) {
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
export const updateCommunityDiscussion = /* GraphQL */ `
  mutation UpdateCommunityDiscussion(
    $input: UpdateCommunityDiscussionInput!
    $condition: ModelCommunityDiscussionConditionInput
  ) {
    updateCommunityDiscussion(input: $input, condition: $condition) {
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
export const deleteCommunityDiscussion = /* GraphQL */ `
  mutation DeleteCommunityDiscussion(
    $input: DeleteCommunityDiscussionInput!
    $condition: ModelCommunityDiscussionConditionInput
  ) {
    deleteCommunityDiscussion(input: $input, condition: $condition) {
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
export const createPostComment = /* GraphQL */ `
  mutation CreatePostComment(
    $input: CreatePostCommentInput!
    $condition: ModelPostCommentConditionInput
  ) {
    createPostComment(input: $input, condition: $condition) {
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
export const updatePostComment = /* GraphQL */ `
  mutation UpdatePostComment(
    $input: UpdatePostCommentInput!
    $condition: ModelPostCommentConditionInput
  ) {
    updatePostComment(input: $input, condition: $condition) {
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
export const deletePostComment = /* GraphQL */ `
  mutation DeletePostComment(
    $input: DeletePostCommentInput!
    $condition: ModelPostCommentConditionInput
  ) {
    deletePostComment(input: $input, condition: $condition) {
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
export const createPostLike = /* GraphQL */ `
  mutation CreatePostLike(
    $input: CreatePostLikeInput!
    $condition: ModelPostLikeConditionInput
  ) {
    createPostLike(input: $input, condition: $condition) {
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
export const updatePostLike = /* GraphQL */ `
  mutation UpdatePostLike(
    $input: UpdatePostLikeInput!
    $condition: ModelPostLikeConditionInput
  ) {
    updatePostLike(input: $input, condition: $condition) {
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
export const deletePostLike = /* GraphQL */ `
  mutation DeletePostLike(
    $input: DeletePostLikeInput!
    $condition: ModelPostLikeConditionInput
  ) {
    deletePostLike(input: $input, condition: $condition) {
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
export const createRealtorReview = /* GraphQL */ `
  mutation CreateRealtorReview(
    $input: CreateRealtorReviewInput!
    $condition: ModelRealtorReviewConditionInput
  ) {
    createRealtorReview(input: $input, condition: $condition) {
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
export const updateRealtorReview = /* GraphQL */ `
  mutation UpdateRealtorReview(
    $input: UpdateRealtorReviewInput!
    $condition: ModelRealtorReviewConditionInput
  ) {
    updateRealtorReview(input: $input, condition: $condition) {
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
export const deleteRealtorReview = /* GraphQL */ `
  mutation DeleteRealtorReview(
    $input: DeleteRealtorReviewInput!
    $condition: ModelRealtorReviewConditionInput
  ) {
    deleteRealtorReview(input: $input, condition: $condition) {
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
export const createPostReview = /* GraphQL */ `
  mutation CreatePostReview(
    $input: CreatePostReviewInput!
    $condition: ModelPostReviewConditionInput
  ) {
    createPostReview(input: $input, condition: $condition) {
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
export const updatePostReview = /* GraphQL */ `
  mutation UpdatePostReview(
    $input: UpdatePostReviewInput!
    $condition: ModelPostReviewConditionInput
  ) {
    updatePostReview(input: $input, condition: $condition) {
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
export const deletePostReview = /* GraphQL */ `
  mutation DeletePostReview(
    $input: DeletePostReviewInput!
    $condition: ModelPostReviewConditionInput
  ) {
    deletePostReview(input: $input, condition: $condition) {
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
export const createBooking = /* GraphQL */ `
  mutation CreateBooking(
    $input: CreateBookingInput!
    $condition: ModelBookingConditionInput
  ) {
    createBooking(input: $input, condition: $condition) {
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
export const updateBooking = /* GraphQL */ `
  mutation UpdateBooking(
    $input: UpdateBookingInput!
    $condition: ModelBookingConditionInput
  ) {
    updateBooking(input: $input, condition: $condition) {
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
export const deleteBooking = /* GraphQL */ `
  mutation DeleteBooking(
    $input: DeleteBookingInput!
    $condition: ModelBookingConditionInput
  ) {
    deleteBooking(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createVendorScanner = /* GraphQL */ `
  mutation CreateVendorScanner(
    $input: CreateVendorScannerInput!
    $condition: ModelVendorScannerConditionInput
  ) {
    createVendorScanner(input: $input, condition: $condition) {
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
export const updateVendorScanner = /* GraphQL */ `
  mutation UpdateVendorScanner(
    $input: UpdateVendorScannerInput!
    $condition: ModelVendorScannerConditionInput
  ) {
    updateVendorScanner(input: $input, condition: $condition) {
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
export const deleteVendorScanner = /* GraphQL */ `
  mutation DeleteVendorScanner(
    $input: DeleteVendorScannerInput!
    $condition: ModelVendorScannerConditionInput
  ) {
    deleteVendorScanner(input: $input, condition: $condition) {
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
export const createRealtor = /* GraphQL */ `
  mutation CreateRealtor(
    $input: CreateRealtorInput!
    $condition: ModelRealtorConditionInput
  ) {
    createRealtor(input: $input, condition: $condition) {
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
export const updateRealtor = /* GraphQL */ `
  mutation UpdateRealtor(
    $input: UpdateRealtorInput!
    $condition: ModelRealtorConditionInput
  ) {
    updateRealtor(input: $input, condition: $condition) {
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
export const deleteRealtor = /* GraphQL */ `
  mutation DeleteRealtor(
    $input: DeleteRealtorInput!
    $condition: ModelRealtorConditionInput
  ) {
    deleteRealtor(input: $input, condition: $condition) {
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
export const createBookingPostOptions = /* GraphQL */ `
  mutation CreateBookingPostOptions(
    $input: CreateBookingPostOptionsInput!
    $condition: ModelBookingPostOptionsConditionInput
  ) {
    createBookingPostOptions(input: $input, condition: $condition) {
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
export const updateBookingPostOptions = /* GraphQL */ `
  mutation UpdateBookingPostOptions(
    $input: UpdateBookingPostOptionsInput!
    $condition: ModelBookingPostOptionsConditionInput
  ) {
    updateBookingPostOptions(input: $input, condition: $condition) {
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
export const deleteBookingPostOptions = /* GraphQL */ `
  mutation DeleteBookingPostOptions(
    $input: DeleteBookingPostOptionsInput!
    $condition: ModelBookingPostOptionsConditionInput
  ) {
    deleteBookingPostOptions(input: $input, condition: $condition) {
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
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
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
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
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
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
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
