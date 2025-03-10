// src/Components/AddSongModal.tsx
import React, { useState, FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Song, SongFormData } from '@/types/song';
import { PlusIcon } from 'lucide-react';

interface AddSongModalProps {
  onSongAdded?: (song: Song) => void;
}

const AddSongModal: React.FC<AddSongModalProps> = ({ onSongAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm<SongFormData>({
    title: '',
    artist: '',
    album: '',
    audio_file: null,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('artist', data.artist);
    formData.append('album', data.album);
    
    if (data.audio_file) {
      formData.append('audio_file', data.audio_file);
    }

    post('/songs', {
      data: formData,
      onSuccess: () => {
        reset();
        setIsOpen(false);
        // Optional: call callback if provided
        // onSongAdded could be used to update parent component's state
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              required
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>
          <div>
            <Label htmlFor="artist">Artist</Label>
            <Input
              id="artist"
              value={data.artist}
              onChange={(e) => setData('artist', e.target.value)}
              required
            />
            {errors.artist && <p className="text-red-500">{errors.artist}</p>}
          </div>
          <div>
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              value={data.album}
              onChange={(e) => setData('album', e.target.value)}
              required
            />
            {errors.album && <p className="text-red-500">{errors.album}</p>}
          </div>
          <div>
            <Label htmlFor="audio_file">Audio File</Label>
            <Input
              id="audio_file"
              type="file"
              accept="audio/*"
              onChange={(e) => setData('audio_file', e.target.files?.[0] || null)}
            />
            {errors.audio_file && <p className="text-red-500">{errors.audio_file}</p>}
          </div>
          <Button type="submit" disabled={processing}>
            {processing ? 'Adding...' : 'Add Song'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongModal;