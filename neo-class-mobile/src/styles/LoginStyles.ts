import { StyleSheet, Platform } from 'react-native';

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333C56',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 160,
    height: 80,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
  },
  card: {
    width: '100%',
    backgroundColor: '#A0BFE8',
    borderTopLeftRadius: 90,
    borderBottomRightRadius: 90,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 36,
    color: '#FFF',
    marginBottom: 16,
  },
  errorText: {
    color: '#f66',
    marginBottom: 12,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 6,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000',
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    height: 44,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#333',
  },
  button: {
    width: 95,
    height: 38,
    marginTop: 24,
    backgroundColor: '#EA9216',
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default LoginStyles;
