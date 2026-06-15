"""
Relaxation Tips Library
Context-aware relaxation and mindfulness tips based on detected emotion.
"""

import random

RELAXATION_TIPS = {
    "anxious": [
        "🌬️ **4-7-8 Breathing:** Inhale for 4 counts, hold for 7, exhale slowly for 8. Repeat 3 times.",
        "🖐️ **5-4-3-2-1 Grounding:** Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
        "💧 **Cold Water Reset:** Splash cold water on your face or hold ice — it activates your body's calm reflex.",
        "📦 **Box Breathing:** Inhale 4 counts → Hold 4 → Exhale 4 → Hold 4. Used by Navy SEALs to calm down fast.",
        "🎵 **Music Break:** Put on a calm instrumental playlist for just 5 minutes. Let your mind wander.",
    ],
    "stressed": [
        "📝 **Brain Dump:** Write everything stressing you on paper — no structure needed. Just empty your mind.",
        "🚶 **2-Minute Walk:** Step outside for a quick walk. Even 120 seconds of movement shifts your mood.",
        "🍵 **Tea Ritual:** Make a warm drink slowly and mindfully. Focus only on the warmth in your hands.",
        "⏰ **Pomodoro Reset:** Work for 25 minutes, then rest completely for 5. One block at a time.",
        "🙆 **Progressive Muscle Relaxation:** Tense each muscle group for 5 seconds, then release. Start from feet.",
    ],
    "lonely": [
        "💌 **Reach Out:** Text one person you haven't spoken to in a while. Even a meme counts.",
        "🐾 **Animal Videos:** Watch cute animal videos for 5 minutes — it genuinely raises oxytocin.",
        "📖 **Join a Community:** Look for online study groups, Discord servers, or campus clubs today.",
        "🌳 **Nature Time:** Sit outside near people — a park, library, or café. Proximity helps even without talking.",
        "🤝 **Volunteer Virtually:** Helping others online gives a strong sense of connection and purpose.",
    ],
    "sad": [
        "🎨 **Express It:** Draw, doodle, or write — even badly. Externalizing emotion reduces its intensity.",
        "🛁 **Self-Care Ritual:** Take a warm shower or bath. Small physical comfort matters.",
        "📸 **Gratitude Photo:** Take a photo of one thing you're grateful for today. Just one.",
        "💬 **Talk to Someone:** You don't have to say you're sad — just be around someone you like.",
        "🌅 **Sunlight:** 10 minutes of sunlight boosts serotonin significantly. Step outside.",
    ],
    "angry": [
        "🥊 **Physical Release:** Do 20 jumping jacks, pushups, or run in place. Burn the energy.",
        "📓 **Write & Shred:** Write exactly how you feel with no filter, then tear it up. Cathartic.",
        "🎧 **Loud Music:** Put on high-energy music for one song and just feel it. Then switch to something calm.",
        "🫁 **Extended Exhale:** Breathe in normally, then exhale twice as long. This activates the parasympathetic system.",
        "⏸️ **Pause Protocol:** Count slowly to 10 before any response or action. Give your cortex time to catch up.",
    ],
    "happy": [
        "📔 **Capture It:** Write down exactly why you feel good right now. You can re-read this on hard days.",
        "🌟 **Share It:** Call or text someone and share good news — happiness amplifies when shared.",
        "🎯 **Momentum:** Use this energy to tackle something you've been avoiding. Ride the wave.",
        "🙏 **Gratitude Journal:** List 3 specific things you're grateful for. Specificity makes it more effective.",
    ],
    "calm": [
        "🧘 **Mindfulness Moment:** Spend 5 minutes just observing your breath without changing it.",
        "📚 **Learning Break:** Read something you're curious about for pure enjoyment.",
        "🌿 **Body Scan:** Starting from your head, slowly notice each body part. Release any tension you find.",
        "💡 **Set an Intention:** What do you want to feel or accomplish today? Write it down.",
    ],
}

DEFAULT_TIPS = [
    "🌬️ Take three slow, deep breaths right now. In through the nose, out through the mouth.",
    "💧 Drink a glass of water. Dehydration directly affects mood and concentration.",
    "🚶 Stand up and stretch for 60 seconds. Your body and mind are connected.",
    "😊 Name one thing that went okay today — even something tiny.",
]


def get_relaxation_tip(emotion: str) -> str:
    """Return a random relaxation tip matching the detected emotion."""
    tips = RELAXATION_TIPS.get(emotion, DEFAULT_TIPS)
    return random.choice(tips)


def get_breathing_exercise(type: str = "box") -> dict:
    """Return a structured breathing exercise."""
    exercises = {
        "box": {
            "name": "Box Breathing",
            "steps": ["Inhale for 4 counts", "Hold for 4 counts", "Exhale for 4 counts", "Hold for 4 counts"],
            "rounds": 4,
            "description": "Calms the nervous system, used for acute stress and anxiety."
        },
        "478": {
            "name": "4-7-8 Breathing",
            "steps": ["Inhale for 4 counts", "Hold for 7 counts", "Exhale for 8 counts"],
            "rounds": 3,
            "description": "Acts as a natural tranquilizer for the nervous system."
        },
        "diaphragmatic": {
            "name": "Deep Belly Breathing",
            "steps": ["Place hand on belly", "Inhale slowly, feel belly rise", "Exhale slowly, feel belly fall"],
            "rounds": 5,
            "description": "Reduces heart rate and blood pressure. Great for daily calm."
        }
    }
    return exercises.get(type, exercises["box"])
