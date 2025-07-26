import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { useForm } from '@inertiajs/react';

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

interface AvatarUploadProps {
  user: {
    avatar: string | null;
    name: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showButton?: boolean;
}

function AvatarUpload({ user, size = 'xl', showButton = true }: AvatarUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    avatar: null as File | null,
  });

  const [previewImage, setPreviewImage] = React.useState<string>(
    user.avatar
      ? user.avatar
      : '/default-avatar.png'
  );

const sizeClasses = {
  sm: "size-8",
  md: "size-12",
  lg: "size-20",
  xl: "size-28",
};

const sizeClassesPixels = {
  sm: "32px",  
  md: "48px",  
  lg: "80px",
  xl: "112px",
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('avatar', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitForm = () => {
    post(route('profile.avatar.update'), {
      forceFormData: true,
      onSuccess: () => {
        console.log('Avatar mis à jour avec succès');
        reset('avatar');
      },
      onError: (errors: Record<string, string>) => {
        console.error('Erreurs:', errors);
      }
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

return (
  <div className="flex flex-col gap-2">
    <div className="relative">
      <Avatar className={cn("cursor-pointer group", sizeClasses[size])} onClick={triggerFileInput}>
        <AvatarImage src={previewImage} />
        <AvatarFallback>{user.name?.substring(0, 1).toUpperCase()}</AvatarFallback>
        
        {/* Overlay sur hover */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
          <span className="text-white text-xs">Modifier</span>
        </div>
      
      {/* Indicateur de chargement */}
      {processing && (
        <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}
      </Avatar>
      

    </div>
    
    {/* Input caché */}
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
      disabled={processing}
    />
    
    {/* Message d'erreur */}
    {errors.avatar && (
      <div className="text-red-500 text-xs mt-1">{errors.avatar}</div>
    )}
    
    {/* Bouton de confirmation - exactement sous l'avatar */}
    {showButton && data.avatar && (
      <div className="flex justify-center" style={{ width: sizeClassesPixels[size] }}>
        <button
          type="button"
          onClick={submitForm}
          disabled={processing}
          className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          Confirmer
        </button>
      </div>
    )}
  </div>
);
}

interface UserAvatarProps {
  user: {
    avatar: string | null;
    name: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar = ({ user, size = 'md', className }: UserAvatarProps) => {
  const sizeClasses = {
    sm: "size-8",
    md: "size-12",
    lg: "size-20",
    xl: "size-28",
  };

  const avatarSrc = user.avatar 
    ? user.avatar 
    : '/default-avatar.png';

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ''}`}>
      <AvatarImage src={avatarSrc} alt={`Avatar de ${user.name}`} />
      <AvatarFallback>
        {user.name?.substring(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export { Avatar, AvatarImage, AvatarFallback, AvatarUpload, UserAvatar };