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
export declare type BookingUpdateFormInputValues = {
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
};
export declare type BookingUpdateFormValidationValues = {
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
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BookingUpdateFormOverridesProps = {
    BookingUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
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
} & EscapeHatchProps;
export declare type BookingUpdateFormProps = React.PropsWithChildren<{
    overrides?: BookingUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    booking?: any;
    onSubmit?: (fields: BookingUpdateFormInputValues) => BookingUpdateFormInputValues;
    onSuccess?: (fields: BookingUpdateFormInputValues) => void;
    onError?: (fields: BookingUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BookingUpdateFormInputValues) => BookingUpdateFormInputValues;
    onValidate?: BookingUpdateFormValidationValues;
} & React.CSSProperties>;
export default function BookingUpdateForm(props: BookingUpdateFormProps): React.ReactElement;
