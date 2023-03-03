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
    { label: "26", value: 26 },
    { label: "27~28", value: 27 },
  ]);

  useEffect(() => {
    getStepDb();
  }, [value]);

  // const getStepDb = async () => {
  //   const dbSteps = await db.collection("step_info").get();
  //   dbSteps.forEach((docs) => {
  //     const stepsObject = {
  //       ...docs.data(),
  //     };
  //     setSteps((prev) => [docs.data(), ...prev]);
  //     console.log(stepsObject.level);
  //   });
  // };

  const getStepDb = () => {
    db.collection("step_info")
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
          placeholder="카테고리"
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
          <ScrollView>
            {steps.map((step) => (
              <View key={step.url}>
                {isEnabled === false ? (
                  <TouchableOpacity
                    key={step.url}
                    onPress={() =>
                      Linking.openURL(
                        "http://www.youtube.com/watch?v=" + step.url
                      )
                    }
                  >
                    <View style={styles.item}>
                      <Text style={styles.title}>{step.title}</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View>
                    <View style={styles.item}>
                      <Text style={styles.title}>{step.title}</Text>
                    </View>
                    <YoutubePlayer
                      height={200}
                      play={false}
                      videoId={step.url}
                    />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
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
