import { StyleSheet, Platform } from "react-native";

const notificationStyles = StyleSheet.create({
  topSafe: {
    backgroundColor: "#333C56",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#333C56",
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFF",
    resizeMode: "contain",
  },
  topBarSpacer: { flex: 1 },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    width: 32,
    height: 32,
    tintColor: "#FFF",
    resizeMode: "contain",
  },

  modalOverlay: {
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 80 : 70,
    // REMOVIDO: right: 15, // <--- REMOVIDO PARA GRUDAR NA DIREITA
    right: 0, // <--- ADICIONADO PARA GRUDAR NA DIREITA
    width: 250,
    backgroundColor: "#333C56",
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#333C56",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#FFF",
    opacity: 0.15,
    marginHorizontal: 16,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#333C56",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  modalButtonIcon: {
    width: 18,
    height: 18,
    tintColor: "#FFF",
    resizeMode: "contain",
  },

  predefinedButtonsSection: {
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  predefinedButtonsContainer: {
    flexDirection: "column",
  },
  predefinedButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(132, 132, 132, 0.20)",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 6,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: "rgba(192, 192, 192, 0.25)",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  predefinedButtonSelected: {
    backgroundColor: "#E6BC51",
    borderColor: "rgba(132, 132, 132, 0.20)",
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(192, 192, 192, 0.25)",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  predefinedButtonText: {
    color: "#333C56",
    fontSize: 16,
    fontWeight: "600",
    textAlign: 'center',
    lineHeight: 22,
  },

  confirmSendButton: {
    backgroundColor: "#EA9216",
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  confirmSendButtonDisabled: {
    backgroundColor: "#F3C588",
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmSendButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  historyHeader: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
    color: "#333C56",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#F2F4F7',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  mainContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  chatMessageContainer: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#EFEFEF",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 22,
  },
  messageDate: {
    fontSize: 11,
    color: "#888888",
    marginTop: 6,
    textAlign: "left",
  },
  emptyChatText: {
    textAlign: "center",
    color: "#999",
    marginVertical: 30,
    fontSize: 16,
    lineHeight: 24,
  },
});

export default notificationStyles;