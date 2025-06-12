import { StyleSheet, Platform } from "react-native";

const subjectsStyles = StyleSheet.create({
  // === Header / Modal ===
  topSafe: {
    backgroundColor: '#333C56',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    // REMOVIDO: marginTop: Platform.OS === 'android' ? 38 : 0, // <-- Removido para ser tratado dinamicamente no componente
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Adicionado background para o overlay do modal
  },
  modalContainer: {
    position: 'absolute',
    top: 50,
    right: 0, // Corrigido para não ter espaço à direita
    width: 280,
    backgroundColor: '#333C56', // Cor do cabeçalho
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingVertical: 12,
    ...Platform.select({ // Adicionado sombras para combinar com os outros modais
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
    // Font family 'Poppins-Bold' para consistência (se disponível)
    fontFamily: 'Poppins-Bold', 
    fontSize: 18,
    color: '#FFF',
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
    flex: 1,
    fontFamily: 'Poppins-Medium', // Font family 'Poppins-Medium' para consistência
    fontSize: 16,
    color: '#FFF',
  },
  modalButtonIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
    resizeMode: 'contain',
  },

  // === Main content ===
  bottomSafe: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? 24 : 0, // Mantido como estava
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  errorText: { // Este estilo é para Text na tela, não para Toast
    fontSize: 16,
    color: '#f66',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Poppins-Regular', // Adicionado font family para consistência
  },
  listContainer: {
    paddingBottom: 24,
    flexGrow: 1, // Adicionado para permitir o scroll em FlatList vazia
  },

  // === Lista de Disciplinas ===
  subjectButton: {
    backgroundColor: '#A0BFE8', // Fundo azul claro
    paddingVertical: 14,
    borderRadius: 10, // Cantos arredondados
    marginVertical: 6, // Espaçamento vertical entre os botões
    alignItems: 'center',
    borderColor: 'rgba(132, 132, 132, 0.25)', // Borda
    borderWidth: 1,
    // Estilo de sombra:
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(192, 192, 192, 0.25)',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
      },
      android: {
        elevation: 1, // Elevação para Android, imitando a sombra
      },
    }),
  },
  subjectText: {
    fontFamily: 'Poppins-Regular', // Font family
    fontSize: 18,
    color: '#333',
    textAlign: 'center', // Centralizar o texto dentro do botão
  },
  // NOVO: Estilo para quando não há dados (para ListEmptyComponent)
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
    fontFamily: 'Poppins-Regular',
  },
});

export default subjectsStyles;