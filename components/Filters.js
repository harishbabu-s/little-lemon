import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";

import color from "../utils/Colors";


const Filters = ({ onChange, selections, sections }) => {
  useFonts({
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
  });
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            backgroundColor: selections[index] ? color.primaryOne : color.secondaryThree  ,
            borderRadius: 16,
            marginRight: 15,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Karla-ExtraBold",
                fontSize: 18,
                color: selections[index] ? "#edefee" : "#495e57",
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    paddingLeft: 15,
  },
});

export default Filters;
