'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, Upload, Calendar, MapPin, Link as LinkIcon, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Masterclass {
  id: string;
  title: string;
  description: string;
  date_range: string;
  location: string;
  status: string;
  image_url: string;
  registration_url: string;
}

export default function MasterclassAdmin() {
  const [data, setData] = useState<Masterclass | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [location, setLocation] = useState('');
  const [regUrl, setRegUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: mc, error } = await supabase
        .from('masterclass')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Fetch error:', error);
      }

      if (mc) {
        setData(mc);
        setTitle(mc.title || '');
        setDescription(mc.description || '');
        setDateRange(mc.date_range || '');
        setLocation(mc.location || '');
        setRegUrl(mc.registration_url || '');
        setPreviewUrl(mc.image_url || null);
      } else {
        setData(null);
        setTitle('');
        setDescription('');
        setDateRange('');
        setLocation('');
        setRegUrl('');
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDelete = async () => {
    if (!data?.id) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this masterclass announcement? This will remove the popup announcement from the website.'
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from('masterclass')
        .delete()
        .eq('id', data.id);

      if (deleteError) throw deleteError;

      toast.success('Masterclass announcement deleted successfully');
      setData(null);
      setTitle('');
      setDescription('');
      setDateRange('');
      setLocation('');
      setRegUrl('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Delete failed';
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let imageUrl = data?.image_url || '';

      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          throw new Error('File size exceeds 5MB limit. Please compress the poster image.');
        }

        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `poster-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('masterclass')
          .upload(fileName, selectedFile);
        
        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('masterclass')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const payload = {
        title,
        description,
        date_range: dateRange,
        location,
        registration_url: regUrl,
        image_url: imageUrl,
        status: 'active',
        updated_at: new Date().toISOString()
      };

      if (data?.id) {
        const { error: updateError } = await supabase
          .from('masterclass')
          .update(payload)
          .eq('id', data.id);
        if (updateError) throw updateError;
        toast.success('Masterclass updated successfully');
      } else {
        const { error: insertError } = await supabase
          .from('masterclass')
          .insert([payload]);
        if (insertError) throw insertError;
        toast.success('Masterclass announcement published successfully');
      }

      setSelectedFile(null);
      fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Update failed';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="text-gold animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-4xl text-white font-light tracking-tight">Masterclass</h2>
            {data ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active Announcement
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/5 text-white/40 border border-white/10">
                No Active Announcement
              </span>
            )}
          </div>
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-bold">Manage class announcements</p>
        </div>

        {data && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="self-start sm:self-auto bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500 font-bold text-xs tracking-[0.15em] uppercase px-5 py-3 flex items-center gap-2.5 transition-all disabled:opacity-50"
          >
            {deleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
            Delete Announcement
          </button>
        )}
      </div>

      {!data && (
        <div className="flex items-start gap-3 bg-white/[0.03] border border-white/10 p-5 text-white/60 text-xs leading-relaxed">
          <AlertCircle className="text-gold shrink-0 mt-0.5" size={18} />
          <div>
            There is currently no active masterclass announcement on the website. Fill in the form below and click <span className="text-gold font-bold">Publish Announcement</span> to post one.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-8 bg-white/5 border border-white/10 p-10">
            <div className="space-y-2">
              <label className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Class Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-gold/50 transition-colors"
                placeholder="e.g. Advanced Bridal Masterclass 2025"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-gold/50 transition-colors"
                placeholder="Details about the class..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white/60 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                  <Calendar size={14} className="text-gold" /> Date Range
                </label>
                <input
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-gold/50 transition-colors"
                  placeholder="e.g. June 15-18, 2025"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/60 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                  <MapPin size={14} className="text-gold" /> Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-gold/50 transition-colors"
                  placeholder="e.g. Kochi, Kerala"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/60 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                <LinkIcon size={14} className="text-gold" /> Registration Link (WhatsApp)
              </label>
              <input
                value={regUrl}
                onChange={(e) => setRegUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-gold/50 transition-colors"
                placeholder="https://wa.me/..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving || deleting}
                className="bg-gold text-navy font-black text-xs tracking-[0.2em] uppercase px-10 py-5 flex items-center gap-3 hover:bg-gold/90 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {data ? 'Update Announcement' : 'Publish Announcement'}
              </button>

              {data && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving || deleting}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500 font-bold text-xs tracking-[0.2em] uppercase px-8 py-5 flex items-center gap-2.5 transition-all disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                  Delete Announcement
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Poster Column */}
        <div className="space-y-6">
          <label className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Announcement Poster</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative aspect-[4/5] bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-gold/30 transition-all flex items-center justify-center"
          >
            {previewUrl ? (
              <Image 
                src={previewUrl} 
                alt="Poster Preview"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Upload className="text-white/20" size={48} />
                <p className="text-white/30 text-[10px] tracking-widest uppercase font-bold">Upload New Poster</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <p className="text-white text-xs font-bold tracking-widest uppercase">Change Image</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          <p className="text-white/30 text-[10px] italic leading-relaxed">
            * Recommended aspect ratio 4:5 for optimal display on the website banner.
          </p>
        </div>
      </div>
    </div>
  );
}
