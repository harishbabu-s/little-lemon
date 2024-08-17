import { Image, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/Logo.png";
import color from "../utils/Colors";

export default Header = () => {
  return (
    <>
      <View style={styles.header}>
        <Image style={styles.image} source={logo} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 50,
    height: 150,
    backgroundColor: color.white,
  },
  image: {
    alignSelf: "center",
    width: 300,
    height: 80,
  },
});
