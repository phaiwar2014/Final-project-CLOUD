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
export declare type PartUpdateFormInputValues = {
    categoryKey?: string;
    categoryName?: string;
    name?: string;
    price?: number;
    isFixed?: boolean;
};
export declare type PartUpdateFormValidationValues = {
    categoryKey?: ValidationFunction<string>;
    categoryName?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    price?: ValidationFunction<number>;
    isFixed?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PartUpdateFormOverridesProps = {
    PartUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    categoryKey?: PrimitiveOverrideProps<TextFieldProps>;
    categoryName?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    price?: PrimitiveOverrideProps<TextFieldProps>;
    isFixed?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type PartUpdateFormProps = React.PropsWithChildren<{
    overrides?: PartUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    part?: any;
    onSubmit?: (fields: PartUpdateFormInputValues) => PartUpdateFormInputValues;
    onSuccess?: (fields: PartUpdateFormInputValues) => void;
    onError?: (fields: PartUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PartUpdateFormInputValues) => PartUpdateFormInputValues;
    onValidate?: PartUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PartUpdateForm(props: PartUpdateFormProps): React.ReactElement;
