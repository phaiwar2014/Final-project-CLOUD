/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBooking = /* GraphQL */ `
  query GetBooking($id: ID!) {
    getBooking(id: $id) {
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
export const listBookings = /* GraphQL */ `
  query ListBookings(
    $filter: ModelBookingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getPart = /* GraphQL */ `
  query GetPart($id: ID!) {
    getPart(id: $id) {
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
export const listParts = /* GraphQL */ `
  query ListParts(
    $filter: ModelPartFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listParts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getStoreConfig = /* GraphQL */ `
  query GetStoreConfig($id: ID!) {
    getStoreConfig(id: $id) {
      id
      blockedDates
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listStoreConfigs = /* GraphQL */ `
  query ListStoreConfigs(
    $filter: ModelStoreConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStoreConfigs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        blockedDates
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
