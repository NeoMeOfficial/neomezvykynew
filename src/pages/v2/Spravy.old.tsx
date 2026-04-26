import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, RefreshCw } from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import { useMessages } from '../../hooks/useMessages';

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return d.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Včera';
  if (diffDays < 7) return d.toLocaleDateString('sk-SK', { weekday: 'short' });
  return d.toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' });
}

export default function Spravy() {
  const { messages, loading, sending, unreadCount, sendMessage, markRead } = useMessages();
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Mark messages read when user opens the screen
  useEffect(() => {
    markRead();
  }, [markRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="w-full flex flex-col pb-24"
      style={{ background: colors.bgGradient, minHeight: '100vh' }}
    >
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-xl border-b border-white/20 px-4 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Gabi avatar */}
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.telo})` }}
            >
              G
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h1
              className="text-[22px] font-medium leading-tight"
              style={{ color: colors.textPrimary, fontFamily: '"Bodoni Moda", Georgia, serif' }}
            >
              Správy
            </h1>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Gabi · NeoMe</p>
          </div>

          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: colors.periodka }}>
              {unreadCount} nové
            </span>
          )}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ color: colors.textSecondary }} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: `rgba(184,134,74,0.12)` }}
            >
              <MessageCircle className="w-7 h-7" style={{ color: colors.accent }} />
            </div>
            <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              Zatiaľ žiadne správy
            </p>
            <p className="text-xs max-w-xs" style={{ color: colors.textSecondary }}>
              Napíš Gabi — odpovie ti čo najskôr.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isGabi = msg.is_from_admin;
            return (
              <div
                key={msg.id}
                className={`flex ${isGabi ? 'justify-start' : 'justify-end'}`}
              >
                {/* Gabi avatar for her messages */}
                {isGabi && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mr-2 mt-auto"
                    style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.telo})` }}
                  >
                    G
                  </div>
                )}

                <div className={`max-w-[78%] space-y-1 ${isGabi ? '' : 'items-end flex flex-col'}`}>
                  <div
                    className="px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      borderRadius: isGabi
                        ? '18px 18px 18px 4px'
                        : '18px 18px 4px 18px',
                      background: isGabi
                        ? 'rgba(255,255,255,0.80)'
                        : colors.accent,
                      color: isGabi ? colors.textPrimary : '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    {msg.body}
                  </div>
                  <p className="text-[10px] px-1" style={{ color: colors.textSecondary }}>
                    {formatTime(msg.created_at)}
                    {!isGabi && msg.read_at && ' · Prečítané'}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div
        className="fixed bottom-16 left-0 right-0 px-4 py-3 border-t border-white/20"
        style={{ background: 'rgba(240,230,218,0.85)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Napíš správu Gabi…"
            rows={1}
            className="flex-1 px-4 py-3 text-sm resize-none rounded-2xl outline-none"
            style={{
              background: 'rgba(255,255,255,0.70)',
              border: '1px solid rgba(255,255,255,0.80)',
              color: colors.textPrimary,
              maxHeight: '120px',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim() || sending}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity"
            style={{
              background: draft.trim() ? colors.accent : 'rgba(184,134,74,0.3)',
            }}
          >
            <Send className="w-4 h-4 text-white" strokeWidth={2} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-2" style={{ color: colors.textSecondary }}>
          Gabi zvyčajne odpovedá do 24 hodín
        </p>
      </div>
    </div>
  );
}
