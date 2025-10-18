"use client"

import { useEffect, useState } from "react"

interface YouTubePlayerProps {
  videoUrl: string
  title?: string
  className?: string
}

export function YouTubePlayer({ videoUrl, title, className = "" }: YouTubePlayerProps) {
  const [mounted, setMounted] = useState(false)
  
  // Extract video ID from URL
  const videoId = getYouTubeVideoId(videoUrl)
  
  // Check if it's a playlist
  const isPlaylist = videoUrl.includes("playlist")
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div 
        className={`aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}
      >
        Loading video player...
      </div>
    )
  }
  
  if (!videoId && !isPlaylist) {
    return (
      <div 
        className={`aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}
      >
        Invalid video URL
      </div>
    )
  }
  
  let embedUrl: string
  
  if (isPlaylist) {
    // Extract playlist ID
    const playlistMatch = videoUrl.match(/list=([^&]+)/)
    const playlistId = playlistMatch ? playlistMatch[1] : ""
    
    if (!playlistId) {
      return (
        <div 
          className={`aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}
        >
          Invalid playlist URL
        </div>
      )
    }
    
    embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}`
  } else {
    // Regular video
    embedUrl = `https://www.youtube.com/embed/${videoId}`
  }
  
  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        className="w-full h-full rounded-lg"
        src={embedUrl}
        title={title || "YouTube video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

// Helper function to extract video ID from YouTube URL
function getYouTubeVideoId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7]?.length === 11) ? match[7] : "";
}
