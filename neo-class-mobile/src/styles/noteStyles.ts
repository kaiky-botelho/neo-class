import { StyleSheet, Platform } from 'react-native';

const noteStyles = StyleSheet.create({
  // === Header / Modal ===
  topSafe: {
    backgroundColor: '#333C56',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    // REMOVIDO: marginTop: Platform.OS === 'android' ? 38 : 0, // <-- Removido para ser tratado no componente (NoteScreen.tsx)
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
    ...Platform.select({ // Adicionado sombra para consistência com outros modais
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
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalButtonText: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFF',
  },
  modalButtonIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
    resizeMode: 'contain',
  },

  // === Main Content ===
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
  // REMOVIDO: errorText, pois o Toast lida com isso agora
  // errorText: {
  //   fontFamily: 'Poppins-Regular',
  //   fontSize: 16,
  //   color: '#f66',
  //   textAlign: 'center',
  //   marginTop: 16,
  // },
  listContainer: {
    paddingBottom: 24,
    flexGrow: 1, // Adicionado para permitir o scroll em FlatList vazia
  },

  // === Tabela ===
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  headerCell: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    fontSize: 21,
    textAlign: 'center',
    color: '#333',
    borderRightWidth: 1,
    borderColor: '#DDD',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  cell: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 19,
    textAlign: 'center',
    color: '#333',
    borderRightWidth: 1,
    borderColor: '#DDD',
  },
  // NOVO: Estilo para quando não há dados
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
    fontFamily: 'Poppins-Regular', // Definindo a fonte
  },
});

export default noteStyles;