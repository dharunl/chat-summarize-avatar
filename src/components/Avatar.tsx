
import { useEffect, useRef } from 'react';
import avatarLipSync from '@/lib/avatarAnimation';
import { cn } from '@/lib/utils';

interface AvatarProps {
  text?: string;
  isAnimating?: boolean;
}

const Avatar = ({ text, isAnimating = false }: AvatarProps) => {
  const avatarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (avatarRef.current) {
      avatarLipSync.setElement(avatarRef.current);
    }
  }, []);
  
  useEffect(() => {
    if (isAnimating && text && avatarRef.current) {
      avatarLipSync.animate({ text });
    } else {
      avatarLipSync.stop();
    }
    
    return () => {
      avatarLipSync.stop();
    };
  }, [isAnimating, text]);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div 
        className={cn(
          "relative w-60 h-60 bg-gradient-to-b from-primary/20 to-primary/5 rounded-full overflow-hidden border-4 border-white/20 animate-float shadow-lg",
          isAnimating && "border-primary/20"
        )}
        ref={avatarRef}
      >
        {/* Head */}
        <div className="w-40 h-40 rounded-full bg-gradient-to-r from-slate-200 to-slate-100 absolute top-6 left-1/2 transform -translate-x-1/2">
          {/* Eyes */}
          <div className="avatar-eyes flex justify-center gap-10 mt-14">
            <div className="w-5 h-3 rounded-full bg-slate-700 relative overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-white absolute top-0 left-1"></div>
            </div>
            <div className="w-5 h-3 rounded-full bg-slate-700 relative overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-white absolute top-0 left-1"></div>
            </div>
          </div>
          
          {/* Mouth */}
          <div className="avatar-mouth w-16 h-6 rounded-full bg-slate-700 absolute bottom-10 left-1/2 transform -translate-x-1/2 overflow-hidden">
            <div className="w-full h-2 rounded-full bg-red-300 absolute bottom-1"></div>
          </div>
        </div>
        
        {/* Body/neck */}
        <div className="w-20 h-24 bg-gradient-to-b from-blue-200 to-blue-300 absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-t-lg"></div>
        
        {/* Text bubble when talking */}
        {isAnimating && text && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-3 shadow-lg max-w-xs animate-fade-in">
            <div className="text-xs text-muted-foreground">
              {text.length > 30 ? text.substring(0, 30) + '...' : text}
            </div>
            <div className="absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2 rotate-45 w-3 h-3 bg-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
