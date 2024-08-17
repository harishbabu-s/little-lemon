import {
  StyleSheet,
  Text,
  View,
  Image,
  SectionList,
  Pressable,
  Alert,
} from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Searchbar } from "react-native-paper";
import { useFonts } from "expo-font";
import debounce from "lodash.debounce";
import AsyncStorage from "@react-native-async-storage/async-storage";

import hero from "../assets/hero-image.png";
import color from "../utils/Colors";
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from "../database";
import Filters from "../components/Filters";
import { getSectionListData, useUpdateEffect } from "../utils/utils";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const sections = ["starters", "mains", "desserts"];

const Item = ({ name, price, description, image }) => (
  <View style={styles.item}>
    <View style={styles.itemBody}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
    <Image
      style={styles.itemImage}
      source={{
        uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
      }}
    />
  </View>
);

export default HomeScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });

  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();
        // console.log(menuItems);
        if (!menuItems.length) {
          const response = await fetch(API_URL);
          const json = await response.json();
          const menuItems = json.menu.map((item, index) => ({
            id: index + 1,
            name: item.name,
            price: item.price.toString(),
            description: item.description,
            image: item.image,
            category: item.category,
          }));
          saveMenuItems(menuItems);
        }
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
        setData(menuItems);
        const getProfile = await AsyncStorage.getItem("profile");
        setProfile(JSON.parse(getProfile));
      } catch (e) {
        console.log("Error saving data", e);
        Alert.alert("Error saving data", e.message);
      } finally {
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
        setData(menuItems);
      } catch (e) {
        console.log(e.message);
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  useFonts({
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
    "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../assets/Logo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
        <Pressable
          style={styles.avatar}
          onPress={() => navigation.navigate("Profile")}
        >
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarEmpty}>
              <Text style={styles.avatarEmptyText}>
                {profile.firstName && Array.from(profile.firstName)[0]}
                {profile.lastName && Array.from(profile.lastName)[0]}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      <View style={styles.heroMainContainer}>
        <View>
          <Text style={styles.heroTitle}>Little Lemon</Text>
        </View>
        <View style={styles.heroContainer}>
          <View style={styles.heroContent}>
            <Text style={styles.subTitle}>Chicago</Text>

            <Text style={styles.desc}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image source={hero} style={styles.image} />
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor={color.secondaryFour}
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          iconColor={color.secondaryFour}
          inputStyle={{ color: color.secondaryFour }}
          elevation={0}
        />
      </View>
      <View>
        <Text style={styles.delivery}>ORDER FOR DELIVERY!</Text>
        <Filters
          style={styles.filters}
          selections={filterSelections}
          onChange={handleFiltersChange}
          sections={sections}
        />
        <SectionList
          style={styles.sectionList}
          sections={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          )}
          renderSectionHeader={({ section: { name } }) => (
            <Text style={styles.itemHeader}>{name}</Text>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.secondaryThree,
  },
  header: {
    top: 40,
    height: 120,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: color.white,
    alignItems: "right",
  },
  logo: {
    height: 80,
    width: 220,
    resizeMode: "contain",
  },
  avatar: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  avatarEmpty: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: color.primaryOne,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 20,
    color: color.white,
    fontWeight: "bold",
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  heroMainContainer: {
    backgroundColor: color.primaryOne,
  },
  heroContainer: {
    flexDirection: "row",
  },
  heroContent: {
    width: 120,
    alignContent: "left",
  },
  image: {
    marginRight: 10,
    marginLeft: 150,
    borderRadius: 10,
    top: 40,
    width: 120,
    height: 150,
    alignSelf: "right",
  },
  heroTitle: {
    fontSize: 64,
    color: color.primaryTwo,
    alignSelf: "left",
    paddingTop: 10,
    fontFamily: "MarkaziText-Regular",
  },
  subTitle: {
    fontSize: 40,
    color: color.white,
    alignSelf: "left",
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: "MarkaziText-Regular",
  },
  desc: {
    fontSize: 21,
    color: color.white,
    alignSelf: "left",
    width: 280,
    paddingTop: 10,
    paddingBottom: 20,
    fontFamily: "Karla-Medium",
  },
  searchBar: {
    margin: 15,
    backgroundColor: "#e4e4e4",
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  delivery: {
    backgroundColor: color.white,
    fontSize: 18,
    padding: 15,
    fontFamily: "Karla-ExtraBold",
  },
  filters: {
    fontFamily: "Karla-ExtraBold",
    fontSize: 20,
  },
  sectionList: {
    height: 150,
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  item: {
    // flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingVertical: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#495e57",
    backgroundColor: "#fff",
    fontFamily: "Karla-ExtraBold",
  },
  name: {
    fontSize: 20,
    color: "#000000",
    paddingBottom: 5,
    fontFamily: "Karla-Bold",
  },
  description: {
    color: "#495e57",
    paddingRight: 5,
    fontFamily: "Karla-Medium",
  },
  price: {
    fontSize: 20,
    color: "#EE9972",
    paddingTop: 5,
    fontFamily: "Karla-Medium",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
});
