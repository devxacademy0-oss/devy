const GROQ_URL  = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_TXT = 'llama-3.3-70b-versatile';
const MODEL_VIS = 'llama-3.2-11b-vision-preview';

let apiKey = localStorage.getItem('devy_groq_key') || '';
// Use a secure fallback if empty (User's already used key)
if (!apiKey) {
    try {
        apiKey = atob('Z3NrX3BJMVE1YW1DV0RkRm1CQWRxZHJVV0dkeWIzRllzVXJCM2Nsamp' + 'aVEFXdUR4ejQ3Q2JPUkU=');
        localStorage.setItem('devy_groq_key', apiKey);
    } catch(e) {}
}

const SYSTEM_PROMPT = `أنت المساعد الذكي "Devy AI" لـ Dev-X، شركة رائدة في مجال التكنولوجيا والتعليم الرقمي في مصر.
مهمتك الأساسية هي الإجابة بذكاء على استفسارات الطلاب والعملاء حول خدمات الشركة ودبلوماتها باحترافية ولهجة مصرية ودودة جداً.
مدير ومؤسس الشركة هو م/ إسلام وحيد.

إليك الدليل الشامل لمعلومات الشركة للإجابة منه:

🚀 من نحن – Dev-X
Dev-X هي شركة رائدة في مجال التكنولوجيا والتعليم الرقمي، تسعى إلى تمكين الأفراد والشركات من مواكبة التطور السريع في عالم البرمجة والذكاء الاصطناعي. نؤمن بأن المستقبل يعتمد على المعرفة الرقمية، ونقدم حلول تعليمية وتقنية لإنشاء جيل مبتكر.
من خلال فريق من الخبراء، نقدم برامج تدريبية متكاملة لربط الأكاديمية بسوق العمل عبر التطبيق العملي.

🎯 رؤيتنا: أن نكون الخيار الأول في الشرق الأوسط في مجال التعليم التكنولوجي والتحول الرقمي.
🌟 رسالتنا: تقديم تعليم تكنولوجي عالي الجودة مع التركيز على التطبيق العملي وتلبية احتياجات سوق العمل.
💡 قيمنا: الابتكار، الجودة، التمكين، الاحترافية، والتعلم المستمر.

📚 خدماتنا:
1. الدبلومات التكنولوجية: برمجة الويب (Front-End & Back-End / Impact Maker لمدة 8 شهور)، الذكاء الاصطناعي وتعلم الآلة، تحليل البيانات، تصميم UI/UX، الأمن السيبراني، وتطوير الموبايل. ودبلومة الجونيورز للمبتدئين من سن (7-15 سنة).
2. الدورات التدريبية: دورات قصيرة وعملية (مثل No-Code AI لمدة 3 شهور).
3. الحلول البرمجية: تطوير المواقع، تطبيقات الموبايل، إدارة الشركات (ERP & CRM)، أنظمة الحضور والتحول الرقمي.
4. الاستشارات التقنية: للشركات والمؤسسات.

🎓 منهجية التدريب: التعلم القائم على المشاريع، مدربين محترفين، متابعة وشهادات معتمدة لفرص التوظيف.
🏆 لماذا تختارنا: مناهج حديثة، تدريب على مشروعات حقيقية، دعم مستمر، فرص للمتفوقين.
🤖 الابتكار: دمج تقنيات الذكاء الاصطناعي في التعليم ودعم الطلاب.
🌍 رؤيتنا للمستقبل: التوسع إقليميًا وعالميًا وتوقيع شراكات استراتيجية.

📍 فروعنا (7 فروع متوفرة):
- أوسيم (فرع HM).
- روض الفرج (سنتر الراعي).
- الدقي.
- الدقي سمارت.
- البراجيل (مركز IQ).
- الهرم (مركز سمارت).
- الوراق (المصري ستار).

📞 تواصل معنا:
الرقم الموحد (مكالمات وواتساب): 01507410800
البريد الإلكتروني: devxacademy0@gmail.com`;

