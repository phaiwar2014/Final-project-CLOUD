/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type BookingCreateFormInputValues = {
    customerName?: string;
    phoneNumber?: string;
    carBrand?: string;
    carYear?: string;
    licensePlate?: string;
    mileage?: number;
    selectedItems?: string;
    totalPrice?: number;
    bookingDate?: string;
    bookingTime?: string;
    status?: string;
    mechanicName?: string;
    actualMileage?: number;
};
export declare type BookingCreateFormValidationValues = {
    customerName?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    carBrand?: ValidationFunction<string>;
    carYear?: ValidationFunction<string>;
    licensePlate?: ValidationFunction<string>;
    mileage?: ValidationFunction<number>;
    selectedItems?: ValidationFunction<string>;
    totalPrice?: ValidationFunction<number>;
    bookingDate?: ValidationFunction<string>;
    bookingTime?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    mechanicName?: ValidationFunction<string>;
    actualMileage?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BookingCreateFormOverridesProps = {
    BookingCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    customerName?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    carBrand?: PrimitiveOverrideProps<TextFieldProps>;
    carYear?: PrimitiveOverrideProps<TextFieldProps>;
    licensePlate?: PrimitiveOverrideProps<TextFieldProps>;
    mileage?: PrimitiveOverrideProps<TextFieldProps>;
    selectedItems?: PrimitiveOverrideProps<TextFieldProps>;
    totalPrice?: PrimitiveOverrideProps<TextFieldProps>;
    bookingDate?: PrimitiveOverrideProps<TextFieldProps>;
    bookingTime?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    mechanicName?: PrimitiveOverrideProps<TextFieldProps>;
    actualMileage?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BookingCreateFormProps = React.PropsWithChildren<{
    overrides?: BookingCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: BookingCreateFormInputValues) => BookingCreateFormInputValues;
    onSuccess?: (fields: BookingCreateFormInputValues) => void;
    onError?: (fields: BookingCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BookingCreateFormInputValues) => BookingCreateFormInputValues;
    onValidate?: BookingCreateFormValidationValues;
} & React.CSSProperties>;
export default function BookingCreateForm(props: BookingCreateFormProps): React.ReactElement;
