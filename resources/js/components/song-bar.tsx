// src/Components/SongBar.tsx
import React from 'react';
import { Link } from '@inertiajs/react';
// import PlayPause from './PlayPause';
import { SongBarProps } from '@/types/song';

const SongBar: React.FC<SongBarProps> = ({
  song,
  i,
  artistId,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick
}) => {
  const getCoverArt = () => {
    if (artistId && song.attributes?.artwork) {
      return song.attributes.artwork.url
        .replace('{w}', '125')
        .replace('{h}', '125');
    }
    return song.images?.coverart || '';
  };

  return (
    <div 
      className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${
        activeSong?.title === song?.title ? 'bg-[#4c426e]' : 'bg-transparent'
      } py-2 p-4 rounded-lg cursor-pointer mb-2`}
    >
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
      
      <div className="flex-1 flex flex-row justify-between items-center">
        <img
          className="w-20 h-20 rounded-lg"
          src={getCoverArt()}
          alt={song?.title}
        />
        
        <div className="flex-1 flex flex-col justify-center mx-3">
          {!artistId ? (
            <Link href={`/songs/${song.key}`}>
              <p className="text-xl font-bold text-white">
                {song?.title}
              </p>
            </Link>
          ) : (
            <p className="text-xl font-bold text-white">
              {song?.attributes?.name}
            </p>
          )}
          
          <p className="text-base text-gray-300 mt-1">
            {artistId ? song?.attributes?.albumName : song?.subtitle}
          </p>
        </div>
      </div>
      
      {/* {!artistId && (
        <PlayPause
          isPlaying={isPlaying}
          activeSong={activeSong}
          song={song}
          handlePause={handlePauseClick}
          handlePlay={() => handlePlayClick(song, i)}
        />
      )} */}
    </div>
  );
};

export default SongBar;