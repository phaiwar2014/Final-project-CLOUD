/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBooking = /* GraphQL */ `
  mutation CreateBooking(
    $input: CreateBookingInput!
    $condition: ModelBookingConditionInput
  ) {
    createBooking(input: $input, condition: $condition) {
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
      __typename
    }
  }
`;
export const createPart = /* GraphQL */ `
  mutation CreatePart(
    $input: CreatePartInput!
    $condition: ModelPartConditionInput
  ) {
    createPart(input: $input, condition: $condition) {
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
export const updatePart = /* GraphQL */ `
  mutation UpdatePart(
    $input: UpdatePartInput!
    $condition: ModelPartConditionInput
  ) {
    updatePart(input: $input, condition: $condition) {
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
export const deletePart = /* GraphQL */ `
  mutation DeletePart(
    $input: DeletePartInput!
    $condition: ModelPartConditionInput
  ) {
    deletePart(input: $input, condition: $condition) {
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
