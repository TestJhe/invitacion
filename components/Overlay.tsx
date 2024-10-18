import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

interface OverlayProps {
  onStart: () => void
}

export function Overlay({ onStart }: OverlayProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.p 
          className="text-white text-xl mb-4"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Usa los botones izquierda y derecha o haz scroll arriba y abajo para navegar
        </motion.p>
        <Button 
          onClick={onStart}
          className="text-2xl p-6 bg-[rgba(233,90,87,1)] hover:bg-[rgba(233,90,87,0.8)] transition-colors duration-300"
        >
          Iniciar Experiencia
        </Button>
      </motion.div>
    </div>
  )
}