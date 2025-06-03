import { StyleSheet } from "react-native";

export default StyleSheet.create({ 

  topSafe: {
    backgroundColor: "#333C56",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 38, // espaço extra para status bar
  },
  topBarSpacer: {
    flex: 1,
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 35,
    height: 35,
    tintColor: "#FFF",
    resizeMode: "contain",
  },

  // ===================================================================
  // 2. SafeAreaView inferior (conteúdo principal, fundo branco)
  // ===================================================================
  bottomSafe: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  // ====== Modal de perfil ======
  modalOverlay: {
    flex: 1,
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

  // 3. CALENDÁRIO
  calendarContainer: {
    marginHorizontal: 24,
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 1,
    backgroundColor: "#FFF",
  },
  calendar: {
    borderRadius: 8,
  },

  // 4. BOTÃO “CALENDÁRIO ACADÊMICO”
  calendarButton: {
    flexDirection: "row",
    backgroundColor: "#E6BC51",
    height: 56,
    marginHorizontal: 24,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(146,114,33,0.3)",
  },
  calendarButtonText: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#927221",
  },
  arrowIcon: {
    width: 26,
    height: 30,
    resizeMode: "contain",
  },

  // 5. DISTRIBUIÇÃO DE BOTÕES (Disciplinas / Notas / Faltas)
  buttonsWrapper: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 10,
    justifyContent: "flex-start", // alinha à esquerda
    height: 232, // igual à altura de discButton
  },
  // 5.1 DISCIPLINAS (esquerda)
  discButton: {
    width: 175,
    height: 232,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    overflow: "hidden", // para que decoração não vaze dos cantos
    marginRight: 12, // espaço menor entre colunas
  },
  discButtonBlue: {
    backgroundColor: "#A0BFE8",
  },
  discButtonTriangleTop: {
    width: 140,
    height: 140,
    position: "absolute",
    top: -40,
    right: -2,
    resizeMode: "contain",
  },
  discButtonTriangleBottom: {
    width: 140,
    height: 140,
    position: "absolute",
    bottom: -40,
    left: 0,
    resizeMode: "contain",
  },
  // Ícone “disciplinas” no canto superior esquerdo da célula
  discIcon: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 24.8,
    height: 24.8,
    resizeMode: "contain",
    tintColor: "#4A6FA5",
  },
  // Wrapper para centralizar verticalmente o texto dentro do botão
  discTextWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  discText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-ExtraBold",
    color: "#FFF",
    textAlign: "center",
  },

  // 5.2 COLUNA DIREITA (Notas em cima, Faltas embaixo)
  rightColumn: {
    width: 175, // mesma largura de discButton
    justifyContent: "space-between",
  },
  smallButton: {
    width: "100%", // preenche toda a largura de rightColumn (175)
    height: "48%", // metade da altura de buttonsWrapper (232)
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    overflow: "hidden", // para decoração de faltas não vazar
  },
  smallButtonWhite: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  smallButtonRed: {
    backgroundColor: "#FF9C9C",
  },
  smallIcon: {
    width: 24.8,
    height: 24.8,
    resizeMode: "contain",
  },
  smallText: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Poppins-ExtraBold",
  },
  faltaTriangle: {
    width: 184,
    height: 122,
    position: "absolute",
    top: 0,
    right: -20,
    resizeMode: "contain",
  },

  // 6. BOTÃO DE SUPORTE (FULL WIDTH)
  supportButton: {
    flexDirection: "row",
    height: 56,
    backgroundColor: "#333C56",
    marginHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 10,
    elevation: 2,
    overflow: "hidden", // para decoração não vazar dos cantos
  },
  supportButtonGrey: {},
  supportTriangleLeft: {
    width: 175,
    height: 50,
    position: "absolute",
    left: -25,
    top: 8,
    resizeMode: "contain",
    zIndex: 0, // triângulo ficará atrás
  },
  supportTriangleRight: {
    width: 175,
    height: 50,
    position: "absolute",
    right: -25,
    top: 0,
    resizeMode: "contain",
    zIndex: 0, // triângulo ficará atrás
  },
  // Texto “Suporte” alinhado à esquerda (com flex:1 para empurrar o ícone)
  supportText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    fontFamily: "Poppins-ExtraBold",
    textAlign: "left",
    zIndex: 1,
  },
  // Ícone de engrenagem acima de tudo
  supportIcon: {
    width: 30,
    height: 30,
    tintColor: "#FFF",
    resizeMode: "contain",
    marginLeft: 8,
    zIndex: 1,
  },

  // Utilitário para envio de triângulos decorativos para camada de fundo
  triangleDecor: {
    zIndex: 0,
  }



});