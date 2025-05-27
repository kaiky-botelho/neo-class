// src/screens/LoginScreen.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={styles.container}>
      {/* Logo no topo */}
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Card azul claro */}
      <View style={styles.card}>
        <Text style={styles.title}>LOGIN</Text>

        {/* E-mail */}
        <Text style={styles.label}>E-mail</Text>
        <View style={styles.inputWrapper}>
          <Image
            source={require("../../assets/email.png")}
            style={styles.icon}
          />
          <TextInput
            placeholder="Digite seu e-mail"
            placeholderTextColor="#000000"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Senha */}
        <Text style={[styles.label, { marginTop: 16 }]}>Senha</Text>
        <View style={styles.inputWrapper}>
          <Image
            source={require("../../assets/lock.png")}
            style={styles.icon}
          />
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#000000"
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        {/* Botão Entrar */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => signIn(email, senha)}
        >
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333C56",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  logo: {
    width: 161,
    height: 110,
    position: "absolute",
    top: 100,
  },
 card: {
    width: "100%",
    backgroundColor: "#A0BFE8",
    borderTopLeftRadius: 90,
    borderBottomRightRadius: 90,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",

    // sombreamento branco conforme Figma
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 46,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "#000",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.5)",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 20,
    fontFamily: "Roboto-Medium",
    color: "#333",
  },
  button: {
    backgroundColor: "#EA9216",
    borderRadius: 8,
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Roboto-Medium",
    fontSize: 20,
  },
});
