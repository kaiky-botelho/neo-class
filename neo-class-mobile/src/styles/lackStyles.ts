import { StyleSheet, Platform } from 'react-native';

const lackStyles = StyleSheet.create({
  // === Header / Modal ===
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

  modalOverlay: {
    flex: 1,
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

  // === Conteúdo Principal ===
  bottomSafe: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  errorText: {
    color: '#f66',
    textAlign: 'center',
    marginTop: 16,
  },

  // === Lista de Faltas ===
  listContainer: {
    paddingBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(132, 132, 132, 0.20)',
    shadowColor: '#C0C0C0',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 1, 
  },
  subjectText: {
    fontFamily: 'Poppins-Medium',
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: '#FF9C9C',
    alignItems: 'center',
    justifyContent: 'center',

  },
  badgeText: {
    fontFamily: 'Poppins-Medium',
    color: '#2D2D2D',
    fontWeight: '700',
    fontSize: 18
  },
});

export default lackStyles;
