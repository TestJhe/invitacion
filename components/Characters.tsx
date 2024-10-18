import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Character {
  id: number
  name: string
  image: string
}

interface CharactersProps {
  characters: Character[]
  direction: number
  getImageSrc: (src: string) => string
}

export function Characters({ characters, direction, getImageSrc }: CharactersProps) {
  return (
    <div className="flex items-end space-x-4 md:space-x-8 overflow-hidden max-w-full px-4 h-full md:h-auto">
      <AnimatePresence initial={false} custom={direction}>
        {characters.map((character, index) => (
          <motion.div
            key={character.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
            transition={{ duration: 0.5 }}
            className="text-center flex-shrink-0 h-full md:h-auto flex flex-col justify-end"
          >
            <motion.img
              src={getImageSrc(character.image)}
              alt={character.name}
              className="w-32 h-40 md:w-64 md:h-80 object-contain mb-4 rounded-lg shadow-lg"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
            />
            {index === 1 && character.name && (
              <motion.h2 
                className="text-lg md:text-2xl font-bold text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                {character.name}
              </motion.h2>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}