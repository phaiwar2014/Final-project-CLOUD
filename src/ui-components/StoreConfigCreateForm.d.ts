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
export declare type StoreConfigCreateFormInputValues = {
    blockedDates?: string[];
};
export declare type StoreConfigCreateFormValidationValues = {
    blockedDates?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type StoreConfigCreateFormOverridesProps = {
    StoreConfigCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    blockedDates?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type StoreConfigCreateFormProps = React.PropsWithChildren<{
    overrides?: StoreConfigCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: StoreConfigCreateFormInputValues) => StoreConfigCreateFormInputValues;
    onSuccess?: (fields: StoreConfigCreateFormInputValues) => void;
    onError?: (fields: StoreConfigCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: StoreConfigCreateFormInputValues) => StoreConfigCreateFormInputValues;
    onValidate?: StoreConfigCreateFormValidationValues;
} & React.CSSProperties>;
export default function StoreConfigCreateForm(props: StoreConfigCreateFormProps): React.ReactElement;
