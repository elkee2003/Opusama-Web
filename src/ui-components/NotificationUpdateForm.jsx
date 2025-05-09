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
import { Notification } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function NotificationUpdateForm(props) {
  const {
    id: idProp,
    notification: notificationModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    creatorID: "",
    recipientID: "",
    recipientType: "",
    type: "",
    entityID: "",
    message: "",
    read: false,
  };
  const [creatorID, setCreatorID] = React.useState(initialValues.creatorID);
  const [recipientID, setRecipientID] = React.useState(
    initialValues.recipientID
  );
  const [recipientType, setRecipientType] = React.useState(
    initialValues.recipientType
  );
  const [type, setType] = React.useState(initialValues.type);
  const [entityID, setEntityID] = React.useState(initialValues.entityID);
  const [message, setMessage] = React.useState(initialValues.message);
  const [read, setRead] = React.useState(initialValues.read);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = notificationRecord
      ? { ...initialValues, ...notificationRecord }
      : initialValues;
    setCreatorID(cleanValues.creatorID);
    setRecipientID(cleanValues.recipientID);
    setRecipientType(cleanValues.recipientType);
    setType(cleanValues.type);
    setEntityID(cleanValues.entityID);
    setMessage(cleanValues.message);
    setRead(cleanValues.read);
    setErrors({});
  };
  const [notificationRecord, setNotificationRecord] = React.useState(
    notificationModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Notification, idProp)
        : notificationModelProp;
      setNotificationRecord(record);
    };
    queryData();
  }, [idProp, notificationModelProp]);
  React.useEffect(resetStateValues, [notificationRecord]);
  const validations = {
    creatorID: [],
    recipientID: [],
    recipientType: [],
    type: [],
    entityID: [],
    message: [],
    read: [],
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
          creatorID,
          recipientID,
          recipientType,
          type,
          entityID,
          message,
          read,
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
            Notification.copyOf(notificationRecord, (updated) => {
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
      {...getOverrideProps(overrides, "NotificationUpdateForm")}
      {...rest}
    >
      <TextField
        label="Creator id"
        isRequired={false}
        isReadOnly={false}
        value={creatorID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              creatorID: value,
              recipientID,
              recipientType,
              type,
              entityID,
              message,
              read,
            };
            const result = onChange(modelFields);
            value = result?.creatorID ?? value;
          }
          if (errors.creatorID?.hasError) {
            runValidationTasks("creatorID", value);
          }
          setCreatorID(value);
        }}
        onBlur={() => runValidationTasks("creatorID", creatorID)}
        errorMessage={errors.creatorID?.errorMessage}
        hasError={errors.creatorID?.hasError}
        {...getOverrideProps(overrides, "creatorID")}
      ></TextField>
      <TextField
        label="Recipient id"
        isRequired={false}
        isReadOnly={false}
        value={recipientID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              creatorID,
              recipientID: value,
              recipientType,
              type,
              entityID,
              message,
              read,
            };
            const result = onChange(modelFields);
            value = result?.recipientID ?? value;
          }
          if (errors.recipientID?.hasError) {
            runValidationTasks("recipientID", value);
          }
          setRecipientID(value);
        }}
        onBlur={() => runValidationTasks("recipientID", recipientID)}
        errorMessage={errors.recipientID?.errorMessage}
        hasError={errors.recipientID?.hasError}
        {...getOverrideProps(overrides, "recipientID")}
      ></TextField>
      <TextField
        label="Recipient type"
        isRequired={false}
        isReadOnly={false}
        value={recipientType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              creatorID,
              recipientID,
              recipientType: value,
              type,
              entityID,
              message,
              read,
            };
            const result = onChange(modelFields);
            value = result?.recipientType ?? value;
          }
          if (errors.recipientType?.hasError) {
            runValidationTasks("recipientType", value);
          }
          setRecipientType(value);
        }}
        onBlur={() => runValidationTasks("recipientType", recipientType)}
        errorMessage={errors.recipientType?.errorMessage}
        hasError={errors.recipientType?.hasError}
        {...getOverrideProps(overrides, "recipientType")}
      ></TextField>
      <TextField
        label="Type"
        isRequired={false}
        isReadOnly={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              creatorID,
              recipientID,
              recipientType,
              type: value,
              entityID,
              message,
              read,
            };
            const result = onChange(modelFields);
            value = result?.type ?? value;
          }
          if (errors.type?.hasError) {
            runValidationTasks("type", value);
          }
          setType(value);
        }}
        onBlur={() => runValidationTasks("type", type)}
        errorMessage={errors.type?.errorMessage}
        hasError={errors.type?.hasError}
        {...getOverrideProps(overrides, "type")}
      ></TextField>
      <TextField
        label="Entity id"
        isRequired={false}
        isReadOnly={false}
        value={entityID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              creatorID,
              recipientID,
              recipientType,
              type,
              entityID: value,
              message,
              read,
            };
            const result = onChange(modelFields);
            value = result?.entityID ?? value;
          }
          if (errors.entityID?.hasError) {
            runValidationTasks("entityID", value);
          }
          setEntityID(value);
        }}
        onBlur={() => runValidationTasks("entityID", entityID)}
        errorMessage={errors.entityID?.errorMessage}
        hasError={errors.entityID?.hasError}
        {...getOverrideProps(overrides, "entityID")}
      ></TextField>
      <TextField
        label="Message"
        isRequired={false}
        isReadOnly={false}
        value={message}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              creatorID,
              recipientID,
              recipientType,
              type,
              entityID,
              message: value,
              read,
            };
            const result = onChange(modelFields);
            value = result?.message ?? value;
          }
          if (errors.message?.hasError) {
            runValidationTasks("message", value);
          }
          setMessage(value);
        }}
        onBlur={() => runValidationTasks("message", message)}
        errorMessage={errors.message?.errorMessage}
        hasError={errors.message?.hasError}
        {...getOverrideProps(overrides, "message")}
      ></TextField>
      <SwitchField
        label="Read"
        defaultChecked={false}
        isDisabled={false}
        isChecked={read}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              creatorID,
              recipientID,
              recipientType,
              type,
              entityID,
              message,
              read: value,
            };
            const result = onChange(modelFields);
            value = result?.read ?? value;
          }
          if (errors.read?.hasError) {
            runValidationTasks("read", value);
          }
          setRead(value);
        }}
        onBlur={() => runValidationTasks("read", read)}
        errorMessage={errors.read?.errorMessage}
        hasError={errors.read?.hasError}
        {...getOverrideProps(overrides, "read")}
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
          isDisabled={!(idProp || notificationModelProp)}
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
              !(idProp || notificationModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
