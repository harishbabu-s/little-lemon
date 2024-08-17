import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useContext, useCallback } from "react";
import { useFonts } from "expo-font";

import Header from "../components/Header";
import { validateEmail, validateName } from "../utils/Validation";
import color from "../utils/Colors";
import { AuthContext } from "../contexts/AuthContext";

export default Onboarding = () => {
  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [email, onChangeEmail] = useState("");

  const isEmailValid = validateEmail(email);
  const isFirstNameValid = validateName(firstName);
  const isLastNameValid = validateName(lastName);

  const { onboard } = useContext(AuthContext);

  useFonts({
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
    "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
  });

  const Success = isFirstNameValid && isLastNameValid && isEmailValid;

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Let us get to know you</Text>

      <Text style={styles.inputTitle}>First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={onChangeFirstName}
        style={styles.input}
      />

      <Text style={styles.inputTitle}>Last Name</Text>
      <TextInput
        value={lastName}
        onChangeText={onChangeLastName}
        style={styles.input}
      />

      <Text style={styles.inputTitle}>Email</Text>
      <TextInput
        value={email}
        onChangeText={onChangeEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <Pressable
        title="Next"
        style={[
          styles.button,
          { backgroundColor: Success ? color.primaryTwo : "grey" },
        ]}
        onPress={() => onboard({ firstName, lastName, email })}
        disabled={!Success}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.secondaryThree,
  },
  title: {
    fontSize: 30,
    color: color.primaryOne,
    alignSelf: "center",
    paddingTop: 70,
    paddingBottom: 120,
    fontFamily: "Karla-Bold",
  },

  inputTitle: {
    fontSize: 24,
    color: color.primaryOne,
    alignSelf: "center",
    fontFamily: "Karla-Bold",
  },
  input: {
    borderColor: color.primaryOne,
    alignSelf: "center",
    height: 50,
    width: 300,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 2,
    fontSize: 20,
    borderRadius: 8,
  },
  button: {
    width: 200,
    height: 50,
    borderColor: color.primaryOne,
    borderWidth: 2,
    borderRadius: 9,
    marginTop: 50,
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 26,
    fontFamily: "Karla-Bold",
    padding: 5,
  },
});
