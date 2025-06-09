import { StyleSheet, Platform  } from "react-native";

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
    // === Main content ===
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: '#f66',
    textAlign: 'center',
    marginTop: 16,
  },
  listContainer: {
    paddingBottom: 24,
  },

  // === Subject buttons ===
  subjectButton: {
    backgroundColor: '#CCE5FF',
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
 });

export default subjectsStyles;