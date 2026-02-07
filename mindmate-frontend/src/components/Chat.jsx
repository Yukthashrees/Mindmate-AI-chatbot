import { useState, useEffect, useRef } from "react";
import "../index.css"; 

// 1. DATA OBJECTS
const TRANSLATIONS = {
  en: {
    welcome: "Your sanctuary for mental well-being",
    enter: "ENTER SAFE SPACE",
    botGreeting: "Hello. I'm here to listen. How are you feeling right now?",
    placeholder: "How are you feeling?",
    calmBtn: "I feel calmer",
    nextBtn: "Next Step",
    back: "✕",
    voiceCode: "en-US",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    nameTitle: "Welcome. What shall we call you?",
    nameLabel: "Your Name",
    namePlace: "Enter your name",
    emergencyTitle: "Your safety matters. Emergency contact?",
    emergencyLabel: "Mobile Number",
    emergencyPlace: "+91 XXXXX XXXXX",
    next: "Next →",
    start: "Start My Journey"
  },
  hi: {
    welcome: "मानसिक कल्याण के लिए आपका शरणस्थल",
    enter: "सुरक्षित स्थान में प्रवेश करें",
    botGreeting: "नमस्ते। मैं यहाँ सुनने के लिए हूँ। आप अभी कैसा महसूस कर रहे हैं?",
    placeholder: "आप कैसा महसूस कर रहे हैं?",
    calmBtn: "मैं शांत महसूस कर रहा हूँ",
    nextBtn: "अगला कदम",
    back: "✕",
    voiceCode: "hi-IN",
    options: ["बिल्कुल नहीं", "कई दिन", "आधे से ज़्यादा दिन", "लगभग हर दिन"],
    nameTitle: "स्वागत है। हम आपको क्या कहकर बुलाएं?",
    nameLabel: "आपका नाम",
    namePlace: "अपना नाम दर्ज करें",
    emergencyTitle: "आपकी सुरक्षा मायने रखती है। आपातकालीन संपर्क?",
    emergencyLabel: "मोबाइल नंबर",
    emergencyPlace: "+91 XXXXX XXXXX",
    next: "अगला →",
    start: "मेरी यात्रा शुरू करें"
  },
  kn: {
    welcome: "ಮಾನಸಿಕ ಆರೋಗ್ಯಕ್ಕಾಗಿ ನಿಮ್ಮ ಸುರಕ್ಷಿತ ತಾಣ",
    enter: "ಪ್ರವೇಶಿಸಿ",
    botGreeting: "ನಮಸ್ಕಾರ. ನಾನು ನಿಮ್ಮ ಮಾತು ಕೇಳಲು ಇಲ್ಲಿದ್ದೇನೆ. ನೀವು ಈಗ ಹೇಗಿದ್ದೀರಿ?",
    placeholder: "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
    calmBtn: "ನನಗೆ ಈಗ ನೆಮ್ಮದಿ ಎನಿಸುತ್ತಿದೆ",
    nextBtn: "ಮುಂದಿನ ಹಂತ",
    back: "✕",
    voiceCode: "kn-IN",
    options: ["ಖಂಡಿತ ಇಲ್ಲ", "ಕೆಲವು ದಿನಗಳು", "ಅರ್ಧಕ್ಕಿಂತ ಹೆಚ್ಚು ದಿನಗಳು", "ಪ್ರತಿದಿನ"],
    nameTitle: "ಸ್ವಾಗತ. ನಾವು ನಿಮ್ಮನ್ನು ಏನೆಂದು ಕರೆಯಬೇಕು?",
    nameLabel: "ನಿಮ್ಮ ಹೆಸರು",
    namePlace: "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    emergencyTitle: "ನಿಮ್ಮ ಸುರಕ್ಷತೆ ಮುಖ್ಯ. ತುರ್ತು ಸಂಪರ್ಕ ಸಂಖ್ಯೆ?",
    emergencyLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    emergencyPlace: "+91 XXXXX XXXXX",
    next: "ಮುಂದೆ →",
    start: "ನನ್ನ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ"
  }
};