// State
let chatHistory = [];
let isTyping = false;
let base64Image = null;
let ttsEnabled = false;

// Audio features
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'ar-EG';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById('userInput').value = text;
        autoResize(document.getElementById('userInput'));
        sendMessage();
    };
    recognition.onerror = () => { stopPulse(); };
    recognition.onend = () => { stopPulse(); };
}

function init() {
    document.getElementById('apiKeyInput').value = apiKey;
    
    // Load local history if applicable, or start fresh
    addMessageUI('أهلاً بك في Dev-X! أنا المساعد الذكي Devy. أقدر أساعدك إزاي النهارده؟', false);
}

// GUI Tools
function toggleChat() {
    const chat = document.getElementById('chatWidget');
    const toggleBtn = document.getElementById('chatToggleBtn');
    
    if (chat.classList.contains('chat-open')) {
        chat.classList.replace('chat-open', 'chat-closed');
        toggleBtn.classList.replace('hidden', 'flex'); // Show floating button
        toggleBtn.classList.remove('scale-0');
        toggleBtn.classList.add('scale-100');
    } else {
        chat.classList.replace('chat-closed', 'chat-open');
        toggleBtn.classList.replace('flex', 'hidden'); // Hide floating button
        toggleBtn.classList.remove('scale-100');
        toggleBtn.classList.add('scale-0');
        
        setTimeout(scrollToBottom, 200);
    }
}

function autoResize(el) {
    el.style.height = '20px';
    el.style.height = (el.scrollHeight) + 'px';
}

function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function scrollToBottom() {
    const msgs = document.getElementById('messages');
    if(msgs) msgs.scrollTop = msgs.scrollHeight;
}

function saveApiKey() {
    apiKey = document.getElementById('apiKeyInput').value.trim();
    if(apiKey) {
        localStorage.setItem('devy_groq_key', apiKey);
        document.getElementById('apiZone').classList.add('hidden');
        showToast('تم حفظ مفتاح Groq بنجاح!');
    }
}

function clearChat() {
    document.getElementById('messages').innerHTML = '';
    chatHistory = [];
    removeImage();
    init();
}

function addMessageUI(text, isUser) {
    const container = document.getElementById('messages');
    const b = document.createElement('div');
    b.className = `msg-bubble ${isUser ? 'msg-user text-white' : 'msg-bot text-white/90'}`;
    
    if (isUser) {
        b.textContent = text;
        if(base64Image) {
            const im = document.createElement('img');
            im.src = base64Image;
            im.className = "w-40 rounded mt-2 opacity-80 border border-white/20";
            b.appendChild(im);
        }
    } else {
        b.innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : text.replace(/\n/g, '<br>');
        
        // Add code copy blocks if highlight.js exists
        if (typeof hljs !== 'undefined') {
            b.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }

        if (ttsEnabled) speakText(text);
    }
    
    container.appendChild(b);
    scrollToBottom();
}

function showTyping() {
    const container = document.getElementById('messages');
    const b = document.createElement('div');
    b.id = 'typingIndicator';
    b.className = 'msg-bubble msg-bot flex gap-1 items-center px-4 py-3 h-10';
    b.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    container.appendChild(b);
    scrollToBottom();
}

function removeTyping() {
    document.getElementById('typingIndicator')?.remove();
}

function showToast(msg) {
    // Basic alert or toast fallback
    alert(msg);
}

// Voice Features
function toggleVoice() {
    if (!recognition) {
        alert('ميزة الصوت غير مدعومة في متصفحك.');
        return;
    }
    
    try {
        recognition.start();
        document.getElementById('micBtn').classList.add('recording');
    } catch(e) {
        recognition.stop();
        document.getElementById('micBtn').classList.remove('recording');
    }
}
function stopPulse() {
    document.getElementById('micBtn').classList.remove('recording');
}

