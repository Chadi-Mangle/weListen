import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp, AppProvider } from '@/contexts/AppContext';
import { Plus, Music2, Heart, ChevronRight, Play, Search, Disc, Clock, Calendar, Shuffle, LayoutList, Headphones, MusicIcon, Sparkles, BookOpen, LightbulbIcon } from 'lucide-react';
import { playSoundEffect } from '@/utils/soundEffects';
import StarBackground from '@/components/StarBackground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppHeader from '@/components/AppHeader';
import { usePage } from '@inertiajs/react';

// Types pour les données provenant du backend
interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  songUrl: string | null;
  duration: string;
  streams?: number;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  songCount: number;
  genre?: string;
}

interface Artist {
  id: string;
  name: string;
  image: string;
  trackCount: number;
}

interface Anecdote {
  id: string;
  title: string;
  content: string;
  icon: string;
}

interface UserData {
  id: number;
  name: string;
  avatar: string;
}

// Composant qui utilise le contexte
const ConsumerDashboardContent = () => {
  // Récupérer les données depuis les props de la page
  const {
    recommendations,
    popularPlaylists,
    userPlaylists,
    likedSongs,
    listenHistory,
    musicAnecdotes,
    popularArtists,
    userData
  } = usePage().props as any;

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim() !== '') {
      // Utiliser l'API Inertia pour envoyer une requête POST
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = route('playlists.create');

      const nameInput = document.createElement('input');
      nameInput.name = 'name';
      nameInput.value = newPlaylistName;
      form.appendChild(nameInput);

      const csrfInput = document.createElement('input');
      csrfInput.name = '_token';
      csrfInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      form.appendChild(csrfInput);

      document.body.appendChild(form);
      form.submit();

      setNewPlaylistName('');
      setShowCreatePlaylist(false);
      playSoundEffect('click');
    }
  };

  const handleTrackHover = (id: string | null) => {
    if (id !== hoveredTrack) {
      playSoundEffect('hover', 0.1);
    }
    setHoveredTrack(id);
  };

  // Fonction pour obtenir l'icône appropriée basée sur le nom de l'icône
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={24} className="text-purple-300" />;
      case 'BookOpen':
        return <BookOpen size={24} className="text-blue-300" />;
      case 'LightbulbIcon':
        return <LightbulbIcon size={24} className="text-yellow-300" />;
      case 'Disc':
        return <Disc size={24} className="text-green-300" />;
      default:
        return <Music2 size={24} className="text-audio-accent" />;
    }
  };

  // Animations variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen overflow-x-hidden pb-20">
      <AppHeader />
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-audio-dark via-audio-dark/95 to-audio-dark"></div>
        <StarBackground intensity={0.3} speed={0.2} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-audio-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto relative pt-6 px-6">
        {/* User stats banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 overflow-hidden rounded-xl"
        >
          <div className="relative h-40 md:h-48">
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-r from-purple-900/20 to-audio-accent/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-audio-dark via-audio-dark/30 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-audio-light mb-2">Bonjour, {userData.name}</h1>
                  <p className="text-sm text-audio-light/70 mb-4">Découvrez de nouveaux titres adaptés à vos goûts</p>

                  <div className="flex gap-3">
                    <Button
                      className="border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full gap-2 text-xs py-1.5 h-8 px-3 backdrop-blur-sm"
                    >
                      <Shuffle size={14} />
                      Lecture aléatoire
                    </Button>
                    <Button
                      className="bg-transparent border border-white/10 hover:bg-white/10 text-white rounded-full gap-2 text-xs py-1.5 h-8 px-3 backdrop-blur-sm"
                      onClick={() => setActiveTab("playlists")}
                    >
                      <LayoutList size={14} />
                      Mes playlists
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-audio-light/40" size={16} />
            <input
              type="text"
              placeholder="Rechercher des titres, albums ou artistes..."
              className="w-full py-2.5 pl-10 pr-4 bg-transparent backdrop-blur-sm border border-white/10 rounded-full focus:outline-none focus:ring-1 focus:ring-audio-accent/50 text-sm"
            />
          </div>
        </motion.div>

        {/* Tabs navigation */}
        <Tabs defaultValue="discover" className="mb-8" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="bg-transparent border border-white/10 backdrop-blur-sm p-1">
            <TabsTrigger value="discover" className="data-[state=active]:bg-audio-accent/20 data-[state=active]:text-audio-accent">
              Découvrir
            </TabsTrigger>
            <TabsTrigger value="playlists" className="data-[state=active]:bg-audio-accent/20 data-[state=active]:text-audio-accent">
              Vos playlists
            </TabsTrigger>
            <TabsTrigger value="liked" className="data-[state=active]:bg-audio-accent/20 data-[state=active]:text-audio-accent">
              Titres aimés
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-audio-accent/20 data-[state=active]:text-audio-accent">
              Historique
            </TabsTrigger>
          </TabsList>

          {/* Tab Content: Discover */}
          <TabsContent value="discover" className="mt-6">
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-medium text-white">Playlists par genre</h2>
                <button
                  className="text-audio-accent hover:text-audio-accent-light transition-colors flex items-center gap-1 text-sm"
                  onMouseEnter={() => playSoundEffect('hover')}
                  onClick={() => playSoundEffect('click')}
                >
                  Voir tout <ChevronRight size={14} />
                </button>
              </div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {popularPlaylists.map((playlist: Playlist) => (
                  <motion.div
                    key={playlist.id}
                    variants={item}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative rounded-lg overflow-hidden"
                    onMouseEnter={() => playSoundEffect('hover')}
                  >
                    <div className="relative aspect-square">
                      <img
                        src={playlist.cover}
                        alt={playlist.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-audio-accent/80 transition-colors"
                          onClick={() => playSoundEffect('click')}
                        >
                          <Play size={22} fill="white" className="text-white ml-1" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <h3 className="text-base font-medium text-white">{playlist.name}</h3>
                      <p className="text-audio-light/60 text-xs">{playlist.description} • {playlist.songCount} titres</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Recommendations Section */}
            <section className="mt-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-medium text-white">Recommandations</h2>
                <button
                  className="text-audio-accent hover:text-audio-accent-light transition-colors flex items-center gap-1 text-sm"
                  onMouseEnter={() => playSoundEffect('hover')}
                  onClick={() => playSoundEffect('click')}
                >
                  Rafraîchir <ChevronRight size={14} />
                </button>
              </div>

              <Card className="bg-transparent border-white/10 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="space-y-1">
                    {recommendations.map((track: Track) => (
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
                              className="w-10 h-10 object-cover rounded-md"
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
                            <p className="text-xs text-audio-light/60">{track.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-xs text-audio-light/60">{track.duration}</span>
                          <button
                            className="text-audio-light/40 hover:text-audio-accent"
                            onClick={() => {
                              playSoundEffect('click');
                              // Envoyer une requête pour aimer/ne plus aimer une chanson
                              const form = document.createElement('form');
                              form.method = 'POST';
                              form.action = route('tracks.toggle-like');

                              const musicIdInput = document.createElement('input');
                              musicIdInput.name = 'music_id';
                              musicIdInput.value = track.id;
                              form.appendChild(musicIdInput);

                              const csrfInput = document.createElement('input');
                              csrfInput.name = '_token';
                              csrfInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                              form.appendChild(csrfInput);

                              document.body.appendChild(form);
                              form.submit();
                            }}
                          >
                            <Heart size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Artistes populaires */}
            <section className="mt-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-medium text-white">Artistes populaires</h2>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {popularArtists.map((artist: Artist) => (
                  <div
                    key={artist.id}
                    className="flex-shrink-0 snap-start"
                    style={{ width: '150px' }}
                  >
                    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-3">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-white">{artist.name}</h3>
                      <p className="text-xs text-audio-light/60">{artist.trackCount} titres</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Anecdotes Section */}
            <section className="mt-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-medium text-white">Le saviez-vous?</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {musicAnecdotes.map((anecdote: Anecdote) => (
                  <Card key={anecdote.id} className="bg-transparent backdrop-blur-sm border border-white/10 overflow-hidden rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex gap-4 items-start">
                        <div className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                          {getIconComponent(anecdote.icon)}
                        </div>
                        <div>
                          <h3 className="text-white text-sm font-medium mb-1">{anecdote.title}</h3>
                          <p className="text-xs text-audio-light/70 leading-relaxed">{anecdote.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Tab Content: Playlists */}
          <TabsContent value="playlists" className="mt-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-medium text-white">Vos playlists</h2>
              <button
                className="text-audio-accent hover:text-audio-accent-light flex items-center gap-1 transition-colors text-sm border border-audio-accent/30 px-3 py-1 rounded-full hover:bg-audio-accent/10 backdrop-blur-sm"
                onClick={() => {
                  setShowCreatePlaylist(true);
                  playSoundEffect('click');
                }}
                onMouseEnter={() => playSoundEffect('hover')}
              >
                <Plus size={14} />
                Créer
              </button>
            </div>

            {showCreatePlaylist && (
              <motion.div
                className="mb-6 p-5 rounded-lg bg-transparent border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-base font-medium mb-3">Nouvelle playlist</h3>
                <input
                  type="text"
                  placeholder="Nom de la playlist"
                  className="bg-white/5 border border-white/10 text-white rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-1 focus:ring-audio-accent/50 mb-4 text-sm"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <button
                    className="px-3 py-1.5 rounded-lg text-audio-light/80 hover:text-white transition-colors text-sm border border-white/10 hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => setShowCreatePlaylist(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-3 py-1.5 bg-transparent border border-audio-accent/30 hover:bg-audio-accent/10 text-audio-accent hover:text-audio-accent-light rounded-lg transition-colors text-sm backdrop-blur-sm"
                    onClick={handleCreatePlaylist}
                  >
                    Créer
                  </button>
                </div>
              </motion.div>
            )}

            {userPlaylists && userPlaylists.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {userPlaylists.map((playlist: Playlist) => (
                  <motion.div
                    key={playlist.id}
                    variants={item}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative rounded-lg overflow-hidden"
                    onMouseEnter={() => playSoundEffect('hover')}
                  >
                    <div className="relative aspect-square">
                      <img
                        src={playlist.cover}
                        alt={playlist.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-audio-accent/80 transition-colors"
                          onClick={() => playSoundEffect('click')}
                        >
                          <Play size={22} fill="white" className="text-white ml-1" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <h3 className="text-base font-medium text-white">{playlist.name}</h3>
                      <p className="text-audio-light/60 text-xs">{playlist.description} • {playlist.songCount} titres</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="p-8 rounded-lg bg-transparent border border-white/10 backdrop-blur-sm text-center">
                <Disc size={32} className="mx-auto mb-3 text-audio-light/30" />
                <p className="text-audio-light/70 mb-4 text-sm">Vous n'avez pas encore créé de playlists.</p>
                <button
                  className="px-5 py-2 bg-transparent border border-audio-accent/30 text-audio-accent hover:bg-audio-accent/10 hover:text-audio-accent-light rounded-full transition-colors text-sm backdrop-blur-sm"
                  onClick={() => {
                    setShowCreatePlaylist(true);
                    playSoundEffect('click');
                  }}
                >
                  Créer ma première playlist
                </button>
              </div>
            )}
          </TabsContent>

          {/* Tab Content: Liked Songs */}
          <TabsContent value="liked" className="mt-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Heart size={18} className="text-audio-accent" />
                Titres aimés
              </h2>
              {likedSongs && likedSongs.length > 0 && (
                <Button className="bg-transparent border border-audio-accent/30 text-audio-accent hover:bg-audio-accent/10 hover:text-audio-accent-light rounded-full gap-2 text-xs py-1.5 h-8 px-3 backdrop-blur-sm">
                  <Play size={14} />
                  Lecture
                </Button>
              )}
            </div>

            {!likedSongs || likedSongs.length === 0 ? (
              <div className="p-8 rounded-lg bg-transparent border border-white/10 backdrop-blur-sm text-center">
                <Heart size={32} className="mx-auto mb-3 text-audio-light/30" />
                <p className="text-audio-light/70 mb-4 text-sm">Vous n'avez pas encore de titres aimés.</p>
                <button
                  className="px-5 py-2 bg-transparent border border-audio-accent/30 text-audio-accent hover:bg-audio-accent/10 hover:text-audio-accent-light rounded-full transition-colors text-sm backdrop-blur-sm"
                  onClick={() => {
                    setActiveTab("discover");
                    playSoundEffect('click');
                  }}
                >
                  Découvrir des titres
                </button>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {likedSongs.map((song: Track) => (
                  <motion.div
                    key={song.id}
                    variants={item}
                    className="bg-transparent border border-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 hover:bg-white/5 transition-colors group"
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  >
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <Play size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-white text-sm font-medium truncate">{song.title}</h3>
                      <p className="text-audio-light/60 text-xs truncate">{song.artist}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      <span className="text-audio-light/50 text-xs">{song.duration}</span>
                      <button
                        onClick={() => {
                          // Envoyer une requête pour ne plus aimer une chanson
                          playSoundEffect('click');
                          const form = document.createElement('form');
                          form.method = 'POST';
                          form.action = route('tracks.toggle-like');

                          const musicIdInput = document.createElement('input');
                          musicIdInput.name = 'music_id';
                          musicIdInput.value = song.id;
                          form.appendChild(musicIdInput);

                          const csrfInput = document.createElement('input');
                          csrfInput.name = '_token';
                          csrfInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                          form.appendChild(csrfInput);

                          document.body.appendChild(form);
                          form.submit();
                        }}
                      >
                        <Heart size={14} className="text-red-500 fill-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          {/* Tab Content: History */}
          <TabsContent value="history" className="mt-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Clock size={18} className="text-audio-light/70" />
                Historique d'écoute
              </h2>
            </div>

            <div className="p-8 rounded-lg bg-transparent border border-white/10 backdrop-blur-sm text-center">
              <Headphones size={32} className="mx-auto mb-3 text-audio-light/30" />
              <p className="text-audio-light/70 mb-4 text-sm">Votre historique d'écoute apparaîtra ici.</p>
              <button
                className="px-5 py-2 bg-transparent border border-audio-accent/30 text-audio-accent hover:bg-audio-accent/10 hover:text-audio-accent-light rounded-full transition-colors text-sm backdrop-blur-sm"
                onClick={() => {
                  setActiveTab("discover");
                  playSoundEffect('click');
                }}
              >
                Commencer à écouter
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Composant wrapper qui fournit le contexte et gère les états de chargement
const ConsumerDashboard = () => {
  const pageProps = usePage().props as any;

  // Vérifier si les données sont disponibles
  const isDataReady = () => {
    return pageProps && pageProps.userData !== undefined;
  };

  // Rendu conditionnel en fonction de l'état des données
  return (
    <AppProvider>
      {isDataReady() ? (
        <ConsumerDashboardContent />
      ) : (
        <div className="min-h-screen overflow-x-hidden pb-20 bg-audio-dark">
          <AppHeader />
          <div className="flex items-center justify-center h-[80vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-audio-accent/20 border-t-audio-accent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-audio-light">Chargement en cours...</h3>
            </div>
          </div>
        </div>
      )}
    </AppProvider>
  );
};

export default ConsumerDashboard;
