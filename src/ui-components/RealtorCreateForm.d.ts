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
export declare type RealtorCreateFormInputValues = {
    sub?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    myDescription?: string;
    profilePic?: string;
    email?: string;
    address?: string;
    phoneNumber?: string;
    bankname?: string;
    accountName?: string;
    accountNumber?: string;
    push_token?: string;
    isVerified?: boolean;
    isPartner?: boolean;
    isPremium?: boolean;
    isElite?: boolean;
    isTrusted?: boolean;
};
export declare type RealtorCreateFormValidationValues = {
    sub?: ValidationFunction<string>;
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    username?: ValidationFunction<string>;
    myDescription?: ValidationFunction<string>;
    profilePic?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    bankname?: ValidationFunction<string>;
    accountName?: ValidationFunction<string>;
    accountNumber?: ValidationFunction<string>;
    push_token?: ValidationFunction<string>;
    isVerified?: ValidationFunction<boolean>;
    isPartner?: ValidationFunction<boolean>;
    isPremium?: ValidationFunction<boolean>;
    isElite?: ValidationFunction<boolean>;
    isTrusted?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RealtorCreateFormOverridesProps = {
    RealtorCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    sub?: PrimitiveOverrideProps<TextFieldProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    username?: PrimitiveOverrideProps<TextFieldProps>;
    myDescription?: PrimitiveOverrideProps<TextFieldProps>;
    profilePic?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    bankname?: PrimitiveOverrideProps<TextFieldProps>;
    accountName?: PrimitiveOverrideProps<TextFieldProps>;
    accountNumber?: PrimitiveOverrideProps<TextFieldProps>;
    push_token?: PrimitiveOverrideProps<TextFieldProps>;
    isVerified?: PrimitiveOverrideProps<SwitchFieldProps>;
    isPartner?: PrimitiveOverrideProps<SwitchFieldProps>;
    isPremium?: PrimitiveOverrideProps<SwitchFieldProps>;
    isElite?: PrimitiveOverrideProps<SwitchFieldProps>;
    isTrusted?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type RealtorCreateFormProps = React.PropsWithChildren<{
    overrides?: RealtorCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: RealtorCreateFormInputValues) => RealtorCreateFormInputValues;
    onSuccess?: (fields: RealtorCreateFormInputValues) => void;
    onError?: (fields: RealtorCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RealtorCreateFormInputValues) => RealtorCreateFormInputValues;
    onValidate?: RealtorCreateFormValidationValues;
} & React.CSSProperties>;
export default function RealtorCreateForm(props: RealtorCreateFormProps): React.ReactElement;
