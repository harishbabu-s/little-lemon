import { _View, Image, View } from "react-native";

import logo from "../assets/Logo.png";

export default Splash = () => {
  return (
    <View>
      <Image
        source={logo}
        style={{
          flex: 1,
          alignItems: "center",
          alignSelf: "center",
          width: 300,
          height: 100,
          objectFit: "contain",
        }}
      />
    </View>
  );
};
