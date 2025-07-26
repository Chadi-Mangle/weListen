export interface ArtworkUrl {
  url: string;
}

export interface SongAttributes {
  name?: string;
  artwork?: ArtworkUrl;
  albumName?: string;
}

export interface Song {
  key?: string;
  title?: string;
  subtitle?: string;
  images?: {
    coverart?: string;
  };
  attributes?: SongAttributes;
}

export interface SongBarProps {
  song: Song;
  i: number;
  artistId?: string | null;
  isPlaying: boolean;
  activeSong?: Song | null;
  handlePauseClick: () => void;
  handlePlayClick: (song: Song, index: number) => void;
}

export interface SongFormData {
    title: string;
    artist: string;
    album: string;
    audio_file: File | null;
  }