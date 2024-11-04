// // DeleteConfirmationModal.tsx
// import React from 'react';
// import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';

// interface DeleteConfirmationModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
// }

// const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ visible, onClose, onConfirm }) => {
//   return (
//     <Modal
//       transparent={true}
//       visible={visible}
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.confirmationText}>Are you sure you want to delete this pin? The journal entries will be preserved and will be visible under "Saved", but it will no longer show up in the map.</Text>
//           <View style={styles.buttonContainer}>
//             <Pressable style={styles.confirmButton} onPress={onConfirm}>
//               <Text style={styles.buttonText}>Yes</Text>
//             </Pressable>
//             <Pressable style={styles.cancelButton} onPress={onClose}>
//               <Text style={styles.buttonText}>No</Text>
//             </Pressable>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default DeleteConfirmationModal;

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContainer: {
//     width: 300,
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   confirmationText: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
//   confirmButton: {
//     backgroundColor: '#d9534f',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   cancelButton: {
//     backgroundColor: '#5bc0de',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// DeleteConfirmationModal.tsx
import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.titleText}>Are you sure you want to delete this pin?</Text>
          <Text style={styles.bodyText}>
            The journal entries will be preserved and will be visible under "Saved", but it will no longer show up in the map.
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Yes</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>No</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 16,
    color: '#666', // Light gray color for less emphasis
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#5bc0de',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
