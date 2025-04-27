"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"

export const AudioPlayer: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pixel%20Dreams-wNU5nif9OTg2n5YIcFd3j8bteFV2As.mp3",
    )
    audioRef.current.loop = true
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }, [isMuted])

  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-white stroke-[1.5]" />
      ) : (
        <Volume2 className="w-5 h-5 text-white stroke-[1.5]" />
      )}
    </button>
  )
}
