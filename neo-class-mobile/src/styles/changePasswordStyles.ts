import { StyleSheet, Platform, StatusBar } from 'react-native';

const changePasswordStyles = StyleSheet.create({
  // === Ajuste para que o form abra centralizado ===
  topSafe: {
    flex: 1,  // @ADICIONADO: permite que o conteúdo interno ocupe toda a tela
    backgroundColor: '#333C56',
  },

  // === Cabeçalho (mantido sem alterações) ===
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
    backgroundColor: '#333C56',
  },
  backButton: { padding: 4 },
  backIcon: { width: 28, height: 28, tintColor: '#FFF', resizeMode: 'contain' },
  topBarSpacer: { flex: 1 },
  profileButton: { padding: 4 },
  profileIcon: { width: 35, height: 35, tintColor: '#FFF', resizeMode: 'contain' },

  // === Modal de perfil (mantido sem alterações) ===
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 280,
    backgroundColor: '#333C56',
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: { elevation: 8 },
    }),
  },
  modalHeader: { color: '#FFF', fontSize: 18, fontWeight: '700', paddingHorizontal: 16, paddingVertical: 8 },
  modalDivider: { height: 1, backgroundColor: '#FFF', opacity: 0.2, marginHorizontal: 16 },
  modalButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  modalButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600', flex: 1 },
  modalButtonIcon: { width: 20, height: 20, tintColor: '#FFF', resizeMode: 'contain' },

  // === Conteúdo principal (form centralizado) ===
  mainContentWrapper: {
    flex: 1,                       // ocupa todo o espaço restante
    backgroundColor: '#F2F4F7',   // fundo claro para a área de conteúdo
    justifyContent: 'center',     // alinha verticalmente ao centro
    alignItems: 'center',         // alinha horizontalmente ao centro
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333C56',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 55,
    fontSize: 17,
    color: '#333',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    width: '100%',
    backgroundColor: '#EA9216',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#F3C588',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default changePasswordStyles;
