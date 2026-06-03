
import React, { useState, useRef } from 'react';
import { X, Camera, Mail, User, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, name, avatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Profil</h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 flex flex-col items-center gap-6">
          {/* Photo Section */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-lg">
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="w-full space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-white focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Input (Read Only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Email Professionnel
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="w-full pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
