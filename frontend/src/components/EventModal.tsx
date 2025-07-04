import { motion, AnimatePresence } from "framer-motion";
import type { Event } from "../types/event";
import EventDetails from "./EventDetails";

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

const EventModal = ({ event, onClose }: EventModalProps) => {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="modal"
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden pointer-events-auto"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <EventDetails 
          event={event} 
          showInfosComplementaires={false}
          showArtists={false}
          showActions={true}  
          showViewMoreButton={true}
          />

          <div className="p-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventModal;
