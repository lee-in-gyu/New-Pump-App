import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { auth } from "../firebase";
import { db } from "../firebase";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [steps, setSteps] = useState([]);
  const [level, setlevel] = useState(undefined);

  useEffect(() => {
    getStepDb();
  }, []);

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
      .where("level", "==", 27)
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
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  return (
    <View style={styles.header}>
      <View>
        <Text>E-mail: {auth.currentUser?.email}</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
        <ScrollView>
          {steps.map((step) => (
            <TouchableOpacity
              key={step.url}
              onPress={() => Linking.openURL(step.url)}
            >
              <View style={styles.item}>
                <Text style={styles.title}>{step.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
