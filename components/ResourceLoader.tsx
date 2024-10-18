import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cacheImage,  isCached } from '@/scripts/imageCache'
import { Howl } from 'howler'

interface Resource {
  type: 'image' | 'audio'
  src: string
}

interface ResourceLoaderProps {
  resources: Resource[]
  onLoadComplete: () => void
}

export function ResourceLoader({ resources, onLoadComplete }: ResourceLoaderProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const loadResources = async () => {
      let loadedCount = 0

      for (const resource of resources) {
        if (resource.type === 'image') {
          if (!isCached(resource.src)) {
            await cacheImage(resource.src)
          }
        } else if (resource.type === 'audio') {
          await new Promise<void>((resolve) => {
            new Howl({
              src: [resource.src],
              onload: () => resolve(),
            })
          })
        }

        loadedCount++
        setProgress((loadedCount / resources.length) * 100)
      }

      onLoadComplete()
    }

    loadResources()
  }, [resources, onLoadComplete])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Cargando recursos</h2>
        <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-white mt-2">{Math.round(progress)}%</p>
      </motion.div>
    </div>
  )
}