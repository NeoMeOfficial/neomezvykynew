# YouTube Video Integration Demo

## Sample Exercise with YouTube Video

Here's how your provided YouTube link would be integrated:

**Exercise:** "Dychové cvičenia a core aktivácia"  
**YouTube URL:** https://www.youtube.com/watch?v=VQiGJRBkkSQ&t=66s

### Current Code Structure:
```javascript
{
  id: 'p1-1',
  name: 'Dychové cvičenia a core aktivácia',
  duration: '10 min',
  type: 'core',
  videoUrl: 'https://www.youtube.com/watch?v=VQiGJRBkkSQ&t=66s', // ✅ Your YouTube link here
  thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
  description: 'Základné dychové techniky pre aktiváciu hlbokého stabilizačného systému',
  instructions: [
    'Ľahni si na chrbát, nohy zohnú v kolenách',
    'Polož jednu ruku na hruď, druhú na brucho',
    // ... more instructions
  ],
  tips: [
    'Sústreď sa na pomalý a kontrolovaný dych',
    // ... more tips
  ]
}
```

### What Users Will See:
1. **In Program List:** Exercise card with thumbnail and duration
2. **When Clicking Exercise:** Full-screen video player with embedded YouTube video
3. **Video Features:**
   - Starts at 1:06 (t=66s parameter respected)
   - Full YouTube controls (play, pause, seek, fullscreen)
   - Professional embedded player
   - Exercise instructions below video
   - Completion tracking buttons

### Technical Implementation:
- YouTube URLs automatically convert to embedded iframes
- Time parameters (t=66s) are preserved
- Responsive design for all screen sizes
- Nordic glassmorphism design maintained