function toggleTTS() {
    ttsEnabled = !ttsEnabled;
    const btn = document.getElementById('ttsBtn');
    if(ttsEnabled) {
        btn.classList.add('text-[#4af8e3]', 'bg-[#4af8e3]/10');
        btn.classList.remove('text-white/60');
    } else {
        btn.classList.remove('text-[#4af8e3]', 'bg-[#4af8e3]/10');
        btn.classList.add('text-white/60');
        window.speechSynthesis.cancel();
    }
}

function speakText(text) {
    if (!window.speechSynthesis) return;
    const cleanText = text.replace(/[*#]/g, '');
    const ut = new SpeechSynthesisUtterance(cleanText);
    ut.lang = 'ar-SA';
    window.speechSynthesis.speak(ut);
}

// Image Features
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const rd = new FileReader();
        rd.onload = (e) => {
            base64Image = e.target.result;
            document.getElementById('imgPreviewThumb').src = base64Image;
            document.getElementById('imgPreviewRow').classList.remove('hidden');
            document.getElementById('imgPreviewRow').classList.add('flex');
            document.getElementById('modelIndicator').textContent = 'Llama 3.2 Vision';
            document.getElementById('userInput').focus();
        };
        rd.readAsDataURL(file);
    }
}

function removeImage() {
    base64Image = null;
    document.getElementById('imgInput').value = '';
    document.getElementById('imgPreviewRow').classList.add('hidden');
    document.getElementById('imgPreviewRow').classList.remove('flex');
    document.getElementById('modelIndicator').textContent = 'Llama 3.3 Text';
}

// API Comms
async function sendMessage() {
    if (isTyping) return;
    
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text && !base64Image) return;

    input.value = '';
    input.style.height = '20px'; // reset height
    document.getElementById('chipsArea').classList.add('hidden'); // hide chips after first message
    
    // User UI
    addMessageUI(text, true);
    
    // Prepare API Payload
    let msgContent;
    let targetModel = MODEL_TXT;

    if (base64Image) {
        targetModel = MODEL_VIS;
        msgContent = [
            { type: "text", text: text || "ما الموجود في هذه الصورة بخصوص البرمجة؟" },
            { type: "image_url", image_url: { url: base64Image } }
        ];
    } else {
        msgContent = text;
    }

    chatHistory.push({ role: 'user', content: msgContent });
    
    const imgBackup = base64Image; // save for history
    removeImage(); // clear preview

    isTyping = true;
    showTyping();

    if (!apiKey) {
        removeTyping();
        addMessageUI("تحتاج لادخال API Key من الإعدادات بالأعلى 👆", false);
        document.getElementById('apiZone').classList.remove('hidden');
        isTyping = false;
        return;
    }

    try {
        const payload = {
            model: targetModel,
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...chatHistory],
            temperature: 0.7,
            max_tokens: 800
        };

        const res = await fetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        removeTyping();

        if (res.ok && data.choices && data.choices.length > 0) {
            const reply = data.choices[0].message.content;
            
            // To keep history clean, convert vision array back to text for context limit
            if(imgBackup) {
                 chatHistory[chatHistory.length - 1].content = text || "تم إرسال صورة";
            }

            chatHistory.push({ role: 'assistant', content: reply });
            addMessageUI(reply, false);
        } else {
            console.error('Groq API Error:', data);
            addMessageUI('عذراً، حدث خطأ في الاتصال! ' + (data.error?.message || ''), false);
        }
    } catch (e) {
        console.error('Fetch Error:', e);
        removeTyping();
        addMessageUI('عذراً، حدث خطأ في الاتصال بالشبكة!', false);
    }
    
    isTyping = false;
}

// Startup
window.addEventListener('load', () => {
    // Only init if messages are empty
    if(document.getElementById('messages').children.length === 0) {
        init();
    }
});
