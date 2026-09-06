import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios.js';

const GREETING = {
  role: 'assistant',
  content: "Hi! I'm STCA's assistant 👋 Ask me about our coding courses, tutoring, pricing, or how to enroll."
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { messages: nextMessages });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't reach the assistant. Try Telegram instead: @Sol_Ethio_Coder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-forest-700 text-white shadow-lg flex items-center justify-center text-2xl"
        aria-label="Open chat"
      >
        {open ? '✕' : '💬'}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[28rem] bg-white border border-forest-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-forest-700 text-white px-4 py-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-sun-400 text-forest-700 flex items-center justify-center font-display font-bold text-sm">S</span>
              <div>
                <p className="text-sm font-medium leading-none">STCA Assistant</p>
                <p className="text-[11px] text-white/60 mt-0.5">Ask about courses & tutoring</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-forest-50/40">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] text-sm px-3 py-2 rounded-2xl leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-forest-700 text-white rounded-br-sm'
                        : 'bg-white border border-forest-100 text-ink rounded-bl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-forest-100 text-ink/40 text-sm px-3 py-2 rounded-2xl rounded-bl-sm">
                    Typing...
                  </div>
                </div>
              )}
              {error && <p className="text-xs text-red-600 px-1">{error}</p>}
            </div>

            <form onSubmit={handleSend} className="border-t border-forest-100 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question..."
                maxLength={500}
                className="flex-1 border border-forest-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-forest-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-forest-700 text-white w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-40 flex-shrink-0"
                aria-label="Send"
              >
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
