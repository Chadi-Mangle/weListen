import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'consumer' | 'creator' | null;

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  playlists: Playlist[];
  addPlaylist: (playlist: Playlist) => void;
  likedSongs: Song[];
  toggleLikeSong: (song: Song) => void;
  isSongLiked: (id: string) => boolean;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  songs: Song[];
  addSong: (song: Song) => void;
  removeSong: (id: string) => void;
  albums: Album[];
  addAlbum: (album: Album) => void;
  removeAlbum: (id: string) => void;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
  audioUrl?: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  songs: Song[];
}

export interface Album {
  id: string;
  title: string;
  cover: string;
  songs: Song[];
}

interface UserProfile {
  name: string;
  bio: string;
  profileImage: string;
  coverImage: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('userRole');
    return saved ? (saved as UserRole) : null;
  });
  
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('playlists');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Favoris',
        description: 'Mes morceaux préférés',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1740&auto=format&fit=crop',
        songs: []
      }
    ];
  });
  
  const [likedSongs, setLikedSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('likedSongs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('creatorSongs');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'DKR', artist: 'Your Artist Name', album: 'Singles', cover: 'https://i1.sndcdn.com/artworks-000224127351-494034-t500x500.jpg', duration: '3:15' },
      { id: '2', title: 'GIMS', artist: 'Your Artist Name', album: 'Singles', cover: 'https://i1.sndcdn.com/artworks-sLK6Oe4dvKWLvVLB-U8S6mg-t500x500.jpg', duration: '4:05' },
      { id: '3', title: 'Longueur d\'avance', artist: 'Your Artist Name', album: 'Singles', cover: 'https://cdn.alza.cz/Foto/ImgGalery/Image/booba-ultra-cover.jpg', duration: '2:55' },
      { id: '4', title: 'Pitbull', artist: 'Your Artist Name', album: 'Singles', cover: 'https://pbs.twimg.com/media/D9XTKcYWwAEAA0W.jpg', duration: '3:45' },
    ];
  });
  
  const [albums, setAlbums] = useState<Album[]>(() => {
    const saved = localStorage.getItem('creatorAlbums');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: "User Name",
      bio: "Partagez votre expérience musicale et décrivez votre profil d'auditeur.",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2064&auto=format&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop"
    };
  });
  
  useEffect(() => {
    localStorage.setItem('userRole', userRole || '');
  }, [userRole]);
  
  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);
  
  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);
  
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);
  
  useEffect(() => {
    localStorage.setItem('creatorSongs', JSON.stringify(songs));
  }, [songs]);
  
  useEffect(() => {
    localStorage.setItem('creatorAlbums', JSON.stringify(albums));
  }, [albums]);
  
  const addPlaylist = (playlist: Playlist) => {
    setPlaylists([...playlists, playlist]);
  };
  
  const toggleLikeSong = (song: Song) => {
    if (likedSongs.some(s => s.id === song.id)) {
      setLikedSongs(likedSongs.filter(s => s.id !== song.id));
    } else {
      setLikedSongs([...likedSongs, song]);
    }
  };
  
  const isSongLiked = (id: string) => {
    return likedSongs.some(song => song.id === id);
  };
  
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };
  
  const addSong = (song: Song) => {
    setSongs([...songs, song]);
  };
  
  const removeSong = (id: string) => {
    setSongs(songs.filter(song => song.id !== id));
  };
  
  const addAlbum = (album: Album) => {
    setAlbums([...albums, album]);
  };
  
  const removeAlbum = (id: string) => {
    setAlbums(albums.filter(album => album.id !== id));
  };
  
  return (
    <AppContext.Provider value={{ 
      userRole, 
      setUserRole, 
      playlists, 
      addPlaylist, 
      likedSongs, 
      toggleLikeSong,
      isSongLiked,
      userProfile,
      updateUserProfile,
      songs,
      addSong,
      removeSong,
      albums,
      addAlbum,
      removeAlbum
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};