/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { CommunityDiscussion } from "../models";
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
export declare type CommunityDiscussionUpdateFormInputValues = {
    category?: string;
    title?: string;
    content?: string;
    instigatorID?: string;
    media?: string[];
};
export declare type CommunityDiscussionUpdateFormValidationValues = {
    category?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    content?: ValidationFunction<string>;
    instigatorID?: ValidationFunction<string>;
    media?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CommunityDiscussionUpdateFormOverridesProps = {
    CommunityDiscussionUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    category?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    content?: PrimitiveOverrideProps<TextFieldProps>;
    instigatorID?: PrimitiveOverrideProps<TextFieldProps>;
    media?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CommunityDiscussionUpdateFormProps = React.PropsWithChildren<{
    overrides?: CommunityDiscussionUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    communityDiscussion?: CommunityDiscussion;
    onSubmit?: (fields: CommunityDiscussionUpdateFormInputValues) => CommunityDiscussionUpdateFormInputValues;
    onSuccess?: (fields: CommunityDiscussionUpdateFormInputValues) => void;
    onError?: (fields: CommunityDiscussionUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CommunityDiscussionUpdateFormInputValues) => CommunityDiscussionUpdateFormInputValues;
    onValidate?: CommunityDiscussionUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CommunityDiscussionUpdateForm(props: CommunityDiscussionUpdateFormProps): React.ReactElement;
