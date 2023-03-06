import { useNavigation } from "@react-navigation/core";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Button,
  Switch,
} from "react-native";
import { auth } from "../firebase";
import { db } from "../firebase";
import YoutubePlayer from "react-native-youtube-iframe";
import DropDownPicker from "react-native-dropdown-picker";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [steps, setSteps] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "20", value: 20 },
    { label: "21", value: 21 },
    { label: "22", value: 22 },
    { label: "23", value: 23 },
    { label: "24", value: 24 },
    { label: "25", value: 25 },
    { label: "26", value: 26 },
    { label: "27~28", value: 27 },
  ]);

  useEffect(() => {
    getStepDb();
  }, [value]);

  const getStepDb = async () => {
    setSteps([]);
    await db
      .collection("step_info")
      .where("level", "==", value)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const stepsObject = {
            ...doc.data(),
          };
          setSteps((prev) => [doc.data(), ...prev]);
          // console.log(stepsObject);
        });
      });
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const Item = ({ item, onPress }) => (
    <View>
      {isEnabled === false ? (
        <TouchableOpacity onPress={onPress} style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
          <YoutubePlayer height={200} play={false} videoId={item.url} />
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onPress={() =>
          Linking.openURL("http://www.youtube.com/watch?v=" + item.url)
        }
      />
    );
  };

  return (
    <View style={styles.header}>
      <View>
        <Text>E-mail: {auth.currentUser?.email}</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="레벨 선택"
          listMode="MODAL"
          modalProps={{
            animationType: "fade",
          }}
          modalTitle="선택해주세요."
        />
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        {value === null ? null : (
          <FlatList
            data={steps}
            renderItem={renderItem}
            keyExtractor={(item) => item.title}
          />
        )}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  item: {
    backgroundColor: "grey",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
});
