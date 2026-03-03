// Secure Video Service - Handles subscription validation and secure video access
export interface SecureVideoAccess {
  success: boolean;
  videoUrl?: string;
  embedUrl?: string;
  accessToken?: string;
  expiresAt?: number;
  error?: string;
}

export interface VideoAccessRequest {
  exerciseId: string;
  programId: string;
  userId: string;
  sessionToken: string;
}

class SecureVideoService {
  private baseUrl = '/api/secure-video';
  private activeTokens = new Map<string, { token: string; expiresAt: number }>();
  
  // Generate secure access token for video
  private generateAccessToken(exerciseId: string, userId: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2);
    return btoa(`${exerciseId}:${userId}:${timestamp}:${randomStr}`);
  }

  // Validate user subscription (mock implementation)
  private async validateSubscription(userId: string): Promise<boolean> {
    // In real implementation, this would call your backend
    // For demo purposes, ALWAYS return true to allow access
    console.log('Demo: Allowing video access for user:', userId);
    return true;
  }

  // Get YouTube video ID from various YouTube URL formats
  private extractYouTubeVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  // Get start time parameter from YouTube URL
  private extractStartTime(url: string): number {
    const tMatch = url.match(/[?&]t=(\d+)s?/);
    return tMatch ? parseInt(tMatch[1]) : 0;
  }

  // Request secure access to a video
  async requestVideoAccess(request: VideoAccessRequest): Promise<SecureVideoAccess> {
    try {
      // 1. Validate subscription
      const hasSubscription = await this.validateSubscription(request.userId);
      if (!hasSubscription) {
        return {
          success: false,
          error: 'Subscription required to access this content'
        };
      }

      // 2. Get the original YouTube URL (in real app, this would be from database)
      const originalUrl = this.getVideoUrlForExercise(request.exerciseId);
      if (!originalUrl) {
        return {
          success: false,
          error: 'Video not found'
        };
      }

      // 3. Generate secure access token
      const accessToken = this.generateAccessToken(request.exerciseId, request.userId);
      const expiresAt = Date.now() + (2 * 60 * 60 * 1000); // 2 hours

      // 4. Store token with expiration
      this.activeTokens.set(accessToken, { token: accessToken, expiresAt });

      // 5. Create secure embed URL
      const videoId = this.extractYouTubeVideoId(originalUrl);
      const startTime = this.extractStartTime(originalUrl);
      
      if (!videoId) {
        return {
          success: false,
          error: 'Invalid video URL'
        };
      }

      // Create secure embed URL with minimal restrictions for demo
      const embedUrl = `https://www.youtube.com/embed/${videoId}?` + new URLSearchParams({
        start: startTime.toString(),
        autoplay: '0',
        controls: '1', // Show YouTube controls for demo
        modestbranding: '1', // Reduce YouTube branding
        rel: '0', // Don't show related videos
        enablejsapi: '1' // Enable JS API for control
      }).toString();

      console.log('Demo: Generated embed URL:', embedUrl);

      return {
        success: true,
        embedUrl,
        accessToken,
        expiresAt,
        videoUrl: originalUrl // Keep for reference
      };

    } catch (error) {
      console.error('Error requesting video access:', error);
      return {
        success: false,
        error: 'Failed to access video'
      };
    }
  }

  // Validate access token
  validateAccessToken(token: string): boolean {
    const tokenData = this.activeTokens.get(token);
    if (!tokenData) return false;
    
    if (Date.now() > tokenData.expiresAt) {
      this.activeTokens.delete(token);
      return false;
    }
    
    return true;
  }

  // Revoke access token
  revokeAccessToken(token: string): void {
    this.activeTokens.delete(token);
  }

  // Get video URL for exercise (mock implementation)
  private getVideoUrlForExercise(exerciseId: string): string | null {
    // In real implementation, this would be a database lookup
    const videoMap: Record<string, string> = {
      'p1-1': 'https://www.youtube.com/watch?v=jNQXAC9IVRw', // Basic YouTube video that allows embedding
      // 'p1-1': 'https://www.youtube.com/watch?v=VQiGJRBkkSQ&t=66s', // Your original video (may be blocked)
      // Add more exercise IDs and their secure video URLs
    };
    
    return videoMap[exerciseId] || null;
  }

  // Clean up expired tokens
  cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, data] of this.activeTokens.entries()) {
      if (now > data.expiresAt) {
        this.activeTokens.delete(token);
      }
    }
  }
}

export const secureVideoService = new SecureVideoService();

// Auto-cleanup expired tokens every 10 minutes
setInterval(() => {
  secureVideoService.cleanupExpiredTokens();
}, 10 * 60 * 1000);