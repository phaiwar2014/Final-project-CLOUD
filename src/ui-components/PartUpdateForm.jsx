/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getPart } from "../graphql/queries";
import { updatePart } from "../graphql/mutations";
const client = generateClient();
export default function PartUpdateForm(props) {
  const {
    id: idProp,
    part: partModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    categoryKey: "",
    categoryName: "",
    name: "",
    price: "",
    isFixed: false,
  };
  const [categoryKey, setCategoryKey] = React.useState(
    initialValues.categoryKey
  );
  const [categoryName, setCategoryName] = React.useState(
    initialValues.categoryName
  );
  const [name, setName] = React.useState(initialValues.name);
  const [price, setPrice] = React.useState(initialValues.price);
  const [isFixed, setIsFixed] = React.useState(initialValues.isFixed);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = partRecord
      ? { ...initialValues, ...partRecord }
      : initialValues;
    setCategoryKey(cleanValues.categoryKey);
    setCategoryName(cleanValues.categoryName);
    setName(cleanValues.name);
    setPrice(cleanValues.price);
    setIsFixed(cleanValues.isFixed);
    setErrors({});
  };
  const [partRecord, setPartRecord] = React.useState(partModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getPart.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getPart
        : partModelProp;
      setPartRecord(record);
    };
    queryData();
  }, [idProp, partModelProp]);
  React.useEffect(resetStateValues, [partRecord]);
  const validations = {
    categoryKey: [{ type: "Required" }],
    categoryName: [{ type: "Required" }],
    name: [{ type: "Required" }],
    price: [{ type: "Required" }],
    isFixed: [{ type: "Required" }],
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
          categoryKey,
          categoryName,
          name,
          price,
          isFixed,
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
            query: updatePart.replaceAll("__typename", ""),
            variables: {
              input: {
                id: partRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "PartUpdateForm")}
      {...rest}
    >
      <TextField
        label="Category key"
        isRequired={true}
        isReadOnly={false}
        value={categoryKey}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              categoryKey: value,
              categoryName,
              name,
              price,
              isFixed,
            };
            const result = onChange(modelFields);
            value = result?.categoryKey ?? value;
          }
          if (errors.categoryKey?.hasError) {
            runValidationTasks("categoryKey", value);
          }
          setCategoryKey(value);
        }}
        onBlur={() => runValidationTasks("categoryKey", categoryKey)}
        errorMessage={errors.categoryKey?.errorMessage}
        hasError={errors.categoryKey?.hasError}
        {...getOverrideProps(overrides, "categoryKey")}
      ></TextField>
      <TextField
        label="Category name"
        isRequired={true}
        isReadOnly={false}
        value={categoryName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              categoryKey,
              categoryName: value,
              name,
              price,
              isFixed,
            };
            const result = onChange(modelFields);
            value = result?.categoryName ?? value;
          }
          if (errors.categoryName?.hasError) {
            runValidationTasks("categoryName", value);
          }
          setCategoryName(value);
        }}
        onBlur={() => runValidationTasks("categoryName", categoryName)}
        errorMessage={errors.categoryName?.errorMessage}
        hasError={errors.categoryName?.hasError}
        {...getOverrideProps(overrides, "categoryName")}
      ></TextField>
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              categoryKey,
              categoryName,
              name: value,
              price,
              isFixed,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Price"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={price}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              categoryKey,
              categoryName,
              name,
              price: value,
              isFixed,
            };
            const result = onChange(modelFields);
            value = result?.price ?? value;
          }
          if (errors.price?.hasError) {
            runValidationTasks("price", value);
          }
          setPrice(value);
        }}
        onBlur={() => runValidationTasks("price", price)}
        errorMessage={errors.price?.errorMessage}
        hasError={errors.price?.hasError}
        {...getOverrideProps(overrides, "price")}
      ></TextField>
      <SwitchField
        label="Is fixed"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isFixed}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              categoryKey,
              categoryName,
              name,
              price,
              isFixed: value,
            };
            const result = onChange(modelFields);
            value = result?.isFixed ?? value;
          }
          if (errors.isFixed?.hasError) {
            runValidationTasks("isFixed", value);
          }
          setIsFixed(value);
        }}
        onBlur={() => runValidationTasks("isFixed", isFixed)}
        errorMessage={errors.isFixed?.errorMessage}
        hasError={errors.isFixed?.hasError}
        {...getOverrideProps(overrides, "isFixed")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || partModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || partModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
