/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { Realtor } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function RealtorUpdateForm(props) {
  const {
    id: idProp,
    realtor: realtorModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    sub: "",
    firstName: "",
    lastName: "",
    username: "",
    myDescription: "",
    profilePic: "",
    email: "",
    address: "",
    phoneNumber: "",
    bankName: "",
    bankCode: "",
    accountName: "",
    accountNumber: "",
    push_token: "",
    isVerified: false,
    isPartner: false,
    isPremium: false,
    isElite: false,
    isTrusted: false,
  };
  const [sub, setSub] = React.useState(initialValues.sub);
  const [firstName, setFirstName] = React.useState(initialValues.firstName);
  const [lastName, setLastName] = React.useState(initialValues.lastName);
  const [username, setUsername] = React.useState(initialValues.username);
  const [myDescription, setMyDescription] = React.useState(
    initialValues.myDescription
  );
  const [profilePic, setProfilePic] = React.useState(initialValues.profilePic);
  const [email, setEmail] = React.useState(initialValues.email);
  const [address, setAddress] = React.useState(initialValues.address);
  const [phoneNumber, setPhoneNumber] = React.useState(
    initialValues.phoneNumber
  );
  const [bankName, setBankName] = React.useState(initialValues.bankName);
  const [bankCode, setBankCode] = React.useState(initialValues.bankCode);
  const [accountName, setAccountName] = React.useState(
    initialValues.accountName
  );
  const [accountNumber, setAccountNumber] = React.useState(
    initialValues.accountNumber
  );
  const [push_token, setPush_token] = React.useState(initialValues.push_token);
  const [isVerified, setIsVerified] = React.useState(initialValues.isVerified);
  const [isPartner, setIsPartner] = React.useState(initialValues.isPartner);
  const [isPremium, setIsPremium] = React.useState(initialValues.isPremium);
  const [isElite, setIsElite] = React.useState(initialValues.isElite);
  const [isTrusted, setIsTrusted] = React.useState(initialValues.isTrusted);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = realtorRecord
      ? { ...initialValues, ...realtorRecord }
      : initialValues;
    setSub(cleanValues.sub);
    setFirstName(cleanValues.firstName);
    setLastName(cleanValues.lastName);
    setUsername(cleanValues.username);
    setMyDescription(cleanValues.myDescription);
    setProfilePic(cleanValues.profilePic);
    setEmail(cleanValues.email);
    setAddress(cleanValues.address);
    setPhoneNumber(cleanValues.phoneNumber);
    setBankName(cleanValues.bankName);
    setBankCode(cleanValues.bankCode);
    setAccountName(cleanValues.accountName);
    setAccountNumber(cleanValues.accountNumber);
    setPush_token(cleanValues.push_token);
    setIsVerified(cleanValues.isVerified);
    setIsPartner(cleanValues.isPartner);
    setIsPremium(cleanValues.isPremium);
    setIsElite(cleanValues.isElite);
    setIsTrusted(cleanValues.isTrusted);
    setErrors({});
  };
  const [realtorRecord, setRealtorRecord] = React.useState(realtorModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Realtor, idProp)
        : realtorModelProp;
      setRealtorRecord(record);
    };
    queryData();
  }, [idProp, realtorModelProp]);
  React.useEffect(resetStateValues, [realtorRecord]);
  const validations = {
    sub: [{ type: "Required" }],
    firstName: [],
    lastName: [],
    username: [],
    myDescription: [],
    profilePic: [],
    email: [],
    address: [],
    phoneNumber: [],
    bankName: [],
    bankCode: [],
    accountName: [],
    accountNumber: [],
    push_token: [],
    isVerified: [],
    isPartner: [],
    isPremium: [],
    isElite: [],
    isTrusted: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          sub,
          firstName,
          lastName,
          username,
          myDescription,
          profilePic,
          email,
          address,
          phoneNumber,
          bankName,
          bankCode,
          accountName,
          accountNumber,
          push_token,
          isVerified,
          isPartner,
          isPremium,
          isElite,
          isTrusted,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await DataStore.save(
            Realtor.copyOf(realtorRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "RealtorUpdateForm")}
      {...rest}
    >
      <TextField
        label="Sub"
        isRequired={true}
        isReadOnly={false}
        value={sub}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub: value,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.sub ?? value;
          }
          if (errors.sub?.hasError) {
            runValidationTasks("sub", value);
          }
          setSub(value);
        }}
        onBlur={() => runValidationTasks("sub", sub)}
        errorMessage={errors.sub?.errorMessage}
        hasError={errors.sub?.hasError}
        {...getOverrideProps(overrides, "sub")}
      ></TextField>
      <TextField
        label="First name"
        isRequired={false}
        isReadOnly={false}
        value={firstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName: value,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.firstName ?? value;
          }
          if (errors.firstName?.hasError) {
            runValidationTasks("firstName", value);
          }
          setFirstName(value);
        }}
        onBlur={() => runValidationTasks("firstName", firstName)}
        errorMessage={errors.firstName?.errorMessage}
        hasError={errors.firstName?.hasError}
        {...getOverrideProps(overrides, "firstName")}
      ></TextField>
      <TextField
        label="Last name"
        isRequired={false}
        isReadOnly={false}
        value={lastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName: value,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.lastName ?? value;
          }
          if (errors.lastName?.hasError) {
            runValidationTasks("lastName", value);
          }
          setLastName(value);
        }}
        onBlur={() => runValidationTasks("lastName", lastName)}
        errorMessage={errors.lastName?.errorMessage}
        hasError={errors.lastName?.hasError}
        {...getOverrideProps(overrides, "lastName")}
      ></TextField>
      <TextField
        label="Username"
        isRequired={false}
        isReadOnly={false}
        value={username}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username: value,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.username ?? value;
          }
          if (errors.username?.hasError) {
            runValidationTasks("username", value);
          }
          setUsername(value);
        }}
        onBlur={() => runValidationTasks("username", username)}
        errorMessage={errors.username?.errorMessage}
        hasError={errors.username?.hasError}
        {...getOverrideProps(overrides, "username")}
      ></TextField>
      <TextField
        label="My description"
        isRequired={false}
        isReadOnly={false}
        value={myDescription}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription: value,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.myDescription ?? value;
          }
          if (errors.myDescription?.hasError) {
            runValidationTasks("myDescription", value);
          }
          setMyDescription(value);
        }}
        onBlur={() => runValidationTasks("myDescription", myDescription)}
        errorMessage={errors.myDescription?.errorMessage}
        hasError={errors.myDescription?.hasError}
        {...getOverrideProps(overrides, "myDescription")}
      ></TextField>
      <TextField
        label="Profile pic"
        isRequired={false}
        isReadOnly={false}
        value={profilePic}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic: value,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.profilePic ?? value;
          }
          if (errors.profilePic?.hasError) {
            runValidationTasks("profilePic", value);
          }
          setProfilePic(value);
        }}
        onBlur={() => runValidationTasks("profilePic", profilePic)}
        errorMessage={errors.profilePic?.errorMessage}
        hasError={errors.profilePic?.hasError}
        {...getOverrideProps(overrides, "profilePic")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email: value,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        value={address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address: value,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.address ?? value;
          }
          if (errors.address?.hasError) {
            runValidationTasks("address", value);
          }
          setAddress(value);
        }}
        onBlur={() => runValidationTasks("address", address)}
        errorMessage={errors.address?.errorMessage}
        hasError={errors.address?.hasError}
        {...getOverrideProps(overrides, "address")}
      ></TextField>
      <TextField
        label="Phone number"
        isRequired={false}
        isReadOnly={false}
        value={phoneNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber: value,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.phoneNumber ?? value;
          }
          if (errors.phoneNumber?.hasError) {
            runValidationTasks("phoneNumber", value);
          }
          setPhoneNumber(value);
        }}
        onBlur={() => runValidationTasks("phoneNumber", phoneNumber)}
        errorMessage={errors.phoneNumber?.errorMessage}
        hasError={errors.phoneNumber?.hasError}
        {...getOverrideProps(overrides, "phoneNumber")}
      ></TextField>
      <TextField
        label="Bank name"
        isRequired={false}
        isReadOnly={false}
        value={bankName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName: value,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.bankName ?? value;
          }
          if (errors.bankName?.hasError) {
            runValidationTasks("bankName", value);
          }
          setBankName(value);
        }}
        onBlur={() => runValidationTasks("bankName", bankName)}
        errorMessage={errors.bankName?.errorMessage}
        hasError={errors.bankName?.hasError}
        {...getOverrideProps(overrides, "bankName")}
      ></TextField>
      <TextField
        label="Bank code"
        isRequired={false}
        isReadOnly={false}
        value={bankCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode: value,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.bankCode ?? value;
          }
          if (errors.bankCode?.hasError) {
            runValidationTasks("bankCode", value);
          }
          setBankCode(value);
        }}
        onBlur={() => runValidationTasks("bankCode", bankCode)}
        errorMessage={errors.bankCode?.errorMessage}
        hasError={errors.bankCode?.hasError}
        {...getOverrideProps(overrides, "bankCode")}
      ></TextField>
      <TextField
        label="Account name"
        isRequired={false}
        isReadOnly={false}
        value={accountName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName: value,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.accountName ?? value;
          }
          if (errors.accountName?.hasError) {
            runValidationTasks("accountName", value);
          }
          setAccountName(value);
        }}
        onBlur={() => runValidationTasks("accountName", accountName)}
        errorMessage={errors.accountName?.errorMessage}
        hasError={errors.accountName?.hasError}
        {...getOverrideProps(overrides, "accountName")}
      ></TextField>
      <TextField
        label="Account number"
        isRequired={false}
        isReadOnly={false}
        value={accountNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber: value,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.accountNumber ?? value;
          }
          if (errors.accountNumber?.hasError) {
            runValidationTasks("accountNumber", value);
          }
          setAccountNumber(value);
        }}
        onBlur={() => runValidationTasks("accountNumber", accountNumber)}
        errorMessage={errors.accountNumber?.errorMessage}
        hasError={errors.accountNumber?.hasError}
        {...getOverrideProps(overrides, "accountNumber")}
      ></TextField>
      <TextField
        label="Push token"
        isRequired={false}
        isReadOnly={false}
        value={push_token}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token: value,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.push_token ?? value;
          }
          if (errors.push_token?.hasError) {
            runValidationTasks("push_token", value);
          }
          setPush_token(value);
        }}
        onBlur={() => runValidationTasks("push_token", push_token)}
        errorMessage={errors.push_token?.errorMessage}
        hasError={errors.push_token?.hasError}
        {...getOverrideProps(overrides, "push_token")}
      ></TextField>
      <SwitchField
        label="Is verified"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isVerified}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified: value,
              isPartner,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.isVerified ?? value;
          }
          if (errors.isVerified?.hasError) {
            runValidationTasks("isVerified", value);
          }
          setIsVerified(value);
        }}
        onBlur={() => runValidationTasks("isVerified", isVerified)}
        errorMessage={errors.isVerified?.errorMessage}
        hasError={errors.isVerified?.hasError}
        {...getOverrideProps(overrides, "isVerified")}
      ></SwitchField>
      <SwitchField
        label="Is partner"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isPartner}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner: value,
              isPremium,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.isPartner ?? value;
          }
          if (errors.isPartner?.hasError) {
            runValidationTasks("isPartner", value);
          }
          setIsPartner(value);
        }}
        onBlur={() => runValidationTasks("isPartner", isPartner)}
        errorMessage={errors.isPartner?.errorMessage}
        hasError={errors.isPartner?.hasError}
        {...getOverrideProps(overrides, "isPartner")}
      ></SwitchField>
      <SwitchField
        label="Is premium"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isPremium}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium: value,
              isElite,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.isPremium ?? value;
          }
          if (errors.isPremium?.hasError) {
            runValidationTasks("isPremium", value);
          }
          setIsPremium(value);
        }}
        onBlur={() => runValidationTasks("isPremium", isPremium)}
        errorMessage={errors.isPremium?.errorMessage}
        hasError={errors.isPremium?.hasError}
        {...getOverrideProps(overrides, "isPremium")}
      ></SwitchField>
      <SwitchField
        label="Is elite"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isElite}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite: value,
              isTrusted,
            };
            const result = onChange(modelFields);
            value = result?.isElite ?? value;
          }
          if (errors.isElite?.hasError) {
            runValidationTasks("isElite", value);
          }
          setIsElite(value);
        }}
        onBlur={() => runValidationTasks("isElite", isElite)}
        errorMessage={errors.isElite?.errorMessage}
        hasError={errors.isElite?.hasError}
        {...getOverrideProps(overrides, "isElite")}
      ></SwitchField>
      <SwitchField
        label="Is trusted"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isTrusted}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              username,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankName,
              bankCode,
              accountName,
              accountNumber,
              push_token,
              isVerified,
              isPartner,
              isPremium,
              isElite,
              isTrusted: value,
            };
            const result = onChange(modelFields);
            value = result?.isTrusted ?? value;
          }
          if (errors.isTrusted?.hasError) {
            runValidationTasks("isTrusted", value);
          }
          setIsTrusted(value);
        }}
        onBlur={() => runValidationTasks("isTrusted", isTrusted)}
        errorMessage={errors.isTrusted?.errorMessage}
        hasError={errors.isTrusted?.hasError}
        {...getOverrideProps(overrides, "isTrusted")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || realtorModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || realtorModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
