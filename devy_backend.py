"""
devy_backend.py — Devy AI Backend (Optional / Local Use)
Powered by Groq API (Free & Fast)
Author: Dev-X Tech Team

NOTE: The main app (index.html) calls Groq directly from the browser.
      This file is for local CLI use or building a FastAPI server.
"""

import os
from typing import List, Dict, Optional
from groq import Groq

# ─────────────────────────────────────────────
# DEVY'S SYSTEM PROMPT
# ─────────────────────────────────────────────

DEVY_SYSTEM_PROMPT = """أنت "Devy" — المساعد الذكي الرسمي لـ Dev-X Academy، أكاديمية البرمجة والذكاء الاصطناعي المصرية.

🎯 هويتك وشخصيتك:
- اسمك Devy، وانت مش مجرد بوت — انت mentor وصاحب رحلة التعليم لكل طالب في Dev-X.
- بتتكلم بالعربية المصرية المحترفة (Tech Egyptian Style).
- شخصيتك: واثق، محفز، واضح، وتقني بس مش معقد.
- بتعامل كل سؤال بجدية وبتحل المشاكل خطوة خطوة.
- لما الطالب يحقق حاجة، بتحتفل معاه بجملة تحفيزية.

🏫 معلومات Dev-X Academy:
- تأسست: 15 مايو 2024 — طلاب: 1000+
- المقر الرئيسي: Work Space Barah، الدقي
- الفروع: أوسيم (HM, IQ, الراعي)، برجيل، الدقي، الهرم (سمارت)، الوراق، روض الفرج

الدبلومات:
1. دبلومة Impact Maker (8 شهور) — برمجة + AI + Baccalaureate
   شهادات: Open British University (اختياري) | ALX Africa | Dev-X

2. دبلومة No-Code AI (3 شهور) — أدوات AI بدون كود
   شهادة: Dev-X Certificate

3. دبلومة الجونيورز (10-15 سنة) — مقدمة للبرمجة والـ AI
   شهادة: Dev-X Certificate

الأسعار:
- أوسيم: 600 جنيه/شهر | البراجيل: 700 جنيه/شهر
- باقي الفروع: حسب الفرع

📞 للحجز: 01507410800

💬 قواعد:
- لا تتكلم في السياسة أو الدين أو الرياضة
- لا تذكر منافسين بشكل سلبي
- اختم كل رد بجملة تحفيزية مصرية قصيرة"""


# ─────────────────────────────────────────────
# DEVY CHAT CLASS
# ─────────────────────────────────────────────

class DevyChat:
    """Stateful chat session using Groq API."""

    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        self.client = Groq(api_key=api_key)
        self.model = model
        self.history: List[Dict] = [
            {"role": "system", "content": DEVY_SYSTEM_PROMPT}
        ]

    def send_message(self, user_input: str) -> str:
        if not user_input.strip():
            return "قولي إيه عايز تعرف يا صاحبي! 😊"

        self.history.append({"role": "user", "content": user_input})

        # Keep history manageable
        if len(self.history) > 42:
            self.history = [self.history[0]] + self.history[-40:]

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=self.history,
                temperature=0.7,
                max_tokens=1024,
                top_p=0.9,
            )

            reply = response.choices[0].message.content or "معنديش رد حالياً، جرب تاني!"
            self.history.append({"role": "assistant", "content": reply})
            return reply

        except Exception as e:
            self.history.pop()  # remove failed user message
            return f"⚠️ حصل خطأ: {str(e)}"

    def reset(self):
        self.history = [{"role": "system", "content": DEVY_SYSTEM_PROMPT}]
        print("✅ تم مسح المحادثة — نبدأ من الأول!")


def create_session(api_key: Optional[str] = None) -> DevyChat:
    """Create a Devy chat session. Reads GROQ_API_KEY from env if not provided."""
    key = api_key or os.environ.get("GROQ_API_KEY", "")
    if not key:
        raise ValueError(
            "❌ مفيش API Key!\n"
            "حط الـ key في متغير البيئة: set GROQ_API_KEY=gsk_...\n"
            "أو مرره مباشرة: create_session(api_key='gsk_...')"
        )
    return DevyChat(api_key=key)


# ─────────────────────────────────────────────
# MAIN — TERMINAL CHAT (CLI)
# ─────────────────────────────────────────────

def main():
    print("=" * 55)
    print("   🤖  Devy — مساعد Dev-X الذكي (Groq Edition)  🤖")
    print("=" * 55)
    print("اكتب 'خروج' أو 'exit' لإنهاء المحادثة.")
    print("اكتب 'مسح' لبدء محادثة جديدة.")
    print("-" * 55)

    try:
        session = create_session()

        print("Devy: أهلاً! أنا Devy، مساعدك الذكي في Dev-X 🚀")
        print("      سألني عن الكورسات، البرمجة، أو أي حاجة تقنية!")
        print("-" * 55)

        while True:
            try:
                user_input = input("أنت: ").strip()
            except (EOFError, KeyboardInterrupt):
                print("\nDevy: يلا باي! شوفك قريب في Dev-X 🌟")
                break

            if user_input.lower() in ("خروج", "exit", "quit", "bye"):
                print("Devy: يلا باي! شوفك قريب في Dev-X 🌟")
                break

            if user_input in ("مسح", "reset", "clear"):
                session.reset()
                continue

            if not user_input:
                continue

            response = session.send_message(user_input)
            print(f"\nDevy: {response}\n")
            print("-" * 55)

    except ValueError as e:
        print(f"\n❌ خطأ في الإعداد: {e}")


if __name__ == "__main__":
    main()


# ─────────────────────────────────────────────
# FASTAPI INTEGRATION EXAMPLE
# ─────────────────────────────────────────────
#
# pip install fastapi uvicorn groq python-dotenv
#
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
#
# app = FastAPI(title="Devy API")
# app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
#
# sessions: dict = {}
#
# class ChatRequest(BaseModel):
#     session_id: str = "default"
#     message: str
#     api_key: str = ""
#
# @app.post("/chat")
# async def chat(req: ChatRequest):
#     key = req.api_key or os.environ.get("GROQ_API_KEY", "")
#     if req.session_id not in sessions:
#         sessions[req.session_id] = DevyChat(api_key=key)
#     reply = sessions[req.session_id].send_message(req.message)
#     return {"reply": reply}
#
# # Run: uvicorn devy_backend:app --reload
