import { StyleSheet, Platform } from "react-native";

const notificationStyles = StyleSheet.create({ 
  // === SafeAreaView superior / header ===
  topSafe: {
    backgroundColor: '#333C56',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: Platform.OS === 'android' ? 38 : 0,
  },
  backButton: { padding: 4 },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFF',
    resizeMode: 'contain',
  },
  topBarSpacer: { flex: 1 },
  profileButton: { padding: 4 },
  profileIcon: {
    width: 35,
    height: 35,
    tintColor: '#FFF',
    resizeMode: 'contain',
  },

  // === Modal de perfil ===
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
  },
  modalContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 280,
    backgroundColor: '#333C56',
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingVertical: 12,
  },
  modalHeader: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#FFF',
    opacity: 0.2,
    marginHorizontal: 16,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  modalButtonIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
    resizeMode: 'contain',
  },

  // === Conteúdo da tela de Notificações ===
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  // tabela de notificações enviadas
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFECC2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  sentRow: {
    backgroundColor: '#FFF4CC',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  // lista de respostas
  responseRow: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  responseText: {
    fontSize: 14,
    color: '#333',
  },
  responseDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 12,
  },
  // input e botão enviar
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#FFF',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#2D2D2D',
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#999',
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
    resizeMode: 'contain',
  },
});

export default notificationStyles;