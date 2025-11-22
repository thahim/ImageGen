import React, { useState, useRef, useCallback } from 'react';
import { GeneratedImage, GenerationStatus } from './types';
import { generateImageWithGemini } from './services/geminiService';
import ImageCard from './components/ImageCard';
import Footer from './components/Footer';

function App() {
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please upload a valid image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setReferenceImage(base64String);
        setErrorMsg(null); // Clear errors on successful upload
      };
      reader.readAsDataURL(file);
    }
  };

  const clearReference = () => {
    setReferenceImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMsg("Please enter a scene prompt.");
      return;
    }

    setStatus(GenerationStatus.LOADING);
    setErrorMsg(null);

    try {
      let pureBase64 = undefined;
      if (referenceImage) {
        // Remove data URL prefix to get pure base64
        pureBase64 = referenceImage.split(',')[1];
      }

      const generatedImageUrl = await generateImageWithGemini(prompt, pureBase64);

      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: generatedImageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        hasReference: !!referenceImage
      };

      setHistory(prev => [newImage, ...prev]);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(GenerationStatus.ERROR);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      if (status !== GenerationStatus.ERROR) {
        setStatus(GenerationStatus.IDLE);
      }
    }
  };

  const downloadAll = useCallback(async () => {
    if (history.length === 0) return;
    
    // Simple sequential download to avoid browser blocking multiple popups
    for (let i = 0; i < history.length; i++) {
      const img = history[i];
      const link = document.createElement('a');
      link.href = img.url;
      link.download = `abdul-salams-gen-${i + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }, [history]);

  return (
    <div className="min-h-screen pb-32 bg-brand-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-800 via-brand-900 to-black text-white">
      
      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-4 drop-shadow-lg tracking-tight">
          Abdul Salams AI Image Generator
        </h1>
        <p className="text-blue-200/80 max-w-2xl mx-auto text-lg font-light tracking-wide">
          Generate consistent characters in any scene. No watermarks.
        </p>
      </header>

      <main className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Main Input Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl mb-12 ring-1 ring-white/5">
          
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Text Input Area */}
            <div className="flex-1 flex flex-col gap-3">
              <label className="text-xs font-bold text-blue-400 uppercase tracking-widest ml-1">
                Scene Description
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the scene in detail... (e.g., A futuristic samurai standing on a neon rooftop in the rain)"
                className="w-full flex-1 min-h-[160px] bg-black/40 border border-white/10 rounded-2xl p-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none text-lg shadow-inner"
              />
            </div>

            {/* Reference Image Upload */}
            <div className="w-full md:w-80 flex flex-col gap-3">
               <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-purple-400 uppercase tracking-widest ml-1">
                  Character Reference
                </label>
                {referenceImage && (
                  <button onClick={clearReference} className="text-[10px] bg-red-500/20 text-red-300 px-2 py-1 rounded hover:bg-red-500/30 transition-colors">
                    CLEAR
                  </button>
                )}
               </div>
               
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className={`relative h-40 md:h-full min-h-[160px] rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex items-center justify-center group
                  ${referenceImage 
                    ? 'border-purple-500/50 bg-purple-900/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                    : 'border-white/10 hover:border-blue-400/50 hover:bg-white/5'
                  }
                 `}
               >
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   accept="image/*" 
                   className="hidden" 
                 />
                 
                 {referenceImage ? (
                   <>
                    <img src={referenceImage} alt="Reference" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                      <span className="text-xs text-white font-medium">Change Image</span>
                    </div>
                   </>
                 ) : (
                   <div className="text-center p-4">
                     <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 group-hover:text-blue-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                     </div>
                     <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Upload Reference</span>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Generate Button & Error */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {errorMsg && (
              <div className="text-red-200 bg-red-900/20 px-4 py-2 rounded-lg border border-red-500/20 text-sm font-medium animate-pulse">
                {errorMsg}
              </div>
            )}
            
            <button 
              onClick={handleGenerate}
              disabled={status === GenerationStatus.LOADING}
              className={`w-full md:w-2/3 py-4 rounded-xl text-white font-bold text-lg tracking-widest shadow-2xl transform transition-all border border-white/10 relative overflow-hidden group
                ${status === GenerationStatus.LOADING 
                  ? 'bg-gray-800 cursor-not-allowed opacity-70' 
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] hover:shadow-blue-500/20 active:scale-[0.98]'
                }
              `}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none"></div>
              <span className="relative flex items-center justify-center gap-3">
                {status === GenerationStatus.LOADING ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    GENERATING...
                  </>
                ) : (
                  "GENERATE IMAGE"
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        {history.length > 0 && (
          <div className="animate-fade-in-up pb-10">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Generation History</h2>
                <p className="text-sm text-gray-400">Your recently created masterpieces</p>
              </div>
              
              <button 
                onClick={downloadAll}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all border border-white/10 hover:border-white/20 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 12.75l-3-3m3 3 3-3m-3 3V3" />
                </svg>
                Download All ({history.length})
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((img) => (
                <ImageCard key={img.id} image={img} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;