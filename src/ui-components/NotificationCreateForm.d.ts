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
export declare type NotificationCreateFormInputValues = {
    creatorID?: string;
    recipientID?: string;
    recipientType?: string;
    type?: string;
    entityID?: string;
    message?: string;
    read?: boolean;
};
export declare type NotificationCreateFormValidationValues = {
    creatorID?: ValidationFunction<string>;
    recipientID?: ValidationFunction<string>;
    recipientType?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    entityID?: ValidationFunction<string>;
    message?: ValidationFunction<string>;
    read?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type NotificationCreateFormOverridesProps = {
    NotificationCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    creatorID?: PrimitiveOverrideProps<TextFieldProps>;
    recipientID?: PrimitiveOverrideProps<TextFieldProps>;
    recipientType?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    entityID?: PrimitiveOverrideProps<TextFieldProps>;
    message?: PrimitiveOverrideProps<TextFieldProps>;
    read?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type NotificationCreateFormProps = React.PropsWithChildren<{
    overrides?: NotificationCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: NotificationCreateFormInputValues) => NotificationCreateFormInputValues;
    onSuccess?: (fields: NotificationCreateFormInputValues) => void;
    onError?: (fields: NotificationCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: NotificationCreateFormInputValues) => NotificationCreateFormInputValues;
    onValidate?: NotificationCreateFormValidationValues;
} & React.CSSProperties>;
export default function NotificationCreateForm(props: NotificationCreateFormProps): React.ReactElement;
