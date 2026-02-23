import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { PRODUCTS } from '../constants';

const GeminiAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'سلام! من دستیار هوشمند Under the Skin هستم. چطور می‌تونم در مورد مکمل‌ها بهت کمک کنم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Safe check for API Key
  const hasApiKey = typeof process !== 'undefined' && process.env && !!process.env.API_KEY;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    if (hasApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const context = PRODUCTS.map(p => 
          `نام محصول: ${p.name} (${p.subtitle})\nفواید: ${p.benefits.join(', ')}\nنحوه مصرف: ${p.dosage}\nترکیبات: ${p.ingredients.join(', ')}`
        ).join('\n\n');

        const systemInstruction = `
          شما مشاور برند Under the Skin هستید. اطلاعات محصولات: ${context}
          فقط فارسی صحبت کنید. کوتاه و صمیمی پاسخ دهید.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: userMsg,
          config: { systemInstruction },
        });

        const text = response.text || "متوجه نشدم، لطفا دوباره بپرسید.";
        setMessages(prev => [...prev, { role: 'model', text }]);
      } catch (error) {
        console.error("Gemini Error:", error);
        setMessages(prev => [...prev, { role: 'model', text: 'خطا در ارتباط با هوش مصنوعی.' }]);
      }
    } else {
      setTimeout(() => {
        let fakeResponse = "این یک پاسخ آزمایشی است (چون API Key وارد نشده). ";
        if (userMsg.includes('سلام')) {
          fakeResponse = "سلام دوست عزیز! خوش اومدی به Under the Skin. (حالت آزمایشی)";
        } else if (userMsg.includes('قیمت') || userMsg.includes('خرید')) {
          fakeResponse = "برای دیدن قیمت‌ها لطفا به بخش فروشگاه مراجعه کنید. ما بهترین قیمت‌ها رو داریم!";
        } else if (userMsg.includes('پوست') || userMsg.includes('کلاژن')) {
          fakeResponse = "برای سلامت پوست، محصول Marine Collagen ما عالیه. باعث شفافیت و کاهش چروک میشه.";
        } else {
          fakeResponse = "من الان در حالت دمو هستم. وقتی API Key واقعی رو گرفتی، می‌تونم دقیق‌تر راهنماییت کنم!";
        }
        setMessages(prev => [...prev, { role: 'model', text: fakeResponse }]);
        setLoading(false);
      }, 1500);
    }
    
    if (hasApiKey) setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
      <div className={`p-4 flex items-center gap-3 text-white shadow-md ${hasApiKey ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gradient-to-r from-slate-700 to-slate-800'}`}>
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
          {hasApiKey ? <Sparkles size={24} /> : <Bot size={24} />}
        </div>
        <div>
          <h3 className="font-bold text-lg">مشاور هوشمند {hasApiKey ? '' : '(حالت آزمایشی)'}</h3>
          <p className="text-xs text-cyan-50 opacity-90">
            {hasApiKey ? 'پاسخگویی آنی با Gemini AI' : 'API Key یافت نشد - پاسخ‌های پیش‌فرض'}
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {!hasApiKey && messages.length === 1 && (
           <div className="bg-yellow-50 text-yellow-800 p-3 rounded-xl text-xs border border-yellow-200 flex gap-2 items-start">
             <AlertTriangle size={16} className="shrink-0 mt-0.5" />
             <p>شما API Key وارد نکرده‌اید، بنابراین هوش مصنوعی در حالت "نمایشی" است و پاسخ‌های واقعی نمی‌دهد. برای فعال‌سازی کامل باید کلید گوگل را دریافت کنید.</p>
           </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-6 ${msg.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 flex items-center gap-2">
              <Loader2 className="animate-spin text-cyan-600" size={16} />
              <span className="text-xs text-slate-400">در حال فکر کردن...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="سوال خود را بپرسید..."
            className="w-full pr-4 pl-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400 text-right"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAdvisor;