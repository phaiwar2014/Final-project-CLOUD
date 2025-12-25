/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type PartCreateFormInputValues = {
    categoryKey?: string;
    categoryName?: string;
    name?: string;
    price?: number;
    isFixed?: boolean;
    stock?: number;
};
export declare type PartCreateFormValidationValues = {
    categoryKey?: ValidationFunction<string>;
    categoryName?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    price?: ValidationFunction<number>;
    isFixed?: ValidationFunction<boolean>;
    stock?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PartCreateFormOverridesProps = {
    PartCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    categoryKey?: PrimitiveOverrideProps<TextFieldProps>;
    categoryName?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    price?: PrimitiveOverrideProps<TextFieldProps>;
    isFixed?: PrimitiveOverrideProps<SwitchFieldProps>;
    stock?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PartCreateFormProps = React.PropsWithChildren<{
    overrides?: PartCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PartCreateFormInputValues) => PartCreateFormInputValues;
    onSuccess?: (fields: PartCreateFormInputValues) => void;
    onError?: (fields: PartCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PartCreateFormInputValues) => PartCreateFormInputValues;
    onValidate?: PartCreateFormValidationValues;
} & React.CSSProperties>;
export default function PartCreateForm(props: PartCreateFormProps): React.ReactElement;
