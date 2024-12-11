/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { Realtor } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function RealtorCreateForm(props) {
  const {
    clearOnSuccess = true,
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
    myDescription: "",
    profilePic: "",
    email: "",
    address: "",
    phoneNumber: "",
    bankname: "",
    accountName: "",
    accountNumber: "",
    push_token: "",
  };
  const [sub, setSub] = React.useState(initialValues.sub);
  const [firstName, setFirstName] = React.useState(initialValues.firstName);
  const [lastName, setLastName] = React.useState(initialValues.lastName);
  const [myDescription, setMyDescription] = React.useState(
    initialValues.myDescription
  );
  const [profilePic, setProfilePic] = React.useState(initialValues.profilePic);
  const [email, setEmail] = React.useState(initialValues.email);
  const [address, setAddress] = React.useState(initialValues.address);
  const [phoneNumber, setPhoneNumber] = React.useState(
    initialValues.phoneNumber
  );
  const [bankname, setBankname] = React.useState(initialValues.bankname);
  const [accountName, setAccountName] = React.useState(
    initialValues.accountName
  );
  const [accountNumber, setAccountNumber] = React.useState(
    initialValues.accountNumber
  );
  const [push_token, setPush_token] = React.useState(initialValues.push_token);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setSub(initialValues.sub);
    setFirstName(initialValues.firstName);
    setLastName(initialValues.lastName);
    setMyDescription(initialValues.myDescription);
    setProfilePic(initialValues.profilePic);
    setEmail(initialValues.email);
    setAddress(initialValues.address);
    setPhoneNumber(initialValues.phoneNumber);
    setBankname(initialValues.bankname);
    setAccountName(initialValues.accountName);
    setAccountNumber(initialValues.accountNumber);
    setPush_token(initialValues.push_token);
    setErrors({});
  };
  const validations = {
    sub: [{ type: "Required" }],
    firstName: [],
    lastName: [],
    myDescription: [],
    profilePic: [],
    email: [],
    address: [],
    phoneNumber: [],
    bankname: [],
    accountName: [],
    accountNumber: [],
    push_token: [],
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
          myDescription,
          profilePic,
          email,
          address,
          phoneNumber,
          bankname,
          accountName,
          accountNumber,
          push_token,
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
          await DataStore.save(new Realtor(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "RealtorCreateForm")}
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
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankname,
              accountName,
              accountNumber,
              push_token,
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
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankname,
              accountName,
              accountNumber,
              push_token,
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
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankname,
              accountName,
              accountNumber,
              push_token,
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
              myDescription: value,
              profilePic,
              email,
              address,
              phoneNumber,
              bankname,
              accountName,
              accountNumber,
              push_token,
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
              myDescription,
              profilePic: value,
              email,
              address,
              phoneNumber,
              bankname,
              accountName,
              accountNumber,
              push_token,
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
              myDescription,
              profilePic,
              email: value,
              address,
              phoneNumber,
              bankname,
              accountName,
              accountNumber,
              push_token,
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
              myDescription,
              profilePic,
              email,
              address: value,
              phoneNumber,
              bankname,
              accountName,
              accountNumber,
              push_token,
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
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber: value,
              bankname,
              accountName,
              accountNumber,
              push_token,
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
        label="Bankname"
        isRequired={false}
        isReadOnly={false}
        value={bankname}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              firstName,
              lastName,
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankname: value,
              accountName,
              accountNumber,
              push_token,
            };
            const result = onChange(modelFields);
            value = result?.bankname ?? value;
          }
          if (errors.bankname?.hasError) {
            runValidationTasks("bankname", value);
          }
          setBankname(value);
        }}
        onBlur={() => runValidationTasks("bankname", bankname)}
        errorMessage={errors.bankname?.errorMessage}
        hasError={errors.bankname?.hasError}
        {...getOverrideProps(overrides, "bankname")}
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
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankname,
              accountName: value,
              accountNumber,
              push_token,
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
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankname,
              accountName,
              accountNumber: value,
              push_token,
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
              myDescription,
              profilePic,
              email,
              address,
              phoneNumber,
              bankname,
              accountName,
              accountNumber,
              push_token: value,
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
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
