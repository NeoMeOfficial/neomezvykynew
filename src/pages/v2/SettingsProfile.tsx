import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Page, BackHeader, NM } from '../../components/v2/neome';

/**
 * Settings · Edit profile — R10
 *
 * Avatar w/ + change button, list of editable fields
 * (meno / username / bio / dátum / mesto). Uložiť in header.
 *
 * Wired (F-009 / F-030):
 * - Initial values pulled from useSupabaseAuth.profile
 * - Save calls updateProfile() against the profiles table (full_name,
 *   bio). username/birthdate/city remain in user_metadata for now —
 *   F-009-EXT can promote them to profile columns when needed.
 * - Avatar tile: file picker uploads to Supabase storage 'avatars'
 *   bucket under <user.id>/<timestamp>.<ext>, then writes the public
 *   URL back to profiles.avatar_url via updateProfile.
 *
 * Mounted at /settings/profile.
 */

export default function SettingsProfile() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useSupabaseAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string; username?: string; birthdate?: string; city?: string };
  const initialName = profile?.full_name ?? meta.full_name ?? meta.name ?? user?.email?.split('@')[0] ?? '';
  const initialBio = profile?.bio ?? '';

  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(meta.username ?? `@${(user?.email ?? '').split('@')[0]}`);
  const [bio, setBio] = useState(initialBio);
  const [birthdate, setBirthdate] = useState(meta.birthdate ?? '');
  const [city, setCity] = useState(meta.city ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '/images/r9/testimonial-anna.jpg');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      full_name: name,
      bio,
    } as Partial<typeof profile>);
    setSaving(false);
    if (error) {
      toast({ title: 'Nepodarilo sa uložiť', description: 'Skús to ešte raz.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Uložené' });
    navigate('/settings');
  };

  const onPickAvatar = () => fileInputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user?.id) {
      toast({ title: 'Najprv sa prihlás', variant: 'destructive' });
      return;
    }
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, {
      upsert: true,
      cacheControl: '3600',
    });
    if (upErr) {
      setUploading(false);
      toast({ title: 'Nahranie zlyhalo', description: upErr.message, variant: 'destructive' });
      return;
    }
    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = pub.publicUrl;
    const { error: profErr } = await updateProfile({ avatar_url: url } as Partial<typeof profile>);
    setUploading(false);
    if (profErr) {
      toast({ title: 'Profil neaktualizovaný', variant: 'destructive' });
      return;
    }
    setAvatarUrl(url);
    toast({ title: 'Fotka aktualizovaná' });
  };

  const fields = [
    { label: 'Meno', value: name, set: setName, multi: false, placeholder: 'Tvoje meno' },
    { label: 'Používateľské meno', value: username, set: setUsername, multi: false, placeholder: '@meno' },
    { label: 'Bio', value: bio, set: setBio, multi: true, placeholder: 'Pár viet o tebe' },
    { label: 'Dátum narodenia', value: birthdate, set: setBirthdate, multi: false, placeholder: 'DD. mesiac RRRR' },
    { label: 'Mesto', value: city, set: setCity, multi: false, placeholder: 'Bratislava' },
  ];

  return (
    <Page>
      <BackHeader title="Upraviť profil" showSearch={false} onSearch={onSave} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
      <div style={{ padding: '0 18px', textAlign: 'center' }}>
        <button onClick={onPickAvatar} aria-label="Zmeniť fotku" style={{ all: 'unset', cursor: uploading ? 'wait' : 'pointer', position: 'relative', width: 96, height: 96, margin: '8px auto 0', borderRadius: 999, backgroundImage: `url(${avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'block', opacity: uploading ? 0.6 : 1 }}>
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 30, height: 30, borderRadius: 999, background: NM.DEEP, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </button>
        <button onClick={onPickAvatar} disabled={uploading} style={{ all: 'unset', cursor: uploading ? 'wait' : 'pointer', marginTop: 14, fontFamily: NM.SANS, fontSize: 12.5, color: NM.TERRA, fontWeight: 500 }}>
          {uploading ? 'Nahrávam…' : 'Zmeniť fotku'}
        </button>
      </div>

      <div style={{ margin: '28px 18px 0', background: '#fff', borderRadius: 16, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
        {fields.map((f, i) => (
          <div key={f.label} style={{ padding: '14px 16px', borderBottom: i < fields.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 10, color: NM.EYEBROW, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 5 }}>{f.label}</div>
            {f.multi ? (
              <textarea
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.placeholder}
                style={{
                  width: '100%',
                  minHeight: 60,
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                  background: 'transparent',
                  fontFamily: NM.SANS,
                  fontSize: 13.5,
                  color: NM.DEEP,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  padding: 0,
                }}
              />
            ) : (
              <input
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.placeholder}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: NM.SANS,
                  fontSize: 13.5,
                  color: NM.DEEP,
                  fontWeight: 400,
                  lineHeight: 1.3,
                  padding: 0,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div style={{ margin: '20px 18px 0' }}>
        <button onClick={onSave} disabled={saving} style={{ width: '100%', padding: '14px 20px', background: NM.DEEP, color: '#fff', border: 'none', borderRadius: 999, fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Ukladám…' : 'Uložiť'}
        </button>
      </div>
    </Page>
  );
}
