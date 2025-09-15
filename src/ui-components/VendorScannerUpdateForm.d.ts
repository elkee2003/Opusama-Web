/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { VendorScanner } from "../models";
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
export declare type VendorScannerUpdateFormInputValues = {
    vendorID?: string;
    name?: string;
    token?: string;
    expiresAt?: string;
    isActive?: boolean;
};
export declare type VendorScannerUpdateFormValidationValues = {
    vendorID?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    token?: ValidationFunction<string>;
    expiresAt?: ValidationFunction<string>;
    isActive?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type VendorScannerUpdateFormOverridesProps = {
    VendorScannerUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    vendorID?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    token?: PrimitiveOverrideProps<TextFieldProps>;
    expiresAt?: PrimitiveOverrideProps<TextFieldProps>;
    isActive?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type VendorScannerUpdateFormProps = React.PropsWithChildren<{
    overrides?: VendorScannerUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    vendorScanner?: VendorScanner;
    onSubmit?: (fields: VendorScannerUpdateFormInputValues) => VendorScannerUpdateFormInputValues;
    onSuccess?: (fields: VendorScannerUpdateFormInputValues) => void;
    onError?: (fields: VendorScannerUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: VendorScannerUpdateFormInputValues) => VendorScannerUpdateFormInputValues;
    onValidate?: VendorScannerUpdateFormValidationValues;
} & React.CSSProperties>;
export default function VendorScannerUpdateForm(props: VendorScannerUpdateFormProps): React.ReactElement;
