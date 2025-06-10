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
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7', // Fundo cinza claro para o corpo da tela
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    paddingHorizontal: 24,
    paddingBottom: 50, // Adiciona padding inferior para não ficar muito grudado
  },
  title: {
    fontSize: 26, // Aumenta o tamanho do título
    fontWeight: 'bold',
    color: '#333C56', // Cor mais escura para o título
    marginBottom: 40, // Mais espaço abaixo do título
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF', // Fundo branco para os inputs
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 55, // Aumenta a altura dos inputs
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DCDCDC', // Borda mais suave
    shadowColor: '#000', // Sombra sutil para inputs
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: {
    color: '#D32F2F', // Vermelho para erros
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: -5, // Ajusta o espaçamento se houver erro
  },
  button: {
    width: '100%',
    backgroundColor: '#EA9216', // Laranja vibrante
    borderRadius: 8,
    paddingVertical: 16, // Mais padding para um botão maior
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30, // Mais espaço acima do botão
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#F3C588', // Laranja mais claro para desativado
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default changePasswordStyles;