const MULTI_QUESTIONS = {
  en: {
    PHQ: ["Little interest or pleasure in doing things?", "Feeling down, depressed, or hopeless?", "Trouble falling or staying asleep?", "Feeling tired or little energy?", "Poor appetite or overeating?", "Feeling bad about yourself?", "Trouble concentrating?", "Moving slowly or restless?", "Thoughts of hurting yourself?"],
    GAD: ["Feeling nervous or on edge?", "Not able to stop worrying?", "Worrying too much?", "Trouble relaxing?", "Hard to sit still?", "Easily annoyed?", "Afraid something awful might happen?"]
  },
  hi: {
    PHQ: ["कामों में कम दिलचस्पी?", "उदास या निराश महसूस करना?", "नींद में परेशानी?", "थकान महसूस करना?", "भूख कम लगना या ज़्यादा खाना?", "अपने बारे में बुरा महसूस करना?", "ध्यान केंद्रित करने में परेशानी?", "धीरे चलना या बेचैनी?", "खुद को नुकसान पहुँचाने के विचार?"],
    GAD: ["घबराहट या बेचैनी?", "चिंता रोकना मुश्किल?", "बहुत ज़्यादा चिंता?", "आराम करने में परेशानी?", "स्थिर बैठना मुश्किल?", "जल्दी चिढ़ जाना?", "डर कि कुछ बुरा होगा?"]
  },
  kn: {
    PHQ: ["ಕೆಲಸದಲ್ಲಿ ಆಸಕ್ತಿ ಇಲ್ಲದಿರುವುದು?", "ಬೇಸರ ಅಥವಾ ನಿರಾಶೆ?", "ನಿದ್ರೆಯ ಸಮಸ್ಯೆ?", "ಸುಸ್ತು ಅಥವಾ ಶಕ್ತಿ ಇಲ್ಲದಿರುವುದು?", "ಹಸಿವಾಗದಿರುವುದು ಅಥವಾ ಅತಿಯಾಗಿ ತಿನ್ನುವುದು?", "ನಿಮ್ಮ ಬಗ್ಗೆ ಕೆಟ್ಟದಾಗಿ ಅನಿಸುವುದು?", "ಗಮನ ಹರಿಸಲು ತೊಂದರೆ?", "ತುಂಬಾ ನಿಧಾನವಾಗಿ ಚಲಿಸುವುದು?", "ನಿಮಗೆ ಹಾನಿ ಮಾಡಿಕೊಳ್ಳುವ ಆಲೋಚನೆ?"],
    GAD: ["ಗಾಬರಿ ಅಥವಾ ಆತಂಕ?", "ಚಿಂತೆಯನ್ನು ತಡೆಯಲು ಸಾಧ್ಯವಾಗದಿರುವುದು?", "ಅತಿಯಾಗಿ ಚಿಂತಿಸುವುದು?", "ವಿಶ್ರಾಂತಿ ಪಡೆಯಲು ತೊಂದರೆ?", "ಸ್ಥಿರವಾಗಿ ಕುಳಿತುಕೊಳ್ಳಲು ಕಷ್ಟ?", "ಬೇಗನೆ ಸಿಟ್ಟು ಬರುವುದು?", "ಕೆಟ್ಟದ್ದು ಸಂಭವಿಸಬಹುದು ಎಂಬ ಭಯ?"]
  }
};

const POSITIVE_WALLPAPERS = [
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200"
];

