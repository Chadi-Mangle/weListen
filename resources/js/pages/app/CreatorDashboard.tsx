import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, ArrowUpRight, Music, Calendar, X, Image, MusicIcon, CheckCircle2, Album, List, ChevronDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { playSoundEffect } from '@/utils/soundEffects';
import StarBackground from '@/components/StarBackground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import ArtistBanner from '@/components/ArtistBanner';
import { useApp } from '@/contexts/AppContext';
import SongManagement from '@/components/SongManagement';
import AlbumManagement from '@/components/AlbumManagement';
import AppHeader from '@/components/AppHeader';
import { useForm, usePage } from '@inertiajs/react';

// Interfaces pour typer les données
interface Song {
  id: string;
  title: string;
  description: string;
  genre: string;
  releaseDate: string | null;
  cover: string;
  songUrl: string | null;
  duration: string;
  streams: number | string;
  created_at: string;
}

interface Album {
  id: string;
  title: string;
  description: string;
  cover: string;
  releaseDate: string | null;
  songs: { id: string; title: string; duration: string }[];
  songsCount?: number; // Nouvelle propriété pour le nombre de titres
  created_at: string;
}

interface ArtistInfo {
  name: string;
  image: string;
  bio: string;
  stats: {
    total_musics?: number;
    total_albums?: number;
    followers?: string;
    tracks?: number;
    albums?: number;
    monthlyListeners?: string;
  };
}

interface PageProps {
  songs: Song[];
  albums: Album[];
  artistInfo: ArtistInfo;
}

