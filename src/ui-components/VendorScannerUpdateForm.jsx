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
import { VendorScanner } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function VendorScannerUpdateForm(props) {
  const {
    id: idProp,
    vendorScanner: vendorScannerModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    vendorID: "",
    name: "",
    token: "",
    expiresAt: "",
    isActive: false,
  };
  const [vendorID, setVendorID] = React.useState(initialValues.vendorID);
  const [name, setName] = React.useState(initialValues.name);
  const [token, setToken] = React.useState(initialValues.token);
  const [expiresAt, setExpiresAt] = React.useState(initialValues.expiresAt);
  const [isActive, setIsActive] = React.useState(initialValues.isActive);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = vendorScannerRecord
      ? { ...initialValues, ...vendorScannerRecord }
      : initialValues;
    setVendorID(cleanValues.vendorID);
    setName(cleanValues.name);
    setToken(cleanValues.token);
    setExpiresAt(cleanValues.expiresAt);
    setIsActive(cleanValues.isActive);
    setErrors({});
  };
  const [vendorScannerRecord, setVendorScannerRecord] = React.useState(
    vendorScannerModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(VendorScanner, idProp)
        : vendorScannerModelProp;
      setVendorScannerRecord(record);
    };
    queryData();
  }, [idProp, vendorScannerModelProp]);
  React.useEffect(resetStateValues, [vendorScannerRecord]);
  const validations = {
    vendorID: [],
    name: [],
    token: [],
    expiresAt: [],
    isActive: [],
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
          vendorID,
          name,
          token,
          expiresAt,
          isActive,
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
            VendorScanner.copyOf(vendorScannerRecord, (updated) => {
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
      {...getOverrideProps(overrides, "VendorScannerUpdateForm")}
      {...rest}
    >
      <TextField
        label="Vendor id"
        isRequired={false}
        isReadOnly={false}
        value={vendorID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              vendorID: value,
              name,
              token,
              expiresAt,
              isActive,
            };
            const result = onChange(modelFields);
            value = result?.vendorID ?? value;
          }
          if (errors.vendorID?.hasError) {
            runValidationTasks("vendorID", value);
          }
          setVendorID(value);
        }}
        onBlur={() => runValidationTasks("vendorID", vendorID)}
        errorMessage={errors.vendorID?.errorMessage}
        hasError={errors.vendorID?.hasError}
        {...getOverrideProps(overrides, "vendorID")}
      ></TextField>
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              vendorID,
              name: value,
              token,
              expiresAt,
              isActive,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Token"
        isRequired={false}
        isReadOnly={false}
        value={token}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              vendorID,
              name,
              token: value,
              expiresAt,
              isActive,
            };
            const result = onChange(modelFields);
            value = result?.token ?? value;
          }
          if (errors.token?.hasError) {
            runValidationTasks("token", value);
          }
          setToken(value);
        }}
        onBlur={() => runValidationTasks("token", token)}
        errorMessage={errors.token?.errorMessage}
        hasError={errors.token?.hasError}
        {...getOverrideProps(overrides, "token")}
      ></TextField>
      <TextField
        label="Expires at"
        isRequired={false}
        isReadOnly={false}
        value={expiresAt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              vendorID,
              name,
              token,
              expiresAt: value,
              isActive,
            };
            const result = onChange(modelFields);
            value = result?.expiresAt ?? value;
          }
          if (errors.expiresAt?.hasError) {
            runValidationTasks("expiresAt", value);
          }
          setExpiresAt(value);
        }}
        onBlur={() => runValidationTasks("expiresAt", expiresAt)}
        errorMessage={errors.expiresAt?.errorMessage}
        hasError={errors.expiresAt?.hasError}
        {...getOverrideProps(overrides, "expiresAt")}
      ></TextField>
      <SwitchField
        label="Is active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isActive}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              vendorID,
              name,
              token,
              expiresAt,
              isActive: value,
            };
            const result = onChange(modelFields);
            value = result?.isActive ?? value;
          }
          if (errors.isActive?.hasError) {
            runValidationTasks("isActive", value);
          }
          setIsActive(value);
        }}
        onBlur={() => runValidationTasks("isActive", isActive)}
        errorMessage={errors.isActive?.errorMessage}
        hasError={errors.isActive?.hasError}
        {...getOverrideProps(overrides, "isActive")}
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
          isDisabled={!(idProp || vendorScannerModelProp)}
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
              !(idProp || vendorScannerModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