const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2", quote: "Take it one breath at a time.", name: "Dr. Sarah Miller" },
  { img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d", quote: "You are the architect of your peace.", name: "Dr. James Wilson" },
  { img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f", quote: "Healing is not linear, be patient with yourself.", name: "Dr. Elena Rodriguez" },
  { img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d", quote: "Your mental health is a priority.", name: "Dr. Marcus Chen" }
];

const POSITIVE_QUOTES = [
  "Smile, you're doing fantastic!",
  "Keep spreading positivity.",
  "Prioritize your own comfort and boundaries.",
  "You're not alone, and I'm here for you.",
  "Take a deep breath; you've got this."
];

const RESULT_QUOTES = [
    "“You don't have to see the whole staircase, just take the first step.”",
    "“Self-care is how you take your power back.”",
    "“This too shall pass, and you are stronger than you think.”",
    "“Healing is not linear, and that is okay. You are doing great.”",
    "“Your current situation is not your final destination.”"
];

const GROUNDING_STEPS = [
  { count: 5, task: "Things you can see", color: "rgba(145, 182, 211, 0.9)" },
  { count: 4, task: "Things you can touch", color: "rgba(202, 219, 175, 0.9)" },
  { count: 3, task: "Things you can hear", color: "rgba(195, 195, 239, 0.9)" },
  { count: 2, task: "Things you can smell", color: "rgba(224, 152, 200, 0.9)" },
  { count: 1, task: "Thing you can taste", color: "rgba(178, 222, 202, 0.9)" }
];

const Chat = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [introIdx, setIntroIdx] = useState(0);
  const [wallIndex, setWallIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [resultQuoteIdx, setResultQuoteIdx] = useState(0);
  const [lang, setLang] = useState("en");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]); 
  const [isTyping, setIsTyping] = useState(false); 
  const [mode, setMode] = useState("menu"); 
  const [onboardingStep, setOnboardingStep] = useState(0); 
  const [patientData, setPatientData] = useState({ name: "", emergency: "" });
  
  const [activeTest, setActiveTest] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [currentG, setCurrentG] = useState(0); 
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const audioRef = useRef(null);
  const chatEndRef = useRef(null); 
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    // REDUCED VOLUME: set to 0.05 for very low background audio
    if (audioRef.current) {
      audioRef.current.volume = 0.05; 
    }

    const introTimer = setInterval(() => setIntroIdx(p => (p + 1) % POSITIVE_WALLPAPERS.length), 4000);
    const wallTimer = setInterval(() => setWallIndex(p => (p + 1) % POSITIVE_WALLPAPERS.length), 2000);
    const heroTimer = setInterval(() => setHeroIndex(p => (p + 1) % HERO_SLIDES.length), 4000);
    const quoteTimer = setInterval(() => setQuoteIndex(p => (p + 1) % POSITIVE_QUOTES.length), 8000);

    return () => { 
      clearInterval(introTimer); 
      clearInterval(wallTimer); 
      clearInterval(heroTimer); 
      clearInterval(quoteTimer);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");
    
    const recognition = new SpeechRecognition();
    recognition.lang = t.voiceCode;

    recognition.onstart = () => {
      setIsListening(true);
      // Mute music while recording
      if (audioRef.current) audioRef.current.pause();
    };

    recognition.onend = () => {
      setIsListening(false);
      // Resume music after recording
      if (audioRef.current && !showIntro) audioRef.current.play().catch(() => {});
    };

    recognition.onresult = (e) => setInputText(e.results[0][0].transcript);
    recognition.start();
  };

  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = t.voiceCode;
    window.speechSynthesis.speak(utterance);
  };

  const handleEnter = () => {
    setShowIntro(false);
    setMode("onboarding");
    if (audioRef.current) audioRef.current.play().catch(() => {});
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText("");
    
    const newMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch("https://mindmate-ai-chatbot-your-well-wisher.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            message: userMsg,
            name: patientData.name,
            score: score 
        })
      });

      const data = await response.json();
      if (data.ok) {
        setMessages([...newMessages, { role: "bot", text: data.reply }]);
        speak(data.reply);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages([...newMessages, { role: "bot", text: "I'm having trouble connecting to my thoughts right now. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAnswer = (points) => {
    const nextScore = score + points;
    setScore(nextScore);
    
    if (currentQ < MULTI_QUESTIONS[lang][activeTest].length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setResultQuoteIdx(Math.floor(Math.random() * RESULT_QUOTES.length));
      setShowResult(true);
      const endpoint = activeTest === "PHQ" ? "submit-phq" : "submit-gad";
      
      fetch(`https://mindmate-ai-chatbot-your-well-wisher.onrender.com/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: patientData.name,
          score: nextScore,
          emergencyContact: patientData.emergency,
          answers: Array(MULTI_QUESTIONS[lang][activeTest].length).fill(points) 
        }),
      })
      .then(res => res.json())
      .then(data => console.log("Backend response:", data))
      .catch(err => console.error("Fetch error:", err));
    }
  };

  const getSeverityColor = () => {
    if (mode === "grounding") return GROUNDING_STEPS[currentG].color;
    if (mode === "chatting") return "#F9F8F4"; 
    if (!activeTest) return "rgba(228, 245, 233, 0.85)";
    return score < 10 ? "rgba(233, 226, 255, 0.9)" : "rgba(250, 171, 180, 0.9)";
  };

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch('https://mindmate-ai-chatbot-your-well-wisher.onrender.com/api/save-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          emergency: data.emergency,
          language: lang,
          clientId: Date.now().toString() 
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      console.log("Success:", result.message);
    } catch (error) {
      console.error("Error connecting to Flask/MongoDB:", error);
    }
  };

  const clearChat = () => {
    setMessages([]);
    window.speechSynthesis.cancel();
  };

  return (
    <div className="main-wrapper">
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/audio/2025/03/13/audio_dac62db45b.mp3" />

      <div className={`intro-screen ${!showIntro ? 'fade-away' : ''}`}>
        {POSITIVE_WALLPAPERS.map((img, i) => (
          <div key={i} className={`intro-bg ${i === introIdx ? 'active' : ''}`} style={{ backgroundImage: `url(${img})` }} />
        ))}
        <div className="intro-overlay"></div>
        <div className="intro-content">
          <h1 className="reveal-text">MindMate</h1>
          <p className="sub-reveal">{t.welcome}</p>
          <div className="lang-toggle-container">
            {['en', 'hi', 'kn'].map(l => (
              <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
                {l === 'kn' ? 'ಕನ್ನಡ' : l === 'hi' ? 'हिंदी' : 'ENG'}
              </button>
            ))}
          </div>
          <div className="bubble-trigger" onClick={handleEnter}>
             <div className="pulse-ring"></div>
             <button className="glass-enter-btn">{t.enter}</button>
          </div>
        </div>
      </div>

      <div className="app-bg-container">
        {POSITIVE_WALLPAPERS.map((url, i) => (
          <div key={i} className={`dynamic-bg ${i === wallIndex ? 'active' : ''}`} style={{ backgroundImage: `url(${url})` }} />
        ))}
      </div>

      <div className={`glass-shell ${!showIntro ? 'slide-up' : ''}`} style={{ backgroundColor: getSeverityColor(), borderRadius: '40px' }}>
        <div className="chat-container">
          
          {mode === "onboarding" && (
            <div className="onboarding-container animate-in">
              {onboardingStep === 0 && (
                <div className="onboard-card slide-up">
                  <div className="graphic-icon">👤</div>
                  <h2 className="onboard-title">{t.nameTitle}</h2>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      className="modern-input"
                      placeholder=" "
                      value={patientData.name}
                      onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                    />
                    <label className="floating-label">{t.nameLabel}</label>
                  </div>
                  <button className="pill purple glow-btn" onClick={() => setOnboardingStep(1)}>Next →</button>
                </div>
              )}

              {onboardingStep === 1 && (
                <div className="onboard-card slide-up">
                  <div className="graphic-icon">🛡️</div>
                  <h2 className="onboard-title">{t.emergencyTitle}</h2>
                  <div className="input-wrapper">
                    <input 
                      type="tel" 
                      className="modern-input"
                      placeholder=" "
                      value={patientData.emergency}
                      onChange={(e) => setPatientData({...patientData, emergency: e.target.value})}
                    />
                    <label className="floating-label">{t.emergencyLabel}</label>
                  </div>
                  <button className="pill purple glow-btn" onClick={() => {
                    saveToDatabase(patientData); 
                    setMode("menu");
                  }}>
                    {t.start}
                  </button>
                </div>
              )}
            </div>
          )}

          {mode === "menu" && (
            <div className="animate-in">
              <div className="quote-slider">
                {HERO_SLIDES.map((slide, i) => (
                  <div key={i} className={`hero-card ${i === heroIndex ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.img})` }}>
                    <div className="card-text">
                      <p className="handwritten">"{slide.quote}"</p>
                      <span className="doc-label">{slide.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="action-menu">
                <button className="pill pink" onClick={() => {setMode("test"); setActiveTest("PHQ"); setCurrentQ(0); setScore(0); setShowResult(false);}}>📝 PHQ-9 Depression Test</button>
                <button className="pill yellow" onClick={() => {setMode("test"); setActiveTest("GAD"); setCurrentQ(0); setScore(0); setShowResult(false);}}>🌊 GAD-7 Anxiety Test</button>
                <button className="pill green" onClick={() => { setMode("grounding"); setCurrentG(0); }}>🧘 Grounding Exercise</button>
                <button className="pill purple" onClick={() => { setMode("chatting"); speak(t.botGreeting); }}>💬 Start Chatting</button>
              </div>
            </div>
          )}

          {mode === "test" && (
            <div className="test-flow">
              {!showResult ? (
                <div className="question-card animate-in">
                  <span className="test-badge">{activeTest} Question {currentQ + 1}</span>
                  <h2 className="question-text">{MULTI_QUESTIONS[lang][activeTest][currentQ]}</h2>
                  <div className="options-grid">
                    {t.options.map((opt, idx) => (
                      <button key={idx} className="option-btn" onClick={() => handleAnswer(idx)}>{opt}</button>
                    ))}
                  </div>
                  <button className="back-btn" onClick={() => setMode("menu")}>Cancel Test</button>
                </div>
              ) : (
                <div className="result-card animate-in" style={{ textAlign: 'center', padding: '20px' }}>
                  <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
                    {score >= 20 ? "🚨 Severe Symptoms Detected" : "Assessment Complete"}
                  </h2>
                  <p style={{ fontSize: '20px', fontWeight: 'bold' }}>Total Score: {score}</p>
                  
                  <div className="post-test-quote" style={{ margin: '20px 0', padding: '15px', background: 'rgba(255,255,255,0.6)', borderRadius: '15px', borderLeft: '5px solid #ff9a9e' }}>
                     <p style={{ fontStyle: 'italic', color: '#555' }}>{RESULT_QUOTES[resultQuoteIdx]}</p>
                  </div>

                  {score >= 20 && (
                    <div className="severity-info" style={{ marginTop: '10px', background: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '10px' }}>
                      <p><strong>Recommendation:</strong> Your score suggests you may be experiencing severe distress. Please consult a mental health professional.</p>
                      <p style={{ color: '#d32f2f', fontWeight: 'bold', marginTop: '10px' }}>An alert has been sent to your emergency contact.</p>
                    </div>
                  )}
                  <button className="pill purple" onClick={() => setMode("menu")} style={{ marginTop: '20px' }}>Back to Menu</button>
                </div>
              )}
            </div>
          )}

          {mode === "grounding" && (
            <div className="grounding-flow animate-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div className="breath-circle"></div>
              <h2 style={{ fontSize: '60px', margin: '0' }}>{GROUNDING_STEPS[currentG].count}</h2>
              <p style={{ fontSize: '20px', marginBottom: '30px' }}>{GROUNDING_STEPS[currentG].task}</p>
              <button className="pill purple" onClick={() => currentG < 4 ? setCurrentG(currentG + 1) : setMode("menu")}>
                {currentG < 4 ? t.nextBtn : t.calmBtn}
              </button>
            </div>
          )}

          {mode === "chatting" && (
            <div className="chat-window animate-in" style={{ height: '550px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 25px', alignItems: 'center' }}>
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', fontSize: '18px' }}>MindMate-Your well wisher</span>
                    <span style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>{POSITIVE_QUOTES[quoteIndex]}</span>
                 </div>
                 
                 <div className="header-right" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={clearChat} style={{background:'none', border:'none', fontSize: '20px', cursor:'pointer', opacity: 0.6}}>🖌️</button>
                    <button className={`voice-toggle`} onClick={() => setVoiceEnabled(!voiceEnabled)} style={{background:'none', border:'none', fontSize: '14px', cursor:'pointer', color: '#888'}}>
                       {voiceEnabled ? '🔊 Audio' : 'Muted'}
                    </button>
                    <button onClick={() => setMode("menu")} style={{background:'none', border:'none', fontSize: '18px', cursor:'pointer'}}>✕</button>
                 </div>
               </div>
               
               <div style={{ flex: 1, padding: '10px 25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 <div className="msg-bot" style={{ background: 'white', padding: '15px 20px', borderRadius: '20px', borderBottomLeftRadius: '5px', width: 'fit-content', alignSelf: 'flex-start', fontSize: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', maxWidth: '85%', lineHeight: '1.5' }}>
                    {t.botGreeting}
                 </div>
                 
                 {messages.map((m, i) => (
                    <div key={i} className={`msg-${m.role}`} style={{ 
                        background: m.role === 'user' ? '#ff9a9e' : 'white', 
                        color: m.role === 'user' ? 'white' : 'black',
                        padding: '15px 20px', 
                        borderRadius: '20px', 
                        borderBottomRightRadius: m.role === 'user' ? '5px' : '20px',
                        borderBottomLeftRadius: m.role === 'bot' ? '5px' : '20px',
                        width: 'fit-content', 
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        fontSize: '14px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        maxWidth: '85%',
                        lineHeight: '1.5'
                    }}>
                        {m.text}
                    </div>
                 ))}
                 
                 {isTyping && <div style={{ fontSize: '12px', color: '#999', paddingLeft: '10px' }}>Typing...</div>}
                 <div ref={chatEndRef} />
               </div>
            </div>
          )}

          <div className="chat-bar" style={{ margin: '15px 25px 15px', background: 'white', borderRadius: '50px', padding: '8px 15px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <button className={`mic-btn ${isListening ? 'listening' : ''}`} onClick={startListening} style={{border:'none', background:'none', cursor:'pointer', fontSize: '18px', marginRight: '10px'}}>
               🎤
            </button>
            <input 
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', padding: '10px 5px' }}
              placeholder={t.placeholder} 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={() => mode === "menu" && setMode("chatting")} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            />
            <button onClick={handleSend} style={{ border:'none', background:'#F0E6FF', width: '40px', height: '40px', borderRadius: '50%', cursor:'pointer', color: '#9c27b0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ➤
            </button>
          </div>

          <div className="safety-footer" style={{ textAlign: 'center', paddingBottom: '15px', fontSize: '10px', color: '#888', opacity: 0.7 }}>
             MindMate is an AI assistant, not a doctor. In a crisis, please call your local emergency services.
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;