const CreatorDashboard = () => {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  const { data, setData, post, processing, progress, errors, reset } = useForm({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    explicit: false,
    audio_file: null as File | null,
    cover_image: null as File | null,
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showSongManagement, setShowSongManagement] = useState(false);
  const [showAlbumManagement, setShowAlbumManagement] = useState(false);
  
  // Récupérer les données de la page via Inertia
  const { props } = usePage<PageProps>();
  const { songs = [], albums = [], artistInfo = { 
    name: '',
    image: '/default-artist.jpg',
    bio: '',
    stats: {
      albumCoubnt: 0,
      tracks: 0,
      likes: 0,
    }
  }} = props;
  
  const { toast } = useToast();
  
  // Définir les valeurs par défaut pour les animations même si les données ne sont pas chargées
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };
  
  const handleTrackHover = (id: string | null) => {
    if (id !== hoveredTrack) {
      playSoundEffect('hover', 0.1);
    }
    setHoveredTrack(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setData(name as any, target.checked);
    } else if (type === 'file') {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      
      if (files && files.length > 0) {
        setData(name as any, files[0]);
      }
    } else {
      setData(name as any, value);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Données avant envoi:", {
      title: data.title,
      audioFile: data.audio_file ? data.audio_file.name : null,
      coverImage: data.cover_image ? data.cover_image.name : null
    });
    
    post(route('songs.store'), {
      forceFormData: true,
      onSuccess: () => {
        setTimeout(() => {
          reset();
          setShowUploadForm(false);
          toast({
            title: "Titre téléchargé avec succès",
            description: `"${data.title}" est maintenant disponible à l'écoute.`
          });
        }, 500);
      },
      onError: (errors) => {
        console.error("Erreurs d'upload:", errors);
        toast({
          title: "Erreur lors du téléchargement",
          description: "Veuillez vérifier vos données et réessayer.",
          variant: "destructive"
        });
      }
    });
  };
  
  // Utiliser les informations de l'artiste depuis les props avec des valeurs par défaut
  const formattedStats = {
    albumCount: artistInfo?.stats?.albumCount || 0,
    tracks: artistInfo?.stats?.tracks || artistInfo?.stats?.tracks || 0,
    likes: artistInfo?.stats?.likes || artistInfo?.stats?.albums || 0,
  };
  
  // Utiliser les chansons les plus récentes pour l'affichage
  const topTracks = songs?.slice(0, 4) || [];
  
  // Utiliser les données réelles au lieu des données statiques
  const recentUploads = songs?.slice(0, 3).map(song => ({
    id: song.id,
    title: song.title,
    date: song.created_at,
    streams: song.streams?.toString() || '0',
    cover: song.cover
  })) || [];
  
  // Vérifier si les données sont disponibles avant de rendre la page
  if (!artistInfo || !songs || !albums) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-audio-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden pb-20">
      <AppHeader />
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-audio-dark via-audio-dark/95 to-audio-dark"></div>
        <StarBackground intensity={0.3} speed={0.2} />
        
        <div className="absolute bottom-0 left-0 right-0 h-full pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-audio-accent/50 to-transparent animate-pulse-soft"></div>
          <div className="absolute bottom-4 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-pulse-soft" style={{animationDelay: '0.3s'}}></div>
          <div className="absolute bottom-8 w-full h-[1px] bg-gradient-to-r from-transparent via-audio-accent/30 to-transparent animate-pulse-soft" style={{animationDelay: '0.6s'}}></div>
          
          <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-pulse-soft" style={{animationDelay: '0.9s'}}></div>
          <div className="absolute top-0 bottom-0 right-1/4 w-[1px] bg-gradient-to-b from-transparent via-audio-accent/20 to-transparent animate-pulse-soft" style={{animationDelay: '1.2s'}}></div>
          
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-purple-500/5 blur-3xl animate-pulse-soft"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-audio-accent/5 blur-3xl animate-pulse-soft" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-indigo-500/5 blur-3xl animate-pulse-soft" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto relative pt-6">
        <ArtistBanner 
          name={artistInfo.name}
          image={artistInfo.image}
          bio={artistInfo.bio}
          stats={formattedStats}
        />

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mx-auto w-fit bg-black/10 backdrop-blur-sm p-1 border border-white/10 rounded-full overflow-hidden">
            <TabsTrigger 
              value="overview" 
              className="rounded-full px-4 text-xs font-medium data-[state=active]:bg-audio-accent/10 data-[state=active]:text-audio-accent data-[state=active]:backdrop-blur-md data-[state=active]:shadow-glow"
            >
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger 
              value="uploads" 
              className="rounded-full px-4 text-xs font-medium data-[state=active]:bg-audio-accent/10 data-[state=active]:text-audio-accent data-[state=active]:backdrop-blur-md data-[state=active]:shadow-glow"
            >
              Vos titres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 px-6">
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="flex flex-wrap justify-center mb-8">
                <Button 
                  variant="accent"
                  size="pill"
                  className="gap-2 px-6 py-2 shadow-glow"
                  onClick={() => {
                    setShowUploadForm(true);
                    playSoundEffect('click');
                  }}
                >
                  <Upload size={14} />
                  Télécharger un titre
                </Button>
              </div>
            </motion.section>
            
            {albums.length > 0 && (
              <motion.section
                variants={container}
                initial="hidden"
                animate="show" 
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-medium">Vos albums</h2>
                  <button 
                    className="text-audio-accent hover:text-audio-accent-light flex items-center gap-1 text-sm"
                    onClick={() => setShowAlbumManagement(true)}
                  >
                    Gérer <ArrowUpRight size={14} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {albums.map((album, index) => (
                    <motion.div
                      key={album.id}
                      variants={item}
                      className="backdrop-blur-sm border border-white/5 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-audio-accent/5 transition-shadow duration-300"
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <div className="relative aspect-square">
                        <img 
                          src={album.cover} 
                          alt={album.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button 
                            className="w-10 h-10 rounded-full bg-audio-accent/90 flex items-center justify-center hover:bg-audio-accent transition-colors"
                            onClick={() => playSoundEffect('click')}
                          >
                            <Play size={18} fill="white" className="text-white ml-0.5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-base">{album.title}</h3>
                        <div className="flex justify-between items-center mt-2 text-audio-light/60 text-xs">
                          <div className="flex items-center gap-1">
                            <Music size={12} />
                            {/* Utilisez la propriété songsCount ou comptez le tableau songs */}
                            <span>
                                {album.songsCount || (album.songs && album.songs.length) || 0} titres
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
            
            <motion.section
              variants={container}
              initial="hidden"
              animate="show" 
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-medium">Téléchargements récents</h2>
                <button 
                  className="text-audio-accent hover:text-audio-accent-light flex items-center gap-1 text-sm"
                  onMouseEnter={() => playSoundEffect('hover')}
                  onClick={() => playSoundEffect('click')}
                >
                  Voir tout <ArrowUpRight size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentUploads.map((upload, index) => (
                  <motion.div
                    key={upload.id}
                    variants={item}
                    className="backdrop-blur-sm border border-white/5 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-audio-accent/5 transition-shadow duration-300"
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <div className="relative aspect-square">
                      <img 
                        src={upload.cover} 
                        alt={upload.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                          className="w-10 h-10 rounded-full bg-audio-accent/90 flex items-center justify-center hover:bg-audio-accent transition-colors"
                          onClick={() => playSoundEffect('click')}
                        >
                          <Play size={18} fill="white" className="text-white ml-0.5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-base">{upload.title}</h3>
                      <div className="flex justify-between items-center mt-2 text-audio-light/60 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{upload.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={12} />
                          <span>{upload.streams}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
            
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-medium">Titres populaires</h2>
                <a 
                  href="#" 
                  className="text-sm text-audio-accent hover:text-audio-accent-light flex items-center gap-1"
                  onClick={() => playSoundEffect('hover')}
                >
                  Voir tout <ArrowUpRight size={14} />
                </a>
              </div>
              
              <Card className="bg-transparent backdrop-blur-sm border-white/5">
                <CardContent className="p-4">
                  <div className="space-y-1">
                    {topTracks.map((track) => (
                      <div 
                        key={track.id}
                        className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
                        onMouseEnter={() => handleTrackHover(track.id)}
                        onMouseLeave={() => handleTrackHover(null)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={track.cover} 
                              alt={track.title} 
                              className="w-10 h-10 object-cover rounded"
                            />
                            {hoveredTrack === track.id ? (
                              <button 
                                className="absolute inset-0 flex items-center justify-center bg-black/40"
                                onClick={() => playSoundEffect('click')}
                              >
                                <Play size={16} className="text-white" />
                              </button>
                            ) : null}
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{track.title}</h3>
                            <p className="text-xs text-audio-light/60">{typeof track.streams === 'number' ? track.streams.toLocaleString() : track.streams} likes</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-24">
                            <Progress value={80} className="h-1 bg-audio-surface/30" />
                          </div>
                          <span className="text-xs text-audio-light/60">{track.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="uploads" className="mt-6 px-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-medium">Vos titres</h2>
              <Button 
                variant="accent"
                size="pill"
                className="gap-2 shadow-glow"
                onClick={() => {
                  setShowUploadForm(true);
                  playSoundEffect('click');
                }}
              >
                <Upload size={14} />
                Télécharger
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
              <Card className="flex flex-col items-center justify-center p-6 h-48 backdrop-blur-sm bg-transparent border-dashed border-white/10">
                <Music size={32} className="text-audio-light/30 mb-2" />
                <h3 className="text-base font-medium text-audio-light/70 mb-1">Musique</h3>
                <p className="text-xs text-audio-light/50 text-center mb-4">Tous vos titres musicaux</p>
                <Button 
                  variant="accent" 
                  size="pill"
                  className="text-xs shadow-glow"
                  onClick={() => setShowSongManagement(true)}
                >
                  Gérer
                </Button>
              </Card>
              
              <Card className="flex flex-col items-center justify-center p-6 h-48 backdrop-blur-sm bg-transparent border-dashed border-white/10">
                <Album size={32} className="text-audio-light/30 mb-2" />
                <h3 className="text-base font-medium text-audio-light/70 mb-1">Albums</h3>
                <p className="text-xs text-audio-light/50 text-center mb-4">Vos compilations et albums</p>
                <Button 
                  variant="accent" 
                  size="pill"
                  className="text-xs shadow-glow"
                  onClick={() => setShowAlbumManagement(true)}
                >
                  Gérer
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showUploadForm && (
        <motion.div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-transparent backdrop-blur-xl border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-glow"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-medium text-audio-light text-sm">Nouveau titre</h3>
              <button 
                className="text-audio-light/60 hover:text-audio-light transition-colors rounded-full w-6 h-6 flex items-center justify-center hover:bg-white/5"
                onClick={() => setShowUploadForm(false)}
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-5" encType="multipart/form-data">
              {processing ? (
                <div className="text-center py-6">
                  <div className="mb-4">
                    <Progress value={progress?.percentage || 0} className="h-0.5 bg-audio-surface/30" />
                    <p className="text-xs mt-2 text-audio-light/70">Téléchargement en cours... {progress?.percentage ? Math.round(progress.percentage) : 0}%</p>
                  </div>
                  {(progress?.percentage || 0) === 100 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <CheckCircle2 className="text-green-400 mb-2" size={28} />
                      <p className="font-medium text-sm">Téléchargement réussi!</p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-5 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs text-audio-light/70 mb-1">Titre *</label>
                        <input
                          type="text"
                          name="title"
                          value={data.title}
                          onChange={handleInputChange}
                          className={`w-full bg-audio-surface/20 border ${errors.title ? 'border-red-500' : 'border-white/10'} rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-audio-accent/50`}
                          required
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                      </div>
                      
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs text-audio-light/70 mb-1">Genre *</label>
                        <div className="relative">
                          <select
                            name="genre"
                            value={data.genre}
                            onChange={handleInputChange}
                            className={`w-full bg-audio-surface/20 border ${errors.genre ? 'border-red-500' : 'border-white/10'} rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-audio-accent/50 text-audio-light appearance-none`}
                            required
                          >
                            <option value="" className="bg-audio-dark text-audio-light">Sélectionner</option>
                            <option value="rap" className="bg-audio-dark text-audio-light">Rap</option>
                            <option value="pop" className="bg-audio-dark text-audio-light">Pop</option>
                            <option value="rock" className="bg-audio-dark text-audio-light">Rock</option>
                            <option value="electronic" className="bg-audio-dark text-audio-light">Électronique</option>
                            <option value="jazz" className="bg-audio-dark text-audio-light">Jazz</option>
                            <option value="classical" className="bg-audio-dark text-audio-light">Classique</option>
                            <option value="other" className="bg-audio-dark text-audio-light">Autre</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-audio-light/50 pointer-events-none" />
                          {errors.genre && <p className="text-red-500 text-xs mt-1">{errors.genre}</p>}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-audio-light/70 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={data.description}
                        onChange={handleInputChange}
                        className={`w-full bg-audio-surface/20 border ${errors.description ? 'border-red-500' : 'border-white/10'} rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-audio-accent/50 min-h-[60px] resize-none`}
                      />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-audio-light/70 mb-1">Date de sortie</label>
                        <input
                          type="date"
                          name="releaseDate"
                          value={data.releaseDate}
                          onChange={handleInputChange}
                          className={`w-full bg-audio-surface/20 border ${errors.releaseDate ? 'border-red-500' : 'border-white/10'} rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-audio-accent/50`}
                        />
                        {errors.releaseDate && <p className="text-red-500 text-xs mt-1">{errors.releaseDate}</p>}
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-4">
                        <input
                          type="checkbox"
                          id="explicit"
                          name="explicit"
                          checked={data.explicit as boolean}
                          onChange={handleInputChange}
                          className="mr-2 h-3.5 w-3.5"
                        />
                        <label htmlFor="explicit" className="text-xs text-audio-light/70">Contenu explicite</label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="block text-xs text-audio-light/70 mb-1">Fichier audio *</label>
                        <div className={`border border-dashed ${errors.audio_file ? 'border-red-500' : data.audio_file ? 'border-audio-accent' : 'border-white/10'} rounded-md p-4 text-center`}>
                          {!data.audio_file ? (
                            <>
                              <MusicIcon size={20} className="mx-auto mb-2 text-audio-light/40" />
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  name="audio_file"
                                  accept="audio/*"
                                  onChange={(e) => setData('audio_file', e.target.files?.[0] || null)}
                                  className="hidden"
                                  required
                                />
                                <span className="px-3 py-1 border border-audio-accent/30 bg-transparent text-audio-accent rounded-full text-xs hover:bg-audio-accent/10 transition-colors">
                                  Parcourir
                                </span>
                              </label>
                            </>
                          ) : (
                            <div className="flex flex-col items-center">
                              <CheckCircle2 className="text-audio-accent mb-1" size={18} />
                              <p className="text-xs truncate max-w-full">
                                {data.audio_file.name}
                              </p>
                              <button
                                type="button"
                                className="text-xs text-audio-light/60 hover:text-audio-light mt-1"
                                onClick={() => setData('audio_file', null)}
                              >
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                        {errors.audio_file && <p className="text-red-500 text-xs mt-1">{errors.audio_file}</p>}
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-xs text-audio-light/70 mb-1">Image de couverture *</label>
                        <div className={`border border-dashed ${errors.cover_image ? 'border-red-500' : data.cover_image ? 'border-audio-accent' : 'border-white/10'} rounded-md p-4 text-center relative`}>
                          {!data.cover_image ? (
                            <>
                              <Image size={20} className="mx-auto mb-2 text-audio-light/40" />
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  name="cover_image"
                                  accept="image/*"
                                  onChange={(e) => setData('cover_image', e.target.files?.[0] || null)}
                                  className="hidden"
                                  required
                                />
                                <span className="px-3 py-1 border border-audio-accent/30 bg-transparent text-audio-accent rounded-full text-xs hover:bg-audio-accent/10 transition-colors">
                                  Parcourir
                                </span>
                              </label>
                            </>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 mb-1 overflow-hidden rounded">
                                <img 
                                  src={URL.createObjectURL(data.cover_image)} 
                                  alt="Prévisualisation" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs truncate max-w-full">
                                {data.cover_image.name}
                              </p>
                              <button
                                type="button"
                                className="text-xs text-audio-light/60 hover:text-audio-light mt-1"
                                onClick={() => setData('cover_image', null)}
                              >
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                        {errors.cover_image && <p className="text-red-500 text-xs mt-1">{errors.cover_image}</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-full border-white/10 hover:bg-white/5"
                      onClick={() => {
                        reset();
                        setShowUploadForm(false);
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="accent" 
                      size="sm"
                      className="text-xs rounded-full shadow-glow"
                      disabled={processing || !data.title || !data.genre || !data.audio_file || !data.cover_image}
                    >
                      {processing ? "Téléchargement..." : "Télécharger"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
      
      {showSongManagement && <SongManagement onClose={() => setShowSongManagement(false)} />}
      {showAlbumManagement && <AlbumManagement onClose={() => setShowAlbumManagement(false)} />}
    </div>
  );
};

export default CreatorDashboard;