/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createBooking } from "../graphql/mutations";
const client = generateClient();
export default function BookingCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    customerName: "",
    phoneNumber: "",
    carBrand: "",
    carYear: "",
    licensePlate: "",
    mileage: "",
    selectedItems: "",
    totalPrice: "",
    bookingDate: "",
    bookingTime: "",
    status: "",
  };
  const [customerName, setCustomerName] = React.useState(
    initialValues.customerName
  );
  const [phoneNumber, setPhoneNumber] = React.useState(
    initialValues.phoneNumber
  );
  const [carBrand, setCarBrand] = React.useState(initialValues.carBrand);
  const [carYear, setCarYear] = React.useState(initialValues.carYear);
  const [licensePlate, setLicensePlate] = React.useState(
    initialValues.licensePlate
  );
  const [mileage, setMileage] = React.useState(initialValues.mileage);
  const [selectedItems, setSelectedItems] = React.useState(
    initialValues.selectedItems
  );
  const [totalPrice, setTotalPrice] = React.useState(initialValues.totalPrice);
  const [bookingDate, setBookingDate] = React.useState(
    initialValues.bookingDate
  );
  const [bookingTime, setBookingTime] = React.useState(
    initialValues.bookingTime
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setCustomerName(initialValues.customerName);
    setPhoneNumber(initialValues.phoneNumber);
    setCarBrand(initialValues.carBrand);
    setCarYear(initialValues.carYear);
    setLicensePlate(initialValues.licensePlate);
    setMileage(initialValues.mileage);
    setSelectedItems(initialValues.selectedItems);
    setTotalPrice(initialValues.totalPrice);
    setBookingDate(initialValues.bookingDate);
    setBookingTime(initialValues.bookingTime);
    setStatus(initialValues.status);
    setErrors({});
  };
  const validations = {
    customerName: [{ type: "Required" }],
    phoneNumber: [{ type: "Required" }],
    carBrand: [{ type: "Required" }],
    carYear: [{ type: "Required" }],
    licensePlate: [{ type: "Required" }],
    mileage: [{ type: "Required" }],
    selectedItems: [{ type: "Required" }],
    totalPrice: [{ type: "Required" }],
    bookingDate: [{ type: "Required" }],
    bookingTime: [{ type: "Required" }],
    status: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          customerName,
          phoneNumber,
          carBrand,
          carYear,
          licensePlate,
          mileage,
          selectedItems,
          totalPrice,
          bookingDate,
          bookingTime,
          status,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createBooking.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "BookingCreateForm")}
      {...rest}
    >
      <TextField
        label="Customer name"
        isRequired={true}
        isReadOnly={false}
        value={customerName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              customerName: value,
              phoneNumber,
              carBrand,
              carYear,
              licensePlate,
              mileage,
              selectedItems,
              totalPrice,
              bookingDate,
              bookingTime,
              status,
            };
            const result = onChange(modelFields);
            value = result?.customerName ?? value;
          }
          if (errors.customerName?.hasError) {
            runValidationTasks("customerName", value);
          }
          setCustomerName(value);
        }}
        onBlur={() => runValidationTasks("customerName", customerName)}
        errorMessage={errors.customerName?.errorMessage}
        hasError={errors.customerName?.hasError}
        {...getOverrideProps(overrides, "customerName")}
      ></TextField>
      <TextField
        label="Phone number"
        isRequired={true}
        isReadOnly={false}
        value={phoneNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              customerName,
              phoneNumber: value,
              carBrand,
              carYear,
              licensePlate,
              mileage,
              selectedItems,
              totalPrice,
              bookingDate,
              bookingTime,
              status,
            };
            const result = onChange(modelFields);
            value = result?.phoneNumber ?? value;
          }
          if (errors.phoneNumber?.hasError) {
            runValidationTasks("phoneNumber", value);
          }
          setPhoneNumber(value);
        }}
        onBlur={() => runValidationTasks("phoneNumber", phoneNumber)}
        errorMessage={errors.phoneNumber?.errorMessage}
        hasError={errors.phoneNumber?.hasError}
        {...getOverrideProps(overrides, "phoneNumber")}
      ></TextField>
      <TextField
        label="Car brand"
        isRequired={true}
        isReadOnly={false}
        value={carBrand}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              customerName,
              phoneNumber,
              carBrand: value,
              carYear,
              licensePlate,
              mileage,
              selectedItems,
              totalPrice,
              bookingDate,
              bookingTime,
              status,
            };
            const result = onChange(modelFields);
            value = result?.carBrand ?? value;
          }
          if (errors.carBrand?.hasError) {
            runValidationTasks("carBrand", value);
          }
          setCarBrand(value);
        }}
        onBlur={() => runValidationTasks("carBrand", carBrand)}
        errorMessage={errors.carBrand?.errorMessage}
        hasError={errors.carBrand?.hasError}
        {...getOverrideProps(overrides, "carBrand")}
      ></TextField>
      <TextField
        label="Car year"
        isRequired={true}
        isReadOnly={false}
        value={carYear}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              customerName,
              phoneNumber,
              carBrand,
              carYear: value,
              licensePlate,
              mileage,
              selectedItems,
              totalPrice,
              bookingDate,
              bookingTime,
              status,
            };
            const result = onChange(modelFields);
            value = result?.carYear ?? value;
          }
          if (errors.carYear?.hasError) {
            runValidationTasks("carYear", value);
          }
          setCarYear(value);
        }}
        onBlur={() => runValidationTasks("carYear", carYear)}
        errorMessage={errors.carYear?.errorMessage}
        hasError={errors.carYear?.hasError}
        {...getOverrideProps(overrides, "carYear")}
      ></TextField>
      <TextField
        label="License plate"
        isRequired={true}
        isReadOnly={false}
        value={licensePlate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              customerName,
              phoneNumber,
              carBrand,
              carYear,
              licensePlate: value,
              mileage,
              selectedItems,
              totalPrice,
              bookingDate,
              bookingTime,
              status,
            };
            const result = onChange(modelFields);
            value = result?.licensePlate ?? value;
          }
          if (errors.licensePlate?.hasError) {
            runValidationTasks("licensePlate", value);
          }
          setLicensePlate(value);
        }}
        onBlur={() => runValidationTasks("licensePlate", licensePlate)}
        errorMessage={errors.licensePlate?.errorMessage}
        hasError={errors.licensePlate?.hasError}
        {...getOverrideProps(overrides, "licensePlate")}
      ></TextField>
      <TextField
        label="Mileage"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={mileage}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              customerName,
              phoneNumber,
              carBrand,
              carYear,
              licensePlate,
              mileage: value,
              selectedItems,
              totalPrice,
              bookingDate,
              bookingTime,
              status,
            };
            const result = onChange(modelFields);
            value = result?.mileage ?? value;
          }
          if (errors.mileage?.hasError) {
            runValidationTasks("mileage", value);
          }
          setMileage(value);
        }}
        onBlur={() => runValidationTasks("mileage", mileage)}
        errorMessage={errors.mileage?.errorMessage}
        hasError={errors.mileage?.hasError}
        {...getOverrideProps(overrides, "mileage")}
      ></TextField>
      <TextField
        label="Selected items"
        isRequired={true}
        isReadOnly={false}
        value={selectedItems}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              customerName,
              phoneNumber,
              carBrand,
              carYear,
              licensePlate,
              mileage,
              selectedItems: value,
              totalPrice,
              bookingDate,
              bookingTime,
              status,
            };
            const result = onChange(modelFields);
            value = result?.selectedItems ?? value;
          }
          if (errors.selectedItems?.hasError) {
            runValidationTasks("selectedItems", value);
          }
          setSelectedItems(value);
        }}
        onBlur={() => runValidationTasks("selectedItems", selectedItems)}
        errorMessage={errors.selectedItems?.errorMessage}
        hasError={errors.selectedItems?.hasError}
        {...getOverrideProps(overrides, "selectedItems")}
      ></TextField>
      <TextField
        label="Total price"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalPrice}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              customerName,
              phoneNumber,
              carBrand,
              carYear,
              licensePlate,
              mileage,
              selectedItems,
              totalPrice: value,
              bookingDate,
              bookingTime,
              status,
            };
            const result = onChange(modelFields);
            value = result?.totalPrice ?? value;
          }
          if (errors.totalPrice?.hasError) {
            runValidationTasks("totalPrice", value);
          }
          setTotalPrice(value);
        }}
        onBlur={() => runValidationTasks("totalPrice", totalPrice)}
        errorMessage={errors.totalPrice?.errorMessage}
        hasError={errors.totalPrice?.hasError}
        {...getOverrideProps(overrides, "totalPrice")}
      ></TextField>
      <TextField
        label="Booking date"
        isRequired={true}
        isReadOnly={false}
        type="date"
        value={bookingDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              customerName,
              phoneNumber,
              carBrand,
              carYear,
              licensePlate,
              mileage,
              selectedItems,
              totalPrice,
              bookingDate: value,
              bookingTime,
              status,
            };
            const result = onChange(modelFields);
            value = result?.bookingDate ?? value;
          }
          if (errors.bookingDate?.hasError) {
            runValidationTasks("bookingDate", value);
          }
          setBookingDate(value);
        }}
        onBlur={() => runValidationTasks("bookingDate", bookingDate)}
        errorMessage={errors.bookingDate?.errorMessage}
        hasError={errors.bookingDate?.hasError}
        {...getOverrideProps(overrides, "bookingDate")}
      ></TextField>
      <TextField
        label="Booking time"
        isRequired={true}
        isReadOnly={false}
        type="time"
        value={bookingTime}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              customerName,
              phoneNumber,
              carBrand,
              carYear,
              licensePlate,
              mileage,
              selectedItems,
              totalPrice,
              bookingDate,
              bookingTime: value,
              status,
            };
            const result = onChange(modelFields);
            value = result?.bookingTime ?? value;
          }
          if (errors.bookingTime?.hasError) {
            runValidationTasks("bookingTime", value);
          }
          setBookingTime(value);
        }}
        onBlur={() => runValidationTasks("bookingTime", bookingTime)}
        errorMessage={errors.bookingTime?.errorMessage}
        hasError={errors.bookingTime?.hasError}
        {...getOverrideProps(overrides, "bookingTime")}
      ></TextField>
      <TextField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              customerName,
              phoneNumber,
              carBrand,
              carYear,
              licensePlate,
              mileage,
              selectedItems,
              totalPrice,
              bookingDate,
              bookingTime,
              status: value,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
