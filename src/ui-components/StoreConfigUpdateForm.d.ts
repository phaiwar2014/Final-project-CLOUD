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
export declare type StoreConfigUpdateFormInputValues = {
    blockedDates?: string[];
};
export declare type StoreConfigUpdateFormValidationValues = {
    blockedDates?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type StoreConfigUpdateFormOverridesProps = {
    StoreConfigUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    blockedDates?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type StoreConfigUpdateFormProps = React.PropsWithChildren<{
    overrides?: StoreConfigUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    storeConfig?: any;
    onSubmit?: (fields: StoreConfigUpdateFormInputValues) => StoreConfigUpdateFormInputValues;
    onSuccess?: (fields: StoreConfigUpdateFormInputValues) => void;
    onError?: (fields: StoreConfigUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: StoreConfigUpdateFormInputValues) => StoreConfigUpdateFormInputValues;
    onValidate?: StoreConfigUpdateFormValidationValues;
} & React.CSSProperties>;
export default function StoreConfigUpdateForm(props: StoreConfigUpdateFormProps): React.ReactElement;
