import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';

const conversations = [
  { id: 'gabi', name: 'Gabi · NeoMe', last: 'Druhý týždeň — si úžasná! 💪', time: '10:30', unread: 2, pinned: true },
  { id: 'katka', name: 'Katka M.', last: 'Ďakujem za tip na recept!', time: 'Včera', unread: 0, pinned: false },
  { id: 'lucia', name: 'Lucia H.', last: 'Ako sa ti darí s programom?', time: 'Pon', unread: 0, pinned: false },
];

export default function Spravy() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  if (selectedChat) {
    const conv = conversations.find((c) => c.id === selectedChat)!;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedChat(null)} className="p-1"><ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D0BCA8] to-[#D4B8A0]" />
          <h1 className="text-lg font-semibold text-[#2E2218]">{conv.name}</h1>
        </div>
        <div className="space-y-3 min-h-[50vh]">
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl rounded-tl-md px-4 py-2.5 text-sm" style={{ background: 'rgba(255,255,255,0.7)' }}>
              {conv.last}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={msg} onChange={(e) => setMsg(e.target.value)}
            placeholder="Napíš správu..."
            className="flex-1 px-4 py-3 rounded-full text-sm bg-white/30 outline-none"
            style={{ backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)' }}
          />
          <button className="w-10 h-10 rounded-full bg-[#6B4C3B] flex items-center justify-center">
            <Send className="w-4 h-4 text-white" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-[#2E2218]">Správy</h1>

      {conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((c) => (
            <GlassCard key={c.id} className="!p-4 cursor-pointer" onClick={() => setSelectedChat(c.id)}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#D0BCA8] to-[#D4B8A0] flex-shrink-0 ${c.pinned ? 'ring-2 ring-[#6B4C3B] ring-offset-2' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#2E2218]">{c.name}</p>
                    <span className="text-[10px] text-[#A0907E]">{c.time}</span>
                  </div>
                  <p className="text-xs text-[#A0907E] truncate mt-0.5">{c.last}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{c.unread}</span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-sm text-[#A0907E]">Zatiaľ žiadne správy.</p>
          <p className="text-sm text-[#A0907E]">Keď začneš program, Gabi ti napíše! 💌</p>
        </div>
      )}
    </div>
  );
}
