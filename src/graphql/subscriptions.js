/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBooking = /* GraphQL */ `
  subscription OnCreateBooking(
    $filter: ModelSubscriptionBookingFilterInput
    $owner: String
  ) {
    onCreateBooking(filter: $filter, owner: $owner) {
      id
      customerName
      phoneNumber
      carBrand
      carYear
      licensePlate
      mileage
      selectedItems
      totalPrice
      bookingDate
      bookingTime
      status
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateBooking = /* GraphQL */ `
  subscription OnUpdateBooking(
    $filter: ModelSubscriptionBookingFilterInput
    $owner: String
  ) {
    onUpdateBooking(filter: $filter, owner: $owner) {
      id
      customerName
      phoneNumber
      carBrand
      carYear
      licensePlate
      mileage
      selectedItems
      totalPrice
      bookingDate
      bookingTime
      status
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteBooking = /* GraphQL */ `
  subscription OnDeleteBooking(
    $filter: ModelSubscriptionBookingFilterInput
    $owner: String
  ) {
    onDeleteBooking(filter: $filter, owner: $owner) {
      id
      customerName
      phoneNumber
      carBrand
      carYear
      licensePlate
      mileage
      selectedItems
      totalPrice
      bookingDate
      bookingTime
      status
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreatePart = /* GraphQL */ `
  subscription OnCreatePart($filter: ModelSubscriptionPartFilterInput) {
    onCreatePart(filter: $filter) {
      id
      categoryKey
      categoryName
      name
      price
      isFixed
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdatePart = /* GraphQL */ `
  subscription OnUpdatePart($filter: ModelSubscriptionPartFilterInput) {
    onUpdatePart(filter: $filter) {
      id
      categoryKey
      categoryName
      name
      price
      isFixed
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeletePart = /* GraphQL */ `
  subscription OnDeletePart($filter: ModelSubscriptionPartFilterInput) {
    onDeletePart(filter: $filter) {
      id
      categoryKey
      categoryName
      name
      price
      isFixed
      createdAt
      updatedAt
      __typename
    }
  }
`;
