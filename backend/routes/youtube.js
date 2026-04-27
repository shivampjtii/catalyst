const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');

const YT_API = 'https://www.googleapis.com/youtube/v3';

// @route GET /api/youtube/playlist/:playlistId
router.get('/playlist/:playlistId', protect, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: 'YouTube API key not configured' });
    }

    // Get playlist info
    const playlistRes = await axios.get(`${YT_API}/playlists`, {
      params: {
        part: 'snippet,contentDetails',
        id: playlistId,
        key: apiKey
      }
    });

    if (!playlistRes.data.items?.length) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const playlistInfo = playlistRes.data.items[0];
    
    // Get all videos in playlist
    let videos = [];
    let nextPageToken = '';
    
    do {
      const videosRes = await axios.get(`${YT_API}/playlistItems`, {
        params: {
          part: 'snippet,contentDetails',
          playlistId,
          maxResults: 50,
          pageToken: nextPageToken || undefined,
          key: apiKey
        }
      });

      const items = videosRes.data.items || [];
      
      // Get video durations
      const videoIds = items.map(item => item.contentDetails.videoId).join(',');
      const durationsRes = await axios.get(`${YT_API}/videos`, {
        params: {
          part: 'contentDetails',
          id: videoIds,
          key: apiKey
        }
      });

      const durationMap = {};
      durationsRes.data.items.forEach(v => {
        const match = v.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
          const hours = parseInt(match[1] || 0);
          const minutes = parseInt(match[2] || 0);
          const seconds = parseInt(match[3] || 0);
          durationMap[v.id] = hours * 3600 + minutes * 60 + seconds;
        }
      });

      items.forEach((item, index) => {
        if (item.snippet.title !== 'Private video' && item.snippet.title !== 'Deleted video') {
          videos.push({
            youtubeId: item.contentDetails.videoId,
            title: item.snippet.title,
            description: item.snippet.description?.slice(0, 300) || '',
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
            duration: durationMap[item.contentDetails.videoId] || 0,
            order: videos.length + 1,
            playlistId
          });
        }
      });

      nextPageToken = videosRes.data.nextPageToken;
    } while (nextPageToken);

    const totalDuration = videos.reduce((acc, v) => acc + v.duration, 0);

    res.json({
      playlist: {
        id: playlistId,
        title: playlistInfo.snippet.title,
        description: playlistInfo.snippet.description?.slice(0, 500) || '',
        thumbnail: playlistInfo.snippet.thumbnails?.high?.url || '',
        channelTitle: playlistInfo.snippet.channelTitle,
        totalVideos: videos.length,
        totalDuration
      },
      videos
    });
  } catch (error) {
    console.error('YouTube API error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to fetch playlist', 
      error: error.response?.data?.error?.message || error.message 
    });
  }
});

module.exports = router;
