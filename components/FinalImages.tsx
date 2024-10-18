import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"

interface FinalImage {
  id: number
  name: string
  image: string
}

interface FinalImagesProps {
  images: FinalImage[]
  currentIndex: number
  getImageSrc: (src: string) => string
}

export function FinalImages({ images, currentIndex, getImageSrc }: FinalImagesProps) {
  return (
    <div className="text-center w-full flex flex-col items-center px-4 pb-4 md:pb-8">
      <AnimatePresence mode="sync">
        <motion.div
          key={images[currentIndex].id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={getImageSrc(images[currentIndex].image)}
            alt={images[currentIndex].name}
            className="w-64 h-64 md:w-80 md:h-80 object-cover mb-4 rounded-full shadow-lg"
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
          />
          {images[currentIndex].name && (
            <motion.h2 
              className="text-2xl md:text-4xl font-bold text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {images[currentIndex].name}
            </motion.h2>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="space-y-4 mt-8 w-full max-w-md">
      <Button 
            className="w-full bg-[rgba(184,46,82,1)] hover:bg-[#ffce0a] hover:text-black border-2 border-black text-xl font-sans"
            onClick={() => {
              // Abrir WhatsApp con un mensaje predefinido
              const whatsappUrl = `https://wa.me/31344864?text=Hola, confirmo mi asistencia, me llamo `;
              window.open(whatsappUrl, '_blank');
            }}
          >
            Confirma tu asistencia
          </Button>

          <Button 
            className="w-full bg-[rgba(184,46,82,1)] hover:bg-[#ffce0a] hover:text-black border-2 border-black text-xl font-sans"
            onClick={() => {
              // Abrir Google Maps o Waze con la ubicación correspondiente
              const locationUrl = `https://maps.app.goo.gl/SqfkRy9RvKTHudU26?g_st=ac`;
              window.open(locationUrl, '_blank');
            }}
          >
            Ubicación
          </Button>

          <Button 
            className="w-full bg-[rgba(184,46,82,1)] hover:bg-[#ffce0a] hover:text-black border-2 border-black text-xl font-sans"
            onClick={() => {
              // Agregar evento al calendario
              const event = {
                title: 'Cumpleaños Derek',
                start: new Date('2024-11-02T20:30:00Z'),  // Hora de inicio en UTC
                end: new Date('2024-11-03T00:00:00Z'),  // Hora de finalización en UTC
                location: 'https://maps.app.goo.gl/SqfkRy9RvKTHudU26?g_st=ac',  // Ubicación
                description: 'Celebración de cumpleaños de Derek con amigos y familia',  // Descripción              
              };
              
              function formatDateForCalendar(date_: Date) {
                return date_.toISOString().replace(/-|:|\.\d\d\d/g,"");
              }
              
              let calendarUrl;
              
              // if (calendarType === 'google') {
                calendarUrl = `https://calendar.google.com/calendar/r/eventedit?`;
                calendarUrl += `text=${encodeURIComponent(event.title)}`;
                calendarUrl += `&dates=${formatDateForCalendar(event.start)}/${formatDateForCalendar(event.end)}`;
                calendarUrl += `&location=${encodeURIComponent(event.location)}`;
                calendarUrl += `&details=${encodeURIComponent(event.description)}`;
              // } else if (calendarType === 'outlook') {
              //   calendarUrl = `https://outlook.office.com/calendar/0/deeplink/?path=/calendar/action/compose&rru=addevent`;
              //   calendarUrl += `&subject=${encodeURIComponent(event.title)}`;
              //   calendarUrl += `&startdt=${formatDateForCalendar(event.start)}`;
              //   calendarUrl += `&enddt=${formatDateForCalendar(event.end)}`;
              //   calendarUrl += `&location=${encodeURIComponent(event.location)}`;
              //   calendarUrl += `&body=${encodeURIComponent(event.description)}`;
              // }
              
              window.open(calendarUrl, '_blank');
            }}
          >
            Agrega a tu calendario
          </Button>
      </div>
    </div>
  )
}