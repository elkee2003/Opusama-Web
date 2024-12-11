/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Realtor } from "../models";
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
export declare type RealtorUpdateFormInputValues = {
    sub?: string;
    firstName?: string;
    lastName?: string;
    myDescription?: string;
    profilePic?: string;
    email?: string;
    address?: string;
    phoneNumber?: string;
    bankname?: string;
    accountName?: string;
    accountNumber?: string;
    push_token?: string;
};
export declare type RealtorUpdateFormValidationValues = {
    sub?: ValidationFunction<string>;
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    myDescription?: ValidationFunction<string>;
    profilePic?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    bankname?: ValidationFunction<string>;
    accountName?: ValidationFunction<string>;
    accountNumber?: ValidationFunction<string>;
    push_token?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RealtorUpdateFormOverridesProps = {
    RealtorUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    sub?: PrimitiveOverrideProps<TextFieldProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    myDescription?: PrimitiveOverrideProps<TextFieldProps>;
    profilePic?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    bankname?: PrimitiveOverrideProps<TextFieldProps>;
    accountName?: PrimitiveOverrideProps<TextFieldProps>;
    accountNumber?: PrimitiveOverrideProps<TextFieldProps>;
    push_token?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RealtorUpdateFormProps = React.PropsWithChildren<{
    overrides?: RealtorUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    realtor?: Realtor;
    onSubmit?: (fields: RealtorUpdateFormInputValues) => RealtorUpdateFormInputValues;
    onSuccess?: (fields: RealtorUpdateFormInputValues) => void;
    onError?: (fields: RealtorUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RealtorUpdateFormInputValues) => RealtorUpdateFormInputValues;
    onValidate?: RealtorUpdateFormValidationValues;
} & React.CSSProperties>;
export default function RealtorUpdateForm(props: RealtorUpdateFormProps): React.ReactElement;
