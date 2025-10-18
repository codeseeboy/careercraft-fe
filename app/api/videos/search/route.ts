import { NextResponse } from "next/server"

// Define interfaces for API responses
interface PipedVideoItem {
  type: string;
  id: string;
  title: string;
  uploader?: string;
  thumbnails?: { url?: string }[];
  duration?: number;
  views?: number;
}

interface InvidiousVideoItem {
  videoId: string;
  title: string;
  author?: string;
  lengthSeconds?: number;
}

interface VideoResult {
  id: string;
  title: string;
  channelTitle?: string;
  thumbnail: string;
  duration?: number;
  viewCount?: number;
}

// Server-side proxy to fetch YouTube search results reliably with multiple fallback sources
// Returns complete info required for embedding: videoId, title, channelTitle, thumbnail
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get("title")
    const limitParam = searchParams.get("limit")
    const limit = Math.min(Number(limitParam || 6), 12)
    const categoryParam = searchParams.get("category") || "education"

    if (!title || title.trim().length < 2) {
      return NextResponse.json({ data: [] }, { status: 200 })
    }

    // Try multiple APIs in sequence for more reliability
    const sources = [
      // Primary source - Piped API
      async () => {
        console.log(`Searching for videos about: "${title}" via Piped API`)
        // Add educational/tutorial context if not already present
        const searchQuery = title.toLowerCase().includes("tutorial") 
          ? title 
          : `${title} tutorial`
          
        const pipedUrl = `https://piped.video/api/v1/search?q=${encodeURIComponent(searchQuery)}&region=US&filter=all`
        const res = await fetch(pipedUrl, {
          cache: "no-store",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; CareerCraftBot/1.0) Chrome/120.0 Safari/537.36",
          },
          next: { revalidate: 3600 } // Cache for 1 hour
        })
        
        if (!res.ok) throw new Error(`Piped API error: ${res.status}`)
        
        const json = await res.json();
        const videos = Array.isArray(json) ? json as PipedVideoItem[] : [];
        if (!videos.length) throw new Error("Invalid response format")
        
        return videos
          .filter(item => item.type === "video" && item.id && item.title)
          .slice(0, limit)
          .map(v => ({
            id: v.id,
            title: v.title,
            channelTitle: v.uploader,
            thumbnail: v.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`,
            duration: v.duration,
            viewCount: v.views,
          } as VideoResult))
      },
      
      // Fallback source - InvidiousAPI (another YouTube frontend)
      async () => {
        console.log(`Searching for videos about: "${title}" via Invidious API`)
        // Use "tutorial" in query for educational content if not already there
        const searchQuery = title.toLowerCase().includes("tutorial") 
          ? title 
          : `${title} ${categoryParam} tutorial`
          
        const invidiousUrl = `https://invidious.snopyta.org/api/v1/search?q=${encodeURIComponent(searchQuery)}&type=video&sort_by=relevance`
        const res = await fetch(invidiousUrl, {
          cache: "no-store",
          next: { revalidate: 3600 } // Cache for 1 hour
        })
        
        if (!res.ok) throw new Error(`Invidious API error: ${res.status}`)
        
        const json = await res.json();
        const videos = Array.isArray(json) ? json as InvidiousVideoItem[] : [];
        if (!videos.length) throw new Error("Invalid response format")
        
        return videos.slice(0, limit).map(v => ({
          id: v.videoId,
          title: v.title,
          channelTitle: v.author,
          thumbnail: `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`,
          duration: v.lengthSeconds,
        } as VideoResult))
      },
      
      // Last fallback - return hardcoded reliable educational videos if all APIs fail
      async () => {
        console.log("Using fallback hardcoded videos for reliable education content")
        // Return some reliable educational videos that we know exist
        return [
          {
            id: "PkZNo7MFNFg",
            title: "Learn JavaScript - Full Course for Beginners",
            channelTitle: "freeCodeCamp.org",
            thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg",
            duration: 12345,
          },
          {
            id: "rfscVS0vtbw",
            title: "Learn Python - Full Course for Beginners",
            channelTitle: "freeCodeCamp.org",
            thumbnail: "https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg",
            duration: 14526,
          },
          {
            id: "eIrMbAQSU34",
            title: "Java Tutorial for Beginners",
            channelTitle: "Programming with Mosh",
            thumbnail: "https://i.ytimg.com/vi/eIrMbAQSU34/mqdefault.jpg",
            duration: 7513,
          },
          {
            id: "BwuLxPH8IDs",
            title: "TypeScript Course for Beginners",
            channelTitle: "Academind",
            thumbnail: "https://i.ytimg.com/vi/BwuLxPH8IDs/mqdefault.jpg",
            duration: 8421,
          }
        ].slice(0, limit)
      }
    ]
    
    // Try each source in order until one succeeds
    for (const fetchSource of sources) {
      try {
        const videos = await fetchSource()
        if (videos && videos.length > 0) {
          console.log(`Found ${videos.length} videos for "${title}"`)
          return NextResponse.json({ data: videos }, { status: 200 })
        }
      } catch (error) {
        console.error(`Video search source failed:`, error)
        // Continue to next source
      }
    }
    
    // If all sources fail (unlikely with our fallback), return empty array
    return NextResponse.json({ data: [] }, { status: 200 })
  } catch (error) {
    console.error("Video search API error:", error)
    // Graceful fallback - never crash
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}
