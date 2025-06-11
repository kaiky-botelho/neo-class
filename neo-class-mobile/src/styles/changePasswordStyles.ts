import { StyleSheet, Platform } from 'react-native';

const changePasswordStyles = StyleSheet.create({
  // === SafeAreaView superior / cabeçalho ===
  topSafe: {
    backgroundColor: '#333C56',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    // REMOVIDO: marginTop: Platform.OS === 'android' ? 38 : 0, // <-- Tratar no componente ChangePasswordScreen.tsx
    backgroundColor: '#333C56', // Garante que o fundo do cabeçalho corresponda ao topSafe
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFF',
    resizeMode: 'contain',
  },
  topBarSpacer: {
    flex: 1, // Empurra o botão de perfil para a direita
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 35,
    height: 35,
    tintColor: '#FFF',
    resizeMode: 'contain',
  },

  // === Modal de perfil ===
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo semi-transparente para o overlay do modal
  },
  modalContainer: {
    position: 'absolute',
    top: 50, // Ajuste conforme a altura do seu cabeçalho
    right: 0, // Grudado na direita
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

  // === Conteúdo principal da tela de Alterar Senha ===
  mainContentWrapper: { // Este era `container` antes
    flex: 1,
    backgroundColor: '#F2F4F7', // Fundo cinza claro para o corpo da tela
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    paddingHorizontal: 24, // Padding horizontal aqui
  },
  formContainer: { // NOVO: Container para o formulário (inputs e botão)
    width: '100%', // Ocupa a largura máxima dentro do paddingHorizontal
    // Não precisa de flex: 1, pois `mainContentWrapper` já centraliza o conteúdo.
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333C56',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 55,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: { // Este estilo é para Text na tela, não para Toast
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: -5,
  },
  button: {
    width: '100%',
    backgroundColor: '#EA9216',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#F3C588',
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default changePasswordStyles;