import { StyleSheet, Platform } from "react-native";

const notificationStyles = StyleSheet.create({
  // === SafeAreaView superior / header ===
  topSafe: {
    backgroundColor: "#333C56",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: Platform.OS === "android" ? 38 : 0, // Este é o marginTop específico para Android
  },
  backButton: { padding: 4 },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: "#FFF",
    resizeMode: "contain",
  },
  topBarSpacer: { flex: 1 },
  profileButton: { padding: 4 },
  profileIcon: {
    width: 35,
    height: 35,
    tintColor: "#FFF",
    resizeMode: "contain",
  },

  // === Modal de perfil ===
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
  },
  modalContainer: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 280,
    backgroundColor: "#333C56",
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#FFF",
    opacity: 0.2,
    marginHorizontal: 16,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  modalButtonIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFF",
    resizeMode: "contain",
  },

    // === Conteúdo do Chat ===
  mainContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    // REMOVIDO: Se tinha aqui, pois agora será aplicado via array no componente diretamente
    // justifyContent: 'flex-end',
  },
  chatMessageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 2,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  messageDate: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  receivedMessageDate: {
    textAlign: 'left',
  },
  emptyChatText: {
    textAlign: "center",
    color: "#999",
    marginVertical: 20,
    fontSize: 16,
  },

  // === Input + Botão enviar ===
  bottomInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderColor: "#EEE",
    paddingBottom: Platform.OS === "ios" ? 20 : 8, // padding para iOS safe area inferior
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#F0F0F0",
    marginRight: 12,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "#2D2D2D",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: "#999",
  },
  sendIcon: {
    width: 22,
    height: 22,
    tintColor: "#FFF",
    resizeMode: "contain",
  },
});

export default notificationStyles;