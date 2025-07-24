import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { Event } from '../types/event';
import EventDetails from './EventDetails';

interface EventModalProps {
    event: Event;
    visible: boolean;
    onClose: () => void;
}

const EventModal = ({ event, visible, onClose }: EventModalProps) => {
    return (
        <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={onClose}
        >
        <View style={styles.overlay}>
            <View style={styles.modal}>
            <ScrollView contentContainerStyle={styles.content}>
                <EventDetails
                event={event}
                showInfosComplementaires={false}
                showArtists={true}
                showActions={true}
                showViewMoreButton={true}
                />
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
            </ScrollView>
            </View>
        </View>
        </Modal>
    );
};

export default EventModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        width: '90%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    content: {
        paddingBottom: 24,
    },
    closeButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginTop: 16,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});
