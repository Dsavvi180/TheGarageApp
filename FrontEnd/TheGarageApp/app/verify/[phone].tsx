import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import {
  isClerkAPIResponseError,
  useAuth,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Colors from "@/constants/Colors";

const CELL_COUNT = 6;

const Page = () => {
  const { phone, signin } = useLocalSearchParams<{
    phone: string;
    signin: string;
  }>();
  const [code, setCode] = useState("");
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();
  console.log("signin object:", signin);
  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });
  const { isLoaded, isSignedIn } = useAuth();

  const authenticate = () => {
    console.log("USER IS SIGNED IN: ", isSignedIn, signin);
    if (code.length === 6) {
      console.log("code", code);
      if (signin === "true") {
        verifySignIn();
      } else {
        verifyCode();
      }
    }
  };

  useEffect(() => {
    authenticate();
  }, [code]);

  const verifyCode = async () => {
    try {
      await signUp!.attemptPhoneNumberVerification({ code });
      await setActive!({ session: signUp!.createdSessionId });
    } catch (err) {
      console.log("verifyCode error", JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        if (err.errors[0].code === "form_identifier_not_found") {
          Alert.alert("Error", err.errors[0].message);
        }
      }
    }
  };
  const verifySignIn = async () => {
    try {
      await signIn!.attemptFirstFactor({ strategy: "phone_code", code });
      await setActive!({ session: signIn!.createdSessionId });
    } catch (err) {
      console.log("verifySignIn error", JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        if (err.errors[0].code === "form_identifier_not_found") {
          Alert.alert("Error", err.errors[0].message);
        }
      }
    }
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>6-digit code</Text>
      <Text style={defaultStyles.descriptionText}>
        Code sent to {phone} unless you already have an account.
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Fragment key={index}>
            <Text
              key={index}
              style={[
                styles.cellRoot,
                isFocused && styles.focusCell,
                styles.cellText,
              ]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
            {index === 2 ? (
              <View key={`seperator-${index}`} style={styles.separator} />
            ) : null}
          </Fragment>
        )}
      />

      <Link href={"/login"} replace asChild>
        <TouchableOpacity>
          <Text style={[defaultStyles.textLink]}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity
        style={[
          defaultStyles.pillButton,
          code.length == 6 ? styles.enabled : styles.disabled,
          { marginBottom: 20, marginTop: 390 },
        ]}
        //navigate to different page and verify code
        onPress={authenticate}
      >
        <Text style={defaultStyles.buttonText}>
          {signin === "true" ? "Sign in" : "Sign up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: 20,
    marginLeft: "auto",
    marginRight: "auto",
    gap: 12,
  },
  cellRoot: {
    width: 45,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  cellText: {
    color: "#000",
    fontSize: 26,
    textAlign: "center",
    alignContent: "center",
    lineHeight: 55,
  },
  focusCell: {
    paddingBottom: 8,
  },
  separator: {
    height: 2,
    width: 10,
    backgroundColor: Colors.gray,
    alignSelf: "center",
  },
  enabled: { backgroundColor: Colors.primary },
  disabled: { backgroundColor: Colors.primaryMuted },
});

export default Page;
