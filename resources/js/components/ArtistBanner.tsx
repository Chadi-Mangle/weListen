
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Clock, PlayCircle, Heart, Share2, PencilLine, X, Image, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ArtistBannerProps {
  name: string;
  image: string;
  bio: string;
  stats: {
    followers: string;
    tracks: number;
    albums: number;
    monthlyListeners: string;
  };
}

const ArtistBanner: React.FC<ArtistBannerProps> = ({ name, image, bio, stats }) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(bio);
  const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);
  const [showCoverPhotoModal, setShowCoverPhotoModal] = useState(false);
  const { toast } = useToast();

  const handleBioSave = () => {
    setIsEditingBio(false);
    toast({
      title: "Biographie mise à jour",
      description: "Vos modifications ont été enregistrées avec succès.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-8 overflow-hidden rounded-xl"
    >
      {/* ARRIÈRE-PLAN: Image avec superposition de dégradé */}
      <div className="relative h-64 md:h-80">
        <div className="absolute inset-0 group">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-audio-dark via-audio-dark/80 to-transparent"></div>
          <button 
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-audio-light/70 hover:text-audio-light bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full p-2"
            onClick={() => setShowCoverPhotoModal(true)}
          >
            <PencilLine size={16} />
          </button>
        </div>
        
        {/* CONTENU: Informations principales */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* IMAGE: Photo de l'artiste */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-lg relative group">
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover"
              />
              <button 
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => setShowProfilePhotoModal(true)}
              >
                <PencilLine size={16} className="text-white" />
              </button>
            </div>
            
            {/* INFO: Détails de l'artiste */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-audio-light/60 mb-1">
                <span className="uppercase tracking-wider">Artiste vérifié</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-audio-light mb-2">{name}</h1>
              <div className="flex items-center gap-4 text-sm text-audio-light/60">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{stats.followers} abonnés</span>
                </div>
                <div className="flex items-center gap-1">
                  <Music size={14} />
                  <span>{stats.tracks} titres</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{stats.monthlyListeners} écoutes mensuelles</span>
                </div>
              </div>
            </div>
            
            {/* ACTIONS: Boutons d'action */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm"
                className="border-audio-accent/30 text-audio-accent hover:bg-audio-accent/10 hover:text-audio-accent-light rounded-full"
              >
                <Share2 size={16} className="mr-1" />
                Partager
              </Button>
              <Button 
                size="sm"
                className="bg-transparent border border-white/10 hover:bg-white/10 text-white rounded-full"
              >
                <Heart size={16} className="mr-1" />
                Suivre
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* BIO: Biographie de l'artiste */}
      <div className="p-6 bg-transparent backdrop-blur-sm rounded-b-xl border-t border-white/5">
        <div className="flex justify-between items-start">
          <div className="max-w-2xl relative">
            <h3 className="text-sm font-medium text-audio-light/80 mb-2">À propos</h3>
            {isEditingBio ? (
              <div className="relative">
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-audio-light/60 focus:outline-none focus:ring-1 focus:ring-audio-accent/30 min-h-[120px] resize-none"
                  style={{ width: '100%', minWidth: '300px', maxWidth: '500px' }}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-full"
                    onClick={() => setIsEditingBio(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    className="text-xs rounded-full"
                    onClick={handleBioSave}
                  >
                    Sauvegarder
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <p className="text-sm text-audio-light/60">{editedBio}</p>
                <button 
                  onClick={() => setIsEditingBio(true)}
                  className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-audio-light/70 hover:text-audio-light"
                >
                  <PencilLine size={14} />
                </button>
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-audio-accent/30 bg-transparent text-audio-accent hover:bg-audio-accent/10 hover:text-audio-accent-light rounded-full hidden md:flex"
          >
            <PlayCircle size={16} className="mr-1" />
            Lecture aléatoire
          </Button>
        </div>
      </div>

      {/* MODAL: Modal d'upload de photo de profil */}
      {showProfilePhotoModal && (
        <motion.div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-transparent backdrop-blur-xl border border-white/10 rounded-xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-medium text-audio-light text-sm">Modifier la photo de profil</h3>
              <button 
                className="text-audio-light/60 hover:text-audio-light transition-colors rounded-full w-6 h-6 flex items-center justify-center hover:bg-white/5"
                onClick={() => setShowProfilePhotoModal(false)}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex justify-center mb-5">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10">
                  <img src={image} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="border border-dashed border-white/10 rounded-md p-6 text-center mb-5">
                <Image size={24} className="mx-auto mb-2 text-audio-light/40" />
                <p className="text-xs text-audio-light/70 mb-3">Sélectionnez une image JPG, PNG ou GIF (taille max: 2MB)</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs rounded-full"
                >
                  <Upload size={14} />
                  Télécharger une image
                </Button>
              </div>
              
              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-full"
                  onClick={() => setShowProfilePhotoModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="accent" 
                  size="sm"
                  className="text-xs rounded-full"
                  onClick={() => {
                    setShowProfilePhotoModal(false);
                    toast({
                      title: "Photo de profil mise à jour",
                      description: "Votre photo de profil a été modifiée avec succès.",
                    });
                  }}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* MODAL: Modal d'upload de photo de couverture */}
      {showCoverPhotoModal && (
        <motion.div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-transparent backdrop-blur-xl border border-white/10 rounded-xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-medium text-audio-light text-sm">Modifier la photo de couverture</h3>
              <button 
                className="text-audio-light/60 hover:text-audio-light transition-colors rounded-full w-6 h-6 flex items-center justify-center hover:bg-white/5"
                onClick={() => setShowCoverPhotoModal(false)}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex justify-center mb-5">
                <div className="w-full h-40 rounded-lg overflow-hidden border border-white/10">
                  <img src={image} alt="Cover" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="border border-dashed border-white/10 rounded-md p-6 text-center mb-5">
                <Image size={24} className="mx-auto mb-2 text-audio-light/40" />
                <p className="text-xs text-audio-light/70 mb-3">Pour un meilleur rendu, utilisez une image d'au moins 1400 x 400px</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs rounded-full"
                >
                  <Upload size={14} />
                  Télécharger une image
                </Button>
              </div>
              
              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-full"
                  onClick={() => setShowCoverPhotoModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="accent" 
                  size="sm"
                  className="text-xs rounded-full"
                  onClick={() => {
                    setShowCoverPhotoModal(false);
                    toast({
                      title: "Photo de couverture mise à jour",
                      description: "Votre photo de couverture a été modifiée avec succès.",
                    });
                  }}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ArtistBanner;
