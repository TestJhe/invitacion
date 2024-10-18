'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ResourceLoader } from '../components/ResourceLoader'
import { Overlay } from '../components/Overlay'
import { FinalImages } from '../components/FinalImages'
import { Characters } from '../components/Characters'

const backgrounds = [
  { id: 1, image: '/resources/img/FondoC1.png' },
  { id: 2, image: '/resources/img/FondoC2.png' },
  { id: 3, image: '/resources/img/FondoC3.png' },
];

const characters = [
  { id: 1, name: '', image: '/resources/img/Bartolito3.png', backgroundId: 1 },
  { id: 2, name: '', image: '/resources/img/DonaPancha.png', backgroundId: 1 },
  { id: 3, name: '', image: '/resources/img/LoboBeto2.png', backgroundId: 1 },
  { id: 4, name: '', image: '/resources/img/VacaLola.png', backgroundId: 1 },
  { id: 5, name: '', image: '/resources/img/Percheron.png', backgroundId: 2 },
  { id: 6, name: '', image: '/resources/img/Pollito2.png', backgroundId: 2 },
  { id: 7, name: '', image: '/resources/img/Zenon2.png', backgroundId: 2 },
  { id: 8, name: '', image: '/resources/img/GalloPinto2.png', backgroundId: 2 },
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function CharacterCarouselComponent() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isScrolling, setIsScrolling] = useState(false)
  const [showFinalImages, setShowFinalImages] = useState(false)
  const [finalImageIndex, setFinalImageIndex] = useState(0)
  const [howl, setHowl] = useState<Howl | null>(null)
  const [showOverlay, setShowOverlay] = useState(true)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cachedImages] = useState<{ [key: string]: string }>({})
  const [finalImages, setFinalImages] = useState<Array<{ id: number, name: string, image: string, backgroundId: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    fetch('/finalImageList.json')
      .then(response => response.json())
      .then((imageList: string[]) => {
        const shuffledImages = shuffleArray(imageList)
        setFinalImages(shuffledImages.map((image, index) => ({
          id: 9 + index,
          name: '',
          image,
          backgroundId: 3
        })))
      })
      .catch(error => console.error('Error loading image list:', error))
  }, [])

  const startExperience = () => {
    if (howl && !isAudioReady) {
      howl.play()
      setIsAudioReady(true)
      setShowOverlay(false)
    }
  }

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (!isScrolling) {
        setIsScrolling(true)
        if (showFinalImages) {
          if (!isMobile && e.deltaY <= 0) {
            handleFinalImagesScroll()
          } else if (isMobile && e.deltaY > 0) {
            handleFinalImagesScroll()
          }
        } else {
          handleCharacterScroll(e.deltaY <= 0)
        }
        setTimeout(() => setIsScrolling(false), 500)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      const startY = touch.clientY
      
      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0]
        const deltaY = startY - touch.clientY
        
        if (Math.abs(deltaY) > 50) { // Threshold for swipe
          if (showFinalImages) {
            if (deltaY < 0) {
              handleFinalImagesScroll()
            }
          } else {
            handleCharacterScroll(deltaY < 0)
          }
          document.removeEventListener('touchmove', handleTouchMove)
        }
      }
      
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', () => {
        document.removeEventListener('touchmove', handleTouchMove)
      }, { once: true })
    }

    window.addEventListener('wheel', handleScroll)
    window.addEventListener('touchstart', handleTouchStart)

    return () => {
      
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [isScrolling, currentIndex, showFinalImages, finalImageIndex, isMobile])

  useEffect(() => {
    if (showFinalImages) {
      const timer = setInterval(() => {
        setFinalImageIndex((prevIndex) => (prevIndex + 1) % finalImages.length)
      }, 5000) 

      return () => clearInterval(timer)
    }
  }, [showFinalImages, finalImages.length])

  useEffect(() => {
    if (!showFinalImages && !isScrolling) {
      const timer = setInterval(() => {
        handleCharacterScroll(false)
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [showFinalImages, isScrolling, currentIndex])

  const handleCharacterScroll = (scrollUp: boolean) => {
    setDirection(scrollUp ? -1 : 1)
    setCurrentIndex((prevIndex) => {
      const newIndex = scrollUp
        ? (prevIndex - 1 + characters.length) % characters.length
        : (prevIndex + 1) % characters.length
      
      if (newIndex === characters.length - 1 && !scrollUp) {
        setTimeout(() => {
          setShowFinalImages(true)
          setFinalImageIndex(0)
        }, 500)
      }
      return newIndex
    })
  }

  const handleFinalImagesScroll = () => {
    setShowFinalImages(false)
    setCurrentIndex(0)
    setDirection(-1)
  }

  const getVisibleCharacters = () => {
    const visibleCharacters = []
    for (let i = 0; i <= 2; i++) {
      const index = (currentIndex + i) % characters.length
      visibleCharacters.push(characters[index])
    }
    return visibleCharacters
  }

  const getCurrentBackground = () => {
    const currentItem = showFinalImages ? finalImages[finalImageIndex] : characters[currentIndex]
    const background = backgrounds.find(bg => bg.id === currentItem.backgroundId)
    return background ? background.image : ''
  }

  const getImageSrc = (src: string) => cachedImages[src] || src

  const handleClickNavigation = (direction: 'left' | 'right') => {
    if (showFinalImages) {
      if (direction === 'left') {
        setFinalImageIndex((prevIndex) => 
          prevIndex === 0 ? finalImages.length - 1 : prevIndex - 1
        )
      } else {
        setFinalImageIndex((prevIndex) => 
          (prevIndex + 1) % finalImages.length
        )
      }
    } else {
      handleCharacterScroll(direction === 'left')
    }
  }

  const resources = [
    ...backgrounds.map(bg => ({ type: 'image' as const, src: bg.image })),
    ...characters.map(char => ({ type: 'image' as const, src: char.image })),
    ...finalImages.map(img => ({ type: 'image' as const, src: img.image })),
    { type: 'audio' as const, src: '/resources/sound/alboroto.mp3' }
  ]

  const handleLoadComplete = () => {
    setIsLoading(false)
    const sound = new Howl({
      src: ['/resources/sound/alboroto.mp3'],
      loop: true,
      volume: 0.5,
      autoplay: false,
    })
    setHowl(sound)
  }

  if (isLoading) {
    return <ResourceLoader resources={resources} onLoadComplete={handleLoadComplete} />
  }

  if (showOverlay) {
    return <Overlay onStart={startExperience} />
  }

  return (
    <div className="h-screen relative overflow-hidden bg-black">
      <motion.div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: `url(${getImageSrc(getCurrentBackground())})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          width: '100%',
          transition: 'background-image 0.5s ease-in-out',
          ...(typeof window !== 'undefined' && window.innerWidth >= 768
            ? {
                backgroundSize: 'calc(115vh) 100vh',
                backgroundAttachment: 'fixed',
              }
            : {
                backgroundSize: 'cover',
              }),
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center z-10 pb-2 md:pb-4 h-2/3 md:h-auto">
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 z-20 transition-colors duration-200"
          onClick={() => handleClickNavigation('left')}
          aria-label="Navegar a la izquierda"
        >
          <ChevronLeft size={24} />
        </button>
        {!showFinalImages ? (
          <Characters
            characters={getVisibleCharacters()}
            direction={direction}
            getImageSrc={getImageSrc}
          />
        ) : (
          <FinalImages
            images={finalImages}
            currentIndex={finalImageIndex}
            getImageSrc={getImageSrc}
          />
        )}
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 z-20 transition-colors duration-200"
          onClick={() => handleClickNavigation('right')}
          aria-label="Navegar a la derecha"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}