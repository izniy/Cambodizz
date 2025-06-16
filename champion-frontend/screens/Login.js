import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Login Page</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Learning")}
      >
        <Text style={styles.buttonText}>Go to Learning</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Login;
