/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBooking = /* GraphQL */ `
  subscription OnCreateBooking($filter: ModelSubscriptionBookingFilterInput) {
    onCreateBooking(filter: $filter) {
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
      mechanicName
      actualMileage
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateBooking = /* GraphQL */ `
  subscription OnUpdateBooking($filter: ModelSubscriptionBookingFilterInput) {
    onUpdateBooking(filter: $filter) {
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
      mechanicName
      actualMileage
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteBooking = /* GraphQL */ `
  subscription OnDeleteBooking($filter: ModelSubscriptionBookingFilterInput) {
    onDeleteBooking(filter: $filter) {
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
      mechanicName
      actualMileage
      createdAt
      updatedAt
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
      stock
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
      stock
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
      stock
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateStoreConfig = /* GraphQL */ `
  subscription OnCreateStoreConfig(
    $filter: ModelSubscriptionStoreConfigFilterInput
  ) {
    onCreateStoreConfig(filter: $filter) {
      id
      blockedDates
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateStoreConfig = /* GraphQL */ `
  subscription OnUpdateStoreConfig(
    $filter: ModelSubscriptionStoreConfigFilterInput
  ) {
    onUpdateStoreConfig(filter: $filter) {
      id
      blockedDates
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteStoreConfig = /* GraphQL */ `
  subscription OnDeleteStoreConfig(
    $filter: ModelSubscriptionStoreConfigFilterInput
  ) {
    onDeleteStoreConfig(filter: $filter) {
      id
      blockedDates
      createdAt
      updatedAt
      __typename
    }
  }
`;
