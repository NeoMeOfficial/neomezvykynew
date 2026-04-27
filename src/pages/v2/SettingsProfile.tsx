import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { Page, BackHeader, NM } from '../../components/v2/neome';

/**
 * Settings · Edit profile — R10
 *
 * Avatar w/ + change button, list of editable fields
 * (meno / username / bio / dátum / mesto). Uložiť in header.
 *
 * Wired:
 * - Initial values pulled from useSupabaseAuth (full_name, email)
 *
 * FEATURE-NEEDED-SETTINGS-PROFILE-SAVE: actually persist changes
 * via supabase.auth.updateUser({ data: { full_name, ... } }) +
 * username/bio/dob/city columns on a profiles table that doesn't
 * exist yet. Currently Uložiť just navigates back.
 *
 * FEATURE-NEEDED-SETTINGS-AVATAR-UPLOAD: avatar storage bucket +
 * URL persistence. Currently the avatar shows a static testimonial
 * image; '+' button is a static affordance.
 *
 * Mounted at /settings/profile.
 */

export default function SettingsProfile() {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string; username?: string; bio?: string; birthdate?: string; city?: string };
  const [name, setName] = useState(meta.full_name ?? meta.name ?? user?.email?.split('@')[0] ?? '');
  const [username, setUsername] = useState(meta.username ?? `@${(user?.email ?? '').split('@')[0]}`);
  const [bio, setBio] = useState(meta.bio ?? '');
  const [birthdate, setBirthdate] = useState(meta.birthdate ?? '');
  const [city, setCity] = useState(meta.city ?? '');

  const onSave = () => {
    // FEATURE-NEEDED-SETTINGS-PROFILE-SAVE
    navigate('/settings');
  };

  const fields = [
    { label: 'Meno', value: name, set: setName, multi: false },
    { label: 'Používateľské meno', value: username, set: setUsername, multi: false },
    { label: 'Bio', value: bio, set: setBio, multi: true, placeholder: 'Pár viet o tebe' },
    { label: 'Dátum narodenia', value: birthdate, set: setBirthdate, multi: false, placeholder: 'DD. mesiac RRRR' },
    { label: 'Mesto', value: city, set: setCity, multi: false, placeholder: 'Bratislava' },
  ];

  return (
    <Page>
      <BackHeader title="Upraviť profil" showSearch={false} onSearch={onSave} />
      {/* FEATURE-NEEDED-SETTINGS-PROFILE-SAVE: BackHeader's search slot is being used as 'Uložiť' affordance — replace with a proper trailing-action prop later */}
      <div style={{ padding: '0 18px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 96, height: 96, margin: '8px auto 0', borderRadius: 999, backgroundImage: 'url(/images/r9/testimonial-anna.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 30, height: 30, borderRadius: 999, background: NM.DEEP, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </div>
        <button onClick={onSave} style={{ all: 'unset', cursor: 'pointer', marginTop: 14, fontFamily: NM.SANS, fontSize: 12.5, color: NM.TERRA, fontWeight: 500 }}>
          Zmeniť fotku
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
        <button onClick={onSave} style={{ width: '100%', padding: '14px 20px', background: NM.DEEP, color: '#fff', border: 'none', borderRadius: 999, fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Uložiť
        </button>
      </div>
    </Page>
  );
}
