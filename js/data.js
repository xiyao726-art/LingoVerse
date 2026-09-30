/* ============================================================
 * 语界 LingoVerse —— 课程内容数据库
 * 结构：语种 → 分级 → 课程（词汇 / 语法 / 口语 / 听力）
 * ============================================================ */
(function () {
"use strict";

/* ---------- 英语 English ---------- */
const EN = {
  id: "en", name: "英语", native: "English", flag: "🇬🇧", speech: "en-US",
  levels: [
    {
      id: "en-b", name: "初级 Beginner", sub: "CEFR A1-A2 · 生存英语", color: "#4A86F7",
      lessons: [
        {
          id: "en-l1", icon: "👋", title: "Greetings 问候与介绍",
          desc: "学会打招呼、自我介绍与礼貌用语",
          vocab: [
            { w: "Hello", p: "/həˈloʊ/", t: "你好" },
            { w: "Goodbye", p: "/ɡʊdˈbaɪ/", t: "再见" },
            { w: "Thank you", p: "/ˈθæŋk ju/", t: "谢谢你" },
            { w: "Sorry", p: "/ˈsɒri/", t: "抱歉；对不起" },
            { w: "Nice to meet you", p: "/naɪs tu miːt ju/", t: "很高兴认识你" },
            { w: "Excuse me", p: "/ɪkˈskjuːz mi/", t: "打扰一下" }
          ],
          grammar: [
            { q: "___ you a student?", o: ["Are", "Is", "Am"], a: 0, e: "主语是 you，be 动词用 are。" },
            { q: "She ___ from Japan.", o: ["are", "is", "am"], a: 1, e: "主语 She 是第三人称单数，用 is。" },
            { q: "My name ___ Tom.", o: ["am", "are", "is"], a: 2, e: "My name 视为单数，用 is。" }
          ],
          speaking: [
            { t: "Hello! My name is Alex. Nice to meet you.", tip: "注意 name 的连读与降调。" },
            { t: "Thank you very much for your help.", tip: "Thank you 发音要轻快。" },
            { t: "Excuse me, where is the station?", tip: "礼貌询问用 Excuse me 开头。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "Hi! I'm Sara." },
              { w: "B", t: "Hello Sara! I'm Ken." },
              { w: "A", t: "Are you a new student?" },
              { w: "B", t: "Yes, I am. Nice to meet you." },
              { w: "A", t: "Nice to meet you too!" }
            ],
            qs: [
              { q: "Who is the new student?", o: ["Sara", "Ken", "The teacher"], a: 1 },
              { q: "What is the girl's name?", o: ["Sara", "Ken", "Tom"], a: 0 },
              { q: "They are meeting for the first time.", o: ["True", "False", "Not said"], a: 0 }
            ]
          }
        },
        {
          id: "en-l2", icon: "🕐", title: "Time 数字与时间",
          desc: "询问时间、谈论星期与日程安排",
          vocab: [
            { w: "one", p: "/wʌn/", t: "一" },
            { w: "ten", p: "/ten/", t: "十" },
            { w: "hundred", p: "/ˈhʌndrəd/", t: "一百" },
            { w: "morning", p: "/ˈmɔːrnɪŋ/", t: "早晨" },
            { w: "tomorrow", p: "/təˈmɒroʊ/", t: "明天" },
            { w: "weekend", p: "/ˈwiːkend/", t: "周末" }
          ],
          grammar: [
            { q: "I have English class ___ 9 o'clock.", o: ["at", "in", "on"], a: 0, e: "具体钟点前用介词 at。" },
            { q: "There ___ seven days in a week.", o: ["is", "are", "be"], a: 1, e: "seven days 是复数，用 are。" },
            { q: "___ is it? — It's three o'clock.", o: ["What time", "How", "When time"], a: 0, e: "询问钟点的固定表达 What time is it?" }
          ],
          speaking: [
            { t: "What time is it now?", tip: "What time 连读成 /wɒtaɪm/。" },
            { t: "It's half past eight.", tip: "half past + 数字表示“几点半”。" },
            { t: "See you tomorrow morning!", tip: "告别用语，语调上扬更友好。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "What time is the meeting?" },
              { w: "B", t: "It's at ten o'clock." },
              { w: "A", t: "Today?" },
              { w: "B", t: "No, tomorrow morning. Friday." },
              { w: "A", t: "OK, see you then!" }
            ],
            qs: [
              { q: "What time is the meeting?", o: ["9 o'clock", "10 o'clock", "3 o'clock"], a: 1 },
              { q: "When is the meeting?", o: ["Today", "Friday morning", "Friday night"], a: 1 },
              { q: "They will meet again tomorrow.", o: ["True", "False", "Not said"], a: 0 }
            ]
          }
        },
        {
          id: "en-l3", icon: "👨‍👩‍👧", title: "Family 家庭与日常",
          desc: "介绍家庭成员，描述日常生活",
          vocab: [
            { w: "family", p: "/ˈfæməli/", t: "家庭" },
            { w: "parents", p: "/ˈpeərənts/", t: "父母" },
            { w: "brother", p: "/ˈbrʌðər/", t: "兄弟" },
            { w: "sister", p: "/ˈsɪstər/", t: "姐妹" },
            { w: "breakfast", p: "/ˈbrekfəst/", t: "早餐" },
            { w: "work", p: "/wɜːrk/", t: "工作" }
          ],
          grammar: [
            { q: "He ___ breakfast at 7.", o: ["have", "has", "having"], a: 1, e: "第三人称单数 He，动词加 -s：has。" },
            { q: "They ___ TV in the evening.", o: ["watches", "watch", "watching"], a: 1, e: "复数主语 They 后用动词原形。" },
            { q: "My sister ___ like coffee.", o: ["don't", "doesn't", "isn't"], a: 1, e: "第三人称单数否定用 doesn't + 动词原形。" }
          ],
          speaking: [
            { t: "I usually have breakfast with my family.", tip: "usually 表示通常，放在实义动词前。" },
            { t: "My brother works in a hospital.", tip: "works 的 /s/ 音要清晰。" },
            { t: "What do you do on weekends?", tip: "询问对方周末活动。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "What does your family do on weekends?" },
              { w: "B", t: "We often go to the park." },
              { w: "A", t: "Sounds fun! Does your sister come too?" },
              { w: "B", t: "Yes, and my parents love it." }
            ],
            qs: [
              { q: "Where do they go on weekends?", o: ["The cinema", "The park", "The hospital"], a: 1 },
              { q: "Who comes along?", o: ["Only the sister", "Only parents", "The whole family"], a: 2 },
              { q: "The parents like the activity.", o: ["True", "False", "Not said"], a: 0 }
            ]
          }
        }
      ]
    },
    {
      id: "en-i", name: "中级 Intermediate", sub: "CEFR B1-B2 · 流利表达", color: "#3A6FE0",
      lessons: [
        {
          id: "en-l4", icon: "✈️", title: "Travel 旅行与问路",
          desc: "值机入住、问路指路与购物沟通",
          vocab: [
            { w: "reservation", p: "/ˌrezərˈveɪʃən/", t: "预订" },
            { w: "luggage", p: "/ˈlʌɡɪdʒ/", t: "行李（不可数）" },
            { w: "boarding pass", p: "/ˈbɔːrdɪŋ pæs/", t: "登机牌" },
            { w: "direction", p: "/dɪˈrekʃən/", t: "方向" },
            { w: "transfer", p: "/trænsˈfɜːr/", t: "换乘" },
            { w: "souvenir", p: "/ˌsuːvəˈnɪər/", t: "纪念品" }
          ],
          grammar: [
            { q: "If it rains, we ___ indoors.", o: ["stay", "will stay", "would stay"], a: 1, e: "第一条件句：If + 一般现在时，主句用 will + 动词原形。" },
            { q: "I've ___ my passport.", o: ["lose", "lost", "losing"], a: 1, e: "现在完成时 have/has + 过去分词，lose → lost。" },
            { q: "The hotel is ___ than the hostel.", o: ["expensive", "more expensive", "most expensive"], a: 1, e: "多音节形容词比较级用 more 开头。" }
          ],
          speaking: [
            { t: "Could you tell me how to get to the museum?", tip: "比 Where is 更礼貌的问路方式。" },
            { t: "I'd like to check in, please. I have a reservation.", tip: "I'd like to 比 I want 更客气。" },
            { t: "How much does a ticket cost?", tip: "询问价格的常用句。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "Excuse me, where is gate 12?" },
              { w: "B", t: "Go straight and turn left after the café." },
              { w: "A", t: "Is it far?" },
              { w: "B", t: "About five minutes. You can't miss it." }
            ],
            qs: [
              { q: "What is the person looking for?", o: ["Gate 2", "Gate 12", "A café"], a: 1 },
              { q: "When should they turn left?", o: ["After the café", "Before the café", "At the café"], a: 0 },
              { q: "How far is it?", o: ["2 minutes", "5 minutes", "12 minutes"], a: 1 }
            ]
          }
        },
        {
          id: "en-l5", icon: "💼", title: "Work 职场沟通",
          desc: "会议安排、任务汇报与商务表达",
          vocab: [
            { w: "meeting", p: "/ˈmiːtɪŋ/", t: "会议" },
            { w: "deadline", p: "/ˈdedlaɪn/", t: "截止日期" },
            { w: "colleague", p: "/ˈkɒliːɡ/", t: "同事" },
            { w: "responsible", p: "/rɪˈspɒnsəbl/", t: "负责的" },
            { w: "promote", p: "/prəˈmoʊt/", t: "晋升；推广" },
            { w: "schedule", p: "/ˈʃedjuːl/", t: "日程安排" }
          ],
          grammar: [
            { q: "The report ___ by Tom yesterday.", o: ["wrote", "was written", "writes"], a: 1, e: "被动语态 be + 过去分词；yesterday 用过去时 was written。" },
            { q: "I'm looking forward to ___ from you.", o: ["hear", "hearing", "heard"], a: 1, e: "look forward to 中的 to 是介词，后接动名词。" },
            { q: "She asked me ___ late.", o: ["not to be", "don't be", "not be"], a: 0, e: "ask sb. not to do sth. 要求某人不要做某事。" }
          ],
          speaking: [
            { t: "I'm responsible for the marketing schedule.", tip: "be responsible for 负责……" },
            { t: "Could we reschedule the meeting to Friday?", tip: "用 Could we 提出请求，语气委婉。" },
            { t: "I've been working here since 2020.", tip: "现在完成进行时常与 since 连用。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "Did you finish the report?" },
              { w: "B", t: "Almost. I'll send it before the deadline." },
              { w: "A", t: "Great. The meeting with the client is at two." },
              { w: "B", t: "No problem, I'll be ready." }
            ],
            qs: [
              { q: "What will the person send?", o: ["A schedule", "The report", "An email"], a: 1 },
              { q: "When will it be sent?", o: ["After the meeting", "Before the deadline", "On Friday"], a: 1 },
              { q: "What time is the client meeting?", o: ["10 o'clock", "12 o'clock", "2 o'clock"], a: 2 }
            ]
          }
        },
        {
          id: "en-l6", icon: "💭", title: "Opinions 观点表达",
          desc: "表达赞同反对，进行有理有据的讨论",
          vocab: [
            { w: "agree", p: "/əˈɡriː/", t: "同意" },
            { w: "disagree", p: "/ˌdɪsəˈɡriː/", t: "不同意" },
            { w: "opinion", p: "/əˈpɪnjən/", t: "观点" },
            { w: "however", p: "/haʊˈevər/", t: "然而" },
            { w: "evidence", p: "/ˈevɪdəns/", t: "证据" },
            { w: "persuade", p: "/pərˈsweɪd/", t: "说服" }
          ],
          grammar: [
            { q: "In my ___, remote work is better.", o: ["thought", "opinion", "idea"], a: 1, e: "固定搭配 in my opinion 在我看来。" },
            { q: "___ the rain, the event continued.", o: ["Although", "Despite", "However"], a: 1, e: "Despite 后接名词/名词短语；Although 后接从句。" },
            { q: "I strongly believe ___ we should act now.", o: ["that", "what", "which"], a: 0, e: "that 引导宾语从句，口语中常省略。" }
          ],
          speaking: [
            { t: "In my opinion, learning languages opens many doors.", tip: "提出观点的开场句，语速可稍慢以示强调。" },
            { t: "I see your point, but I disagree.", tip: "先肯定再转折，礼貌地反驳。" },
            { t: "On the other hand, it might be risky.", tip: "on the other hand 用于引出另一面。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "I think online learning is more effective." },
              { w: "B", t: "I'm not sure. Students can easily get distracted." },
              { w: "A", t: "However, recorded lessons let them review anytime." },
              { w: "B", t: "That's a fair point." }
            ],
            qs: [
              { q: "What is speaker A's opinion?", o: ["Online learning is more effective", "Classroom learning is better", "Students are distracted"], a: 0 },
              { q: "What is B concerned about?", o: ["High cost", "Distraction", "Short lessons"], a: 1 },
              { q: "What is A's counter-argument?", o: ["Lessons are cheaper", "Students can review anytime", "Teachers are better"], a: 1 }
            ]
          }
        }
      ]
    },
    {
      id: "en-a", name: "高级 Advanced", sub: "CEFR C1 · 学术与思辨", color: "#2B54B8",
      lessons: [
        {
          id: "en-l7", icon: "📰", title: "News 新闻与时事",
          desc: "听懂新闻播报，辨析事实与立场",
          vocab: [
            { w: "headline", p: "/ˈhedlaɪn/", t: "头条新闻" },
            { w: "investigation", p: "/ɪnˌvestɪˈɡeɪʃən/", t: "调查" },
            { w: "controversy", p: "/ˈkɒntrəvɜːrsi/", t: "争议" },
            { w: "reliable", p: "/rɪˈlaɪəbl/", t: "可靠的" },
            { w: "bias", p: "/ˈbaɪəs/", t: "偏见；偏向" },
            { w: "breakthrough", p: "/ˈbreɪkθruː/", t: "重大突破" }
          ],
          grammar: [
            { q: "The minister is said ___ yesterday.", o: ["to resign", "to have resigned", "resigning"], a: 1, e: "不定式的完成式 to have done 表示动作已发生。" },
            { q: "Rarely ___ such a detailed report.", o: ["I read", "have I read", "I have read"], a: 1, e: "否定副词 Rarely 置句首，句子部分倒装。" },
            { q: "The data ___ that the policy worked.", o: ["suggest", "suggests", "suggesting"], a: 1, e: "data 作整体看待时谓语可用单数。" }
          ],
          speaking: [
            { t: "According to the latest report, inflation has slowed down.", tip: "According to... 是引用信息的常用开头。" },
            { t: "The investigation raised serious concerns about data privacy.", tip: "raise concerns about 引发对……的担忧。" },
            { t: "It's important to distinguish facts from opinions.", tip: "distinguish A from B 区分 A 与 B。" }
          ],
          listening: {
            lines: [
              { w: "📢", t: "Scientists announced a breakthrough in battery technology today." },
              { w: "📢", t: "The new design charges in minutes, though experts say mass production remains years away." },
              { w: "📢", t: "Investors, however, pushed energy stocks sharply higher." }
            ],
            qs: [
              { q: "What was announced?", o: ["A new phone", "A battery technology breakthrough", "A stock market crash"], a: 1 },
              { q: "What limitation do experts mention?", o: ["High price", "Mass production is years away", "Short battery life"], a: 1 },
              { q: "How did the market react?", o: ["Energy stocks rose", "Energy stocks fell", "No reaction"], a: 0 }
            ]
          }
        },
        {
          id: "en-l8", icon: "🎓", title: "Academic 学术表达",
          desc: "掌握讲座语言与论文式表达",
          vocab: [
            { w: "hypothesis", p: "/haɪˈpɒθəsɪs/", t: "假设" },
            { w: "analysis", p: "/əˈnæləsɪs/", t: "分析" },
            { w: "furthermore", p: "/ˌfɜːrðərˈmɔːr/", t: "此外" },
            { w: "conclude", p: "/kənˈkluːd/", t: "得出结论" },
            { w: "peer-reviewed", p: "/pɪər rɪˈvjuːd/", t: "同行评审的" },
            { w: "methodology", p: "/ˌmeθəˈdɒlədʒi/", t: "方法论" }
          ],
          grammar: [
            { q: "The results are consistent ___ earlier studies.", o: ["with", "to", "at"], a: 0, e: "固定搭配 be consistent with 与……一致。" },
            { q: "___ the sample was small, the trend was clear.", o: ["Despite", "Although", "However"], a: 1, e: "Although 引导让步状语从句，后接完整句子。" },
            { q: "Further research ___ to confirm these findings.", o: ["needs", "is needed", "need"], a: 1, e: "research 与 need 是被动关系，用被动语态。" }
          ],
          speaking: [
            { t: "This study examines the relationship between sleep and memory.", tip: "examine the relationship between... 研究……之间的关系。" },
            { t: "Furthermore, the analysis reveals a strong correlation.", tip: "furthermore 用于补充论点。" },
            { t: "In conclusion, more research is needed.", tip: "结论段的标准开头。" }
          ],
          listening: {
            lines: [
              { w: "👨‍🏫", t: "Today we'll examine how cities adapt to climate change." },
              { w: "👨‍🏫", t: "Our analysis of twenty coastal cities suggests that green infrastructure reduces flooding." },
              { w: "👨‍🏫", t: "However, funding remains the main obstacle, as Professor Lin's previous study also concluded." }
            ],
            qs: [
              { q: "What is the lecture about?", o: ["Ocean pollution", "Cities adapting to climate change", "Professor Lin's life"], a: 1 },
              { q: "What helps reduce flooding according to the analysis?", o: ["Higher walls", "Green infrastructure", "Fewer cities"], a: 1 },
              { q: "What is the main obstacle?", o: ["Technology", "Funding", "Weather"], a: 1 }
            ]
          }
        },
        {
          id: "en-l9", icon: "🌏", title: "Culture 文化与习语",
          desc: "理解文化习俗与地道习语",
          vocab: [
            { w: "custom", p: "/ˈkʌstəm/", t: "习俗" },
            { w: "etiquette", p: "/ˈetɪket/", t: "礼仪" },
            { w: "idiom", p: "/ˈɪdiəm/", t: "习语；惯用语" },
            { w: "literally", p: "/ˈlɪtərəli/", t: "字面上地" },
            { w: "adapt", p: "/əˈdæpt/", t: "适应" },
            { w: "diverse", p: "/daɪˈvɜːrs/", t: "多元的" }
          ],
          grammar: [
            { q: "It took me a while to get ___ to the accent.", o: ["used", "use", "using"], a: 0, e: "get used to + 名词/动名词，表示“习惯于……”。" },
            { q: "___ living abroad for years, he still misses home.", o: ["Despite", "Although", "However"], a: 0, e: "Despite + 动名词，表示“尽管……”。" },
            { q: "I can't put ___ with the noise anymore.", o: ["up", "out", "on"], a: 0, e: "put up with 是固定短语，意为“忍受”。" }
          ],
          speaking: [
            { t: "When in Rome, do as the Romans do.", tip: "入乡随俗，注意 Rome 与 Romans 的节奏。" },
            { t: "Learning etiquette helps you adapt to diverse cultures.", tip: "adapt to 适应……" },
            { t: "I literally had no idea what he meant.", tip: "literally 在口语中常表强调。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "How's life in Seoul?" },
              { w: "B", t: "Great, but some customs took time to learn." },
              { w: "A", t: "For example?" },
              { w: "B", t: "Like using both hands when receiving a drink. It shows respect." },
              { w: "A", t: "That's fascinating — when in Rome, right?" }
            ],
            qs: [
              { q: "Where does B live?", o: ["Tokyo", "Seoul", "Rome"], a: 1 },
              { q: "What custom is mentioned?", o: ["Bowing when greeting", "Using both hands to receive a drink", "Removing shoes"], a: 1 },
              { q: "What does the custom show?", o: ["Courage", "Respect", "Wealth"], a: 1 }
            ]
          }
        }
      ]
    }
  ]
};

/* ---------- 日语 Japanese ---------- */
const JA = {
  id: "ja", name: "日语", native: "日本語", flag: "🇯🇵", speech: "ja-JP",
  levels: [
    {
      id: "ja-b", name: "入門 しょきゅう", sub: "JLPT N5-N4 · 生活会话", color: "#FF6B81",
      lessons: [
        {
          id: "ja-l1", icon: "🌸", title: "あいさつ 问候与自我介绍",
          desc: "打招呼、初次见面与礼貌表达",
          vocab: [
            { w: "こんにちは", p: "konnichiwa", t: "你好（白天）" },
            { w: "おはよう", p: "ohayō", t: "早上好" },
            { w: "ありがとう", p: "arigatō", t: "谢谢" },
            { w: "すみません", p: "sumimasen", t: "对不起 / 不好意思" },
            { w: "はじめまして", p: "hajimemashite", t: "初次见面" },
            { w: "さようなら", p: "sayōnara", t: "再见" }
          ],
          grammar: [
            { q: "はじめまして、＿＿＿タナカです。", o: ["わたしは", "あなたは", "かれは"], a: 0, e: "わたしは“我是……”，自我介绍时使用。" },
            { q: "ありがとう＿＿＿。", o: ["ございます", "ください", "います"], a: 0, e: "ありがとうございます 是礼貌的“谢谢”。" },
            { q: "おはよう＿＿＿！", o: ["ございます", "です", "ます"], a: 0, e: "おはようございます 是对长辈、同事的礼貌说法。" }
          ],
          speaking: [
            { t: "はじめまして、リーです。よろしくお願いします。", tip: "初次见面的标准自我介绍。" },
            { t: "すみません、駅はどこですか。", tip: "问路前先说 すみません。" },
            { t: "ありがとうございます！", tip: "ます 的结尾语气上扬，显得更真诚。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "すみません、田中さんですか。" },
              { w: "B", t: "はい、田中です。" },
              { w: "A", t: "はじめまして、キムです。" },
              { w: "B", t: "はじめまして、よろしくお願いします。" }
            ],
            qs: [
              { q: "話している二人の関係は？", o: ["兄弟", "初対面の二人", "昔からの友達"], a: 1 },
              { q: "B の名前は何ですか？", o: ["キム", "田中", "リー"], a: 1 },
              { q: "二人は何と言って挨拶しましたか？", o: ["さようなら", "はじめまして", "おやすみ"], a: 1 }
            ]
          }
        },
        {
          id: "ja-l2", icon: "🕒", title: "数字と時間 数字与时间",
          desc: "表达时间、星期与日常安排",
          vocab: [
            { w: "いち", p: "ichi", t: "一" },
            { w: "じゅう", p: "jū", t: "十" },
            { w: "まいにち", p: "mainichi", t: "每天" },
            { w: "あした", p: "ashita", t: "明天" },
            { w: "けさ", p: "kesa", t: "今天早上" },
            { w: "しゅうまつ", p: "shūmatsu", t: "周末" }
          ],
          grammar: [
            { q: "会議は9時＿＿＿始まります。", o: ["に", "で", "を"], a: 0, e: "具体的な時間の後には助詞「に」を使います。" },
            { q: "わたしは学生＿＿＿。", o: ["です", "ます", "ください"], a: 0, e: "名詞＋です で「是……」という意味になります。" },
            { q: "日曜日＿＿＿友達と会います。", o: ["に", "を", "が"], a: 0, e: "曜日の後にも「に」を使います。" }
          ],
          speaking: [
            { t: "今、何時ですか。", tip: "询问时间的固定说法。" },
            { t: "8時半です。", tip: "半（はん）表示“半点”。" },
            { t: "またあした！", tip: "熟人之间轻松的“明天见”。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "今何時？" },
              { w: "B", t: "3時だよ。" },
              { w: "A", t: "えっ、試験は4時からだよ。" },
              { w: "B", t: "大丈夫、まだ時間がある。" }
            ],
            qs: [
              { q: "今は何時ですか？", o: ["3時", "4時", "9時"], a: 0 },
              { q: "試験は何時からですか？", o: ["3時", "4時", "8時半"], a: 1 },
              { q: "B は慌てていますか？", o: ["はい、とても", "いいえ、落ち着いている", "何も言っていない"], a: 1 }
            ]
          }
        },
        {
          id: "ja-l3", icon: "🏠", title: "家族 家庭与生活",
          desc: "介绍家人，谈论家庭生活",
          vocab: [
            { w: "かぞく", p: "kazoku", t: "家人；家族" },
            { w: "りょうしん", p: "ryōshin", t: "父母" },
            { w: "あに", p: "ani", t: "（自己的）哥哥" },
            { w: "あね", p: "ane", t: "（自己的）姐姐" },
            { w: "ちち", p: "chichi", t: "（自己的）父亲" },
            { w: "はは", p: "haha", t: "（自己的）母亲" }
          ],
          grammar: [
            { q: "わたしは姉＿＿＿います。", o: ["が", "を", "に"], a: 0, e: "います/あります の前には「が」を使います。" },
            { q: "父は会社＿＿＿働いています。", o: ["で", "に", "を"], a: 0, e: "动作发生的场所用「で」。" },
            { q: "週末、家族＿＿＿映画を見ます。", o: ["と", "を", "が"], a: 0, e: "「と」表示“和……一起”。" }
          ],
          speaking: [
            { t: "わたしの家族は4人です。", tip: "～人（にん）是人数的量词。" },
            { t: "父は東京で働いています。", tip: "～ています 表示正在进行或持续的状态。" },
            { t: "週末は家族と過ごします。", tip: "過ごします（すごします）度过。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "田中さんは何人兄弟？" },
              { w: "B", t: "姉が一人います。" },
              { w: "A", t: "4人家族ですね。" },
              { w: "B", t: "はい、両親と姉とわたしです。" }
            ],
            qs: [
              { q: "田中さんの家族は何人ですか？", o: ["3人", "4人", "5人"], a: 1 },
              { q: "兄弟構成は？", o: ["姉が一人", "兄が一人", "一人っ子"], a: 0 },
              { q: "両親はいますか？", o: ["はい", "いいえ", "わからない"], a: 0 }
            ]
          }
        }
      ]
    },
    {
      id: "ja-i", name: "中級 ちゅうきゅう", sub: "JLPT N3-N2 · 场景运用", color: "#F04E68",
      lessons: [
        {
          id: "ja-l4", icon: "🗾", title: "旅行 旅行与问路",
          desc: "预订住宿、换乘与买纪念品",
          vocab: [
            { w: "よやく", p: "yoyaku", t: "预约" },
            { w: "にもつ", p: "nimotsu", t: "行李" },
            { w: "こうくうけん", p: "kōkūken", t: "机票" },
            { w: "みち", p: "michi", t: "道路" },
            { w: "のりかえる", p: "norikaeru", t: "换乘" },
            { w: "おみやげ", p: "omiyage", t: "土特产；礼物" }
          ],
          grammar: [
            { q: "ホテルに予約＿＿＿あります。", o: ["が", "を", "に"], a: 0, e: "あります の対象には「が」を使います。" },
            { q: "駅で電車＿＿＿乗り換えます。", o: ["に", "を", "で"], a: 0, e: "乗り換える 对象用「に」。" },
            { q: "京都へ＿＿＿ことがあります。", o: ["行った", "行く", "行って"], a: 0, e: "～たことがあります 表示曾经有过某种经历。" }
          ],
          speaking: [
            { t: "すみません、博物館までどう行きますか。", tip: "どう行きますか 询问“怎么走”。" },
            { t: "チェックインをお願いします。", tip: "酒店前台常用句。" },
            { t: "切符はいくらですか。", tip: "いくらですか 询问价格。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "すみません、12番ゲートはどこですか。" },
              { w: "B", t: "まっすぐ行って、カフェの左です。" },
              { w: "A", t: "遠いですか。" },
              { w: "B", t: "5分ぐらいですよ。" }
            ],
            qs: [
              { q: "A が探しているのは？", o: ["カフェ", "12番ゲート", "出口"], a: 1 },
              { q: "どう行きますか？", o: ["右に曲がる", "カフェの左", "まっすぐのみ"], a: 1 },
              { q: "どのぐらいかかりますか？", o: ["5分", "10分", "12分"], a: 0 }
            ]
          }
        },
        {
          id: "ja-l5", icon: "📊", title: "仕事 职场日语",
          desc: "会议、截止日期与工作汇报",
          vocab: [
            { w: "かいぎ", p: "kaigi", t: "会议" },
            { w: "しめきり", p: "shimekiri", t: "截止日期" },
            { w: "どうりょう", p: "dōryō", t: "同事" },
            { w: "せきにん", p: "sekinin", t: "责任" },
            { w: "しょうしん", p: "shōshin", t: "晋升" },
            { w: "よてい", p: "yotei", t: "预定；安排" }
          ],
          grammar: [
            { q: "レポートをもう＿＿＿。", o: ["書きました", "書きます", "書いて"], a: 0, e: "もう＋过去式 表示“已经……了”。" },
            { q: "あなたからの連絡を楽しみ＿＿＿います。", o: ["に", "で", "を"], a: 0, e: "楽しみにしています 表示“期待着”。" },
            { q: "明日は遅れ＿＿＿でください。", o: ["ない", "なく", "なかった"], a: 0, e: "～ないでください 表示“请不要……”。" }
          ],
          speaking: [
            { t: "わたしはマーケティングの予定を担当しています。", tip: "～を担当しています 负责……" },
            { t: "会議を金曜日に変更できますか。", tip: "～を～に変更する 把……改到……" },
            { t: "2020年からここで働いています。", tip: "～から 表示“从……开始”。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "レポートは終わりましたか。" },
              { w: "B", t: "あと少しです。締め切り前に送ります。" },
              { w: "A", t: "よかった。客先との会議は2時です。" },
              { w: "B", t: "大丈夫です、準備します。" }
            ],
            qs: [
              { q: "B が送るものは？", o: ["予定表", "レポート", "お土産"], a: 1 },
              { q: "いつまでに送りますか？", o: ["締め切り前", "会議の後", "金曜日"], a: 0 },
              { q: "客先との会議は何時？", o: ["10時", "2時", "4時"], a: 1 }
            ]
          }
        },
        {
          id: "ja-l6", icon: "🗣️", title: "意見 表达观点",
          desc: "赞同、反对与有理有据地讨论",
          vocab: [
            { w: "さんせい", p: "sansei", t: "赞成" },
            { w: "はんたい", p: "hantai", t: "反对" },
            { w: "いけん", p: "iken", t: "意见" },
            { w: "しかし", p: "shikashi", t: "但是" },
            { w: "しょうこ", p: "shōko", t: "证据" },
            { w: "せっとく", p: "settoku", t: "说服" }
          ],
          grammar: [
            { q: "わたしの意見＿＿＿、リモートワークのほうがいい。", o: ["では", "とは", "には"], a: 0, e: "わたしの意見では “在我看来”。" },
            { q: "雨＿＿＿、試合は続いた。", o: ["のに", "でも", "しかし"], a: 0, e: "「のに」接在句后，表示“尽管……却……”。" },
            { q: "今行動する＿＿＿だと思います。", o: ["べき", "よう", "つもり"], a: 0, e: "动词原形＋べきだ 表示“应该……”。" }
          ],
          speaking: [
            { t: "わたしの意見では、言語学習は多くの扉を開きます。", tip: "开门见山表达观点。" },
            { t: "おっしゃることはわかりますが、反対です。", tip: "おっしゃる 是 言う 的尊敬语，礼貌反驳。" },
            { t: "一方で、リスクもあります。", tip: "一方で（いっぽうで）另一方面。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "オンライン学習のほうが効果的だと思います。" },
              { w: "B", t: "うーん、集中しにくいですよ。" },
              { w: "A", t: "でも、録画なら何度も復習できます。" },
              { w: "B", t: "それは確かにそうですね。" }
            ],
            qs: [
              { q: "A の意見は？", o: ["オンライン学習が効果的", "通学が効果的", "勉強は不要"], a: 0 },
              { q: "B の不安は？", o: ["料金が高い", "集中しにくい", "時間が長い"], a: 1 },
              { q: "A の反論は？", o: ["安いから", "何度も復習できる", "先生が優しい"], a: 1 }
            ]
          }
        }
      ]
    },
    {
      id: "ja-a", name: "上級 じょうきゅう", sub: "JLPT N1 · 新闻与敬语", color: "#D63350",
      lessons: [
        {
          id: "ja-l7", icon: "📺", title: "ニュース 新闻听解",
          desc: "听懂新闻播报，辨析事实与立场",
          vocab: [
            { w: "きじ", p: "kiji", t: "报道；文章" },
            { w: "ちょうさ", p: "chōsa", t: "调查" },
            { w: "ぎろん", p: "giron", t: "讨论；争论" },
            { w: "しんらい", p: "shinrai", t: "信赖" },
            { w: "バイアス", p: "baiasu", t: "偏见；偏向" },
            { w: "せいか", p: "seika", t: "成果" }
          ],
          grammar: [
            { q: "大臣は昨日辞任した＿＿＿。", o: ["そうだ", "べきだ", "つもりだ"], a: 0, e: "「～たそうだ」表示传闻：“听说……了”。" },
            { q: "これほど詳しい報告はめったに＿＿＿。", o: ["ない", "ある", "です"], a: 0, e: "めったに～ない 表示“很少……”。" },
            { q: "データは政策の効果を＿＿＿いる。", o: ["示して", "示そう", "示せ"], a: 0, e: "～ている 表示正在呈现的状态。" }
          ],
          speaking: [
            { t: "最新の報道によると、インフレが落ち着いてきました。", tip: "～によると 表示“据……”。" },
            { t: "この調査はデータプライバシーへの懸念を引き起こしました。", tip: "懸念を引き起こす 引发担忧。" },
            { t: "事実と意見を区別することが重要です。", tip: "～を区別する 区分……" }
          ],
          listening: {
            lines: [
              { w: "📢", t: "科学者たちは本日、電池技術の新たな成果を発表しました。" },
              { w: "📢", t: "数分で充電できますが、専門家は量産にはまだ時間がかかると指摘しています。" },
              { w: "📢", t: "一方、投資家の反応でエネルギー株が急騰しました。" }
            ],
            qs: [
              { q: "発表された成果は？", o: ["新しい電話", "電池技術の成果", "株の暴落"], a: 1 },
              { q: "専門家が指摘した課題は？", o: ["価格が高い", "量産に時間がかかる", "寿命が短い"], a: 1 },
              { q: "市場の反応は？", o: ["エネルギー株が上がった", "下がった", "変化なし"], a: 0 }
            ]
          }
        },
        {
          id: "ja-l8", icon: "🤝", title: "敬語 商务敬语",
          desc: "掌握尊敬语、谦让语与商务电话",
          vocab: [
            { w: "けんとう", p: "kentō", t: "研究；考虑" },
            { w: "れんらく", p: "renraku", t: "联系" },
            { w: "さんか", p: "sanka", t: "参加" },
            { w: "てはい", p: "tehai", t: "安排；筹备" },
            { w: "りょうしょう", p: "ryōshō", t: "知晓；谅解" },
            { w: "ごえんりょ", p: "goenryo", t: "客气；婉拒" }
          ],
          grammar: [
            { q: "資料をご確認＿＿＿。", o: ["ください", "します", "なさい"], a: 0, e: "ご確認ください “请确认”，礼貌的请求。" },
            { q: "明日、ご連絡＿＿＿。", o: ["いたします", "します", "される"], a: 0, e: "いたします 是 します 的谦让语。" },
            { q: "ご都合の＿＿＿日をお知らせください。", o: ["よろしい", "いい", "べんり"], a: 0, e: "ご都合がよろしい日 “您方便的日子”，商务常用。" }
          ],
          speaking: [
            { t: "ご多用のところ恐れ入りますが、ご確認をお願いいたします。", tip: "邮件开头的经典客套句。" },
            { t: "明日の正午までにご連絡いたします。", tip: "～までに 在……之前。" },
            { t: "それでは、よろしくお願いいたします。", tip: "商务场合结束对话的标准表达。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "お世話になっております。田中商事のキムです。" },
              { w: "B", t: "ご無沙汰しております。" },
              { w: "A", t: "明日のお打ち合わせ、14時でよろしかったでしょうか。" },
              { w: "B", t: "はい、承知いたしました。お待ちしております。" }
            ],
            qs: [
              { q: "電話をかけたのは誰？", o: ["田中商事のキム", "B", "大臣"], a: 0 },
              { q: "打ち合わせはいつ？", o: ["今日の14時", "明日の14時", "明日の正午"], a: 1 },
              { q: "B はどう返事しましたか？", o: ["断った", "承知した", "何も言わなかった"], a: 1 }
            ]
          }
        },
        {
          id: "ja-l9", icon: "🏯", title: "文化と慣用句 文化与惯用语",
          desc: "理解日式思维与高频惯用语",
          vocab: [
            { w: "しきたり", p: "shikitari", t: "惯例；老规矩" },
            { w: "エチケット", p: "echiketto", t: "礼仪" },
            { w: "かんようく", p: "kan'yōku", t: "惯用语" },
            { w: "もじどおり", p: "mojidōri", t: "字面那样" },
            { w: "てきおう", p: "tekiō", t: "适应" },
            { w: "たようせい", p: "tayōsei", t: "多样性" }
          ],
          grammar: [
            { q: "アクセントに慣れる＿＿＿時間がかかりました。", o: ["のに", "で", "を"], a: 0, e: "动词原形＋のに 表示“为了/要……（花时间）”。" },
            { q: "何年も海外に住んでいる＿＿＿、彼はまだ故郷が恋しい。", o: ["のに", "でも", "しかし"], a: 0, e: "～ているのに “尽管……却……”。" },
            { q: "騒音にはもう我慢＿＿＿。", o: ["できない", "する", "した"], a: 0, e: "我慢できない “无法忍受”。" }
          ],
          speaking: [
            { t: "郷に入っては郷に従え。", tip: "日本版“入乡随俗”。" },
            { t: "エチケットを学ぶと、多様な文化に適応できます。", tip: "～に適応する 适应……" },
            { t: "文字通り、彼の言っている意味が分かりませんでした。", tip: "文字通り（もじどおり）字面上。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "ソウル生活はどう？" },
              { w: "B", t: "楽しいけど、習慣を覚えるのに時間がかかったよ。" },
              { w: "A", t: "例えば？" },
              { w: "B", t: "お酒を受け取るときは両手を使うんだ。敬意を示すためにね。" },
              { w: "A", t: "へえ、郷に入れば郷に従えだね。" }
            ],
            qs: [
              { q: "B はどこに住んでいますか？", o: ["東京", "ソウル", "北京"], a: 1 },
              { q: "どんな習慣ですか？", o: ["お辞儀をする", "両手で受け取る", "靴を脱ぐ"], a: 1 },
              { q: "その習慣は何を示しますか？", o: ["勇気", "敬意", "富"], a: 1 }
            ]
          }
        }
      ]
    }
  ]
};

/* ---------- 韩语 Korean ---------- */
const KO = {
  id: "ko", name: "韩语", native: "한국어", flag: "🇰🇷", speech: "ko-KR",
  levels: [
    {
      id: "ko-b", name: "초급 初级", sub: "TOPIK 1-2 · 生活会话", color: "#2EA44F",
      lessons: [
        {
          id: "ko-l1", icon: "💚", title: "인사말 问候与介绍",
          desc: "打招呼、初次见面与礼貌用语",
          vocab: [
            { w: "안녕하세요", p: "annyeonghaseyo", t: "你好" },
            { w: "안녕히 가세요", p: "annyeonghi gaseyo", t: "再见（对离开的人）" },
            { w: "감사합니다", p: "gamsahamnida", t: "谢谢" },
            { w: "죄송합니다", p: "joesonghamnida", t: "抱歉；对不起" },
            { w: "처음 뵙겠습니다", p: "cheoeum boepgetseumnida", t: "初次见面" },
            { w: "실례합니다", p: "sillyehamnida", t: "失礼了；打扰一下" }
          ],
          grammar: [
            { q: "안녕하세요, 저＿＿＿ 이민호입니다.", o: ["는", "은", "가"], a: 0, e: "저는 “我是”，저 后接 는。" },
            { q: "도와주셔서 감사＿＿＿.", o: ["합니다", "입니다", "습니다"], a: 0, e: "감사합니다 “谢谢”。" },
            { q: "만나서 반＿＿＿.", o: ["갑습니다", "습니다", "합니다"], a: 0, e: "반갑습니다 “很高兴见到你”。" }
          ],
          speaking: [
            { t: "안녕하세요, 처음 뵙겠습니다.", tip: "最正式的初次见面问候。" },
            { t: "도와주셔서 정말 감사합니다.", tip: "感谢别人帮助时使用。" },
            { t: "실례합니다, 역이 어디예요?", tip: "问路前先用 실례합니다。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "안녕하세요! 저는 김지민이에요." },
              { w: "B", t: "안녕하세요, 저는 박준호입니다." },
              { w: "A", t: "새로 오신 학생이에요?" },
              { w: "B", t: "네, 만나서 반갑습니다." }
            ],
            qs: [
              { q: "새로 온 학생은 누구예요?", o: ["김지민", "박준호", "선생님"], a: 1 },
              { q: "여학생의 성은?", o: ["김", "박", "이"], a: 0 },
              { q: "두 사람은 처음 만났어요?", o: ["네", "아니요", "모르겠어요"], a: 0 }
            ]
          }
        },
        {
          id: "ko-l2", icon: "⏰", title: "숫자와 시간 数字与时间",
          desc: "询问时间，谈论日程安排",
          vocab: [
            { w: "하나", p: "hana", t: "一（固有词）" },
            { w: "열", p: "yeol", t: "十" },
            { w: "오늘", p: "oneul", t: "今天" },
            { w: "내일", p: "naeil", t: "明天" },
            { w: "아침", p: "achim", t: "早上" },
            { w: "주말", p: "jumal", t: "周末" }
          ],
          grammar: [
            { q: "회의는 9시＿＿＿ 시작해요.", o: ["에", "가", "을"], a: 0, e: "时间点后用助词 에。" },
            { q: "저는 학생＿＿＿.", o: ["이에요", "을", "에서"], a: 0, e: "名词 + 이에요/예요 表示“是……”。" },
            { q: "오늘 날씨＿＿＿ 좋아요.", o: ["가", "은", "를"], a: 0, e: "主语后用 이/가。" }
          ],
          speaking: [
            { t: "지금 몇 시예요?", tip: "询问时间的固定说法。" },
            { t: "여덟 시 반이에요.", tip: "반 表示“半点”。" },
            { t: "내일 아침에 봐요!", tip: "轻松的“明天早上见”。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "지금 몇 시야?" },
              { w: "B", t: "세 시야." },
              { w: "A", t: "시험이 네 시부터야!" },
              { w: "B", t: "괜찮아, 아직 시간 있어." }
            ],
            qs: [
              { q: "지금 몇 시예요?", o: ["세 시", "네 시", "아홉 시"], a: 0 },
              { q: "시험은 언제 시작해요?", o: ["세 시", "네 시", "여덟 시 반"], a: 1 },
              { q: "B의 반응은?", o: ["불안해한다", "침착하다", "화난다"], a: 1 }
            ]
          }
        },
        {
          id: "ko-l3", icon: "👪", title: "가족 家庭与家人",
          desc: "介绍家庭成员，谈论家庭生活",
          vocab: [
            { w: "가족", p: "gajok", t: "家人；家族" },
            { w: "부모님", p: "bumonim", t: "父母（敬称）" },
            { w: "형", p: "hyeong", t: "哥哥（男称）" },
            { w: "누나", p: "nuna", t: "姐姐（男称）" },
            { w: "여동생", p: "yeodongsaeng", t: "妹妹" },
            { w: "동생", p: "dongsaeng", t: "弟弟/妹妹" }
          ],
          grammar: [
            { q: "저는 누나＿＿＿ 한 명 있어요.", o: ["가", "이", "을"], a: 0, e: "있다/없다 前用 이/가。" },
            { q: "아버지는 회사＿＿＿ 일하세요.", o: ["에서", "에", "를"], a: 0, e: "动作发生的地点用 에서：회사에서 일하다 在公司工作。" },
            { q: "주말에 가족＿＿＿ 영화를 봐요.", o: ["과", "와", "아"], a: 0, e: "받침이 있는 명사 뒤用 과：가족과“和家人”。" }
          ],
          speaking: [
            { t: "우리 가족은 네 명이에요.", tip: "명 是人数量词。" },
            { t: "아버지는 서울에서 일하세요.", tip: "敬语动词 일하세요。" },
            { t: "주말에는 가족과 시간을 보내요.", tip: "시간을 보내다 度过时光。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "준호 씨는 형제가 몇이에요?" },
              { w: "B", t: "누나 한 명 있고요." },
              { w: "A", t: "네 식구네요." },
              { w: "B", t: "네, 부모님이랑 누나, 저 이렇게 넷이에요." }
            ],
            qs: [
              { q: "가족이 모두 몇 명이에요?", o: ["세 명", "네 명", "다섯 명"], a: 1 },
              { q: "형제관계는?", o: ["누나 한 명", "형 한 명", "외동"], a: 0 },
              { q: "부모님과 같이 살아요?", o: ["네", "아니요", "모르겠어요"], a: 0 }
            ]
          }
        }
      ]
    },
    {
      id: "ko-i", name: "중급 中级", sub: "TOPIK 3-4 · 场景运用", color: "#228B43",
      lessons: [
        {
          id: "ko-l4", icon: "🛫", title: "여행 旅行与问路",
          desc: "值机入住、交通换乘与购物",
          vocab: [
            { w: "예약", p: "yeyak", t: "预约" },
            { w: "짐", p: "jim", t: "行李" },
            { w: "탑승권", p: "tabseunggwon", t: "登机牌" },
            { w: "길", p: "gil", t: "路" },
            { w: "갈아타다", p: "garatada", t: "换乘" },
            { w: "기념품", p: "ginyeompum", t: "纪念品" }
          ],
          grammar: [
            { q: "호텔에 예약＿＿＿ 있어요.", o: ["이", "가", "을"], a: 0, e: "예약 有받침，后接 이：예약이 있다。" },
            { q: "역에서 지하철＿＿＿ 갈아타요.", o: ["로", "을", "와"], a: 0, e: "갈아타다 表“换成……”时后接 (으)로。" },
            { q: "교토에 ＿＿＿ 적이 있어요.", o: ["간", "가는", "가"], a: 0, e: "-ㄴ/은 적이 있다 表示“有过……经历”；가다 词干 가 接 ㄴ → 간 적이 있다。" }
          ],
          speaking: [
            { t: "실례합니다, 박물관에 어떻게 가요?", tip: "어떻게 가요? “怎么走？”" },
            { t: "체크인하고 싶은데요, 예약했어요.", tip: "酒店前台常用句。" },
            { t: "표가 얼마예요?", tip: "얼마예요? 询问价格。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "실례지만 12번 게이트가 어디예요?" },
              { w: "B", t: "쭉 가시다가 카페 왼쪽으로 가세요." },
              { w: "A", t: "멀어요?" },
              { w: "B", t: "오 분 정도 걸려요." }
            ],
            qs: [
              { q: "무엇을 찾고 있어요?", o: ["카페", "12번 게이트", "출구"], a: 1 },
              { q: "어떻게 가요?", o: ["오른쪽", "카페 왼쪽", "쭉 직진만"], a: 1 },
              { q: "얼마나 걸려요?", o: ["오 분", "십이 분", "십 분"], a: 0 }
            ]
          }
        },
        {
          id: "ko-l5", icon: "📑", title: "직장 职场韩语",
          desc: "会议安排、工作汇报与截止日期",
          vocab: [
            { w: "회의", p: "hoeui", t: "会议" },
            { w: "마감", p: "magam", t: "截止" },
            { w: "동료", p: "dongnyo", t: "同事" },
            { w: "책임", p: "chaegim", t: "责任" },
            { w: "승진", p: "seungjin", t: "晋升" },
            { w: "일정", p: "iljeong", t: "日程" }
          ],
          grammar: [
            { q: "보고서는 어제＿＿＿.", o: ["썼어요", "써요", "쓸 거예요"], a: 0, e: "어제 与过去式连用：쓰다→썼어요。" },
            { q: "연락을 기다리고 ＿＿＿.", o: ["있어요", "이에요", "해요"], a: 0, e: "-고 있다 表示正在进行：기다리고 있다。" },
            { q: "내일은 늦지 ＿＿＿ 하세요.", o: ["마", "말", "맙"], a: 0, e: "-지 마세요 “请不要……”：늦지 마세요。" }
          ],
          speaking: [
            { t: "저는 마케팅 일정을 담당하고 있어요.", tip: "～을/를 담당하다 负责……" },
            { t: "회의를 금요일로 바꿀 수 있을까요?", tip: "礼貌协商的语气。" },
            { t: "2020년부터 여기서 일했어요.", tip: "-부터 从……开始。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "보고서 다 했어요?" },
              { w: "B", t: "거의 다 했어요. 마감 전에 보낼게요." },
              { w: "A", t: "좋아요, 고객과 회의가 두 시예요." },
              { w: "B", t: "네, 준비할게요." }
            ],
            qs: [
              { q: "B가 보낼 것은?", o: ["일정표", "보고서", "기념품"], a: 1 },
              { q: "언제 보내요?", o: ["마감 전", "회의 후", "금요일"], a: 0 },
              { q: "고객과의 회의는 몇 시?", o: ["열 시", "두 시", "네 시"], a: 1 }
            ]
          }
        },
        {
          id: "ko-l6", icon: "🗨️", title: "의견 表达观点",
          desc: "赞同、反对与有逻辑地讨论",
          vocab: [
            { w: "찬성", p: "chanseong", t: "赞成" },
            { w: "반대", p: "bandae", t: "反对" },
            { w: "의견", p: "uigyeon", t: "意见" },
            { w: "하지만", p: "hajiman", t: "但是" },
            { w: "증거", p: "geunggeo", t: "证据" },
            { w: "설득", p: "seoldeuk", t: "说服" }
          ],
          grammar: [
            { q: "제 생각＿＿＿ 재택근무가 더 좋아요.", o: ["에는", "으로", "에서"], a: 0, e: "생각에는 “在我看来”。" },
            { q: "비＿＿＿ 왔지만 경기는 계속됐어요.", o: ["가", "이", "은"], a: 0, e: "비 无받침，主语助词用 가。" },
            { q: "지금 행동해야 ＿＿＿고 생각해요.", o: ["한다", "한", "했던"], a: 0, e: "-ㄴ/는다고 생각하다 “认为要……”：해야 한다고 생각해요。" }
          ],
          speaking: [
            { t: "제 생각에는 언어 학습이 많은 문을 열어 줘요.", tip: "提出观点的开场。" },
            { t: "말씀은 이해하지만 반대예요.", tip: "先认同再礼貌反对。" },
            { t: "다른 한편으로는 위험도 있어요.", tip: "다른 한편으로 另一方面。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "온라인 학습이 더 효과적이라고 생각해요." },
              { w: "B", t: "글쎄요, 집중하기 쉽지 않은데요." },
              { w: "A", t: "하지만 녹화된 수업은 언제든 복습할 수 있죠." },
              { w: "B", t: "그건 맞네요." }
            ],
            qs: [
              { q: "A의 의견은?", o: ["온라인 학습이 효과적", "오프라인이 더 좋다", "공부가 필요 없다"], a: 0 },
              { q: "B의 걱정은?", o: ["비용", "집중", "시간"], a: 1 },
              { q: "A의 반론은?", o: ["싸다", "복습할 수 있다", "선생님이 좋다"], a: 1 }
            ]
          }
        }
      ]
    },
    {
      id: "ko-a", name: "고급 高级", sub: "TOPIK 5-6 · 新闻与商务", color: "#176B34",
      lessons: [
        {
          id: "ko-l7", icon: "📻", title: "뉴스 新闻听解",
          desc: "听懂新闻报道，辨析事实与偏向",
          vocab: [
            { w: "기사", p: "gisa", t: "新闻报道" },
            { w: "조사", p: "josa", t: "调查" },
            { w: "논란", p: "nonnan", t: "争议" },
            { w: "신뢰", p: "silloe", t: "信赖" },
            { w: "편향", p: "pyeonhyang", t: "偏向" },
            { w: "성과", p: "seonggwa", t: "成果" }
          ],
          grammar: [
            { q: "장관은 어제 사임했다＿＿＿ 합니다.", o: ["고", "은", "를"], a: 0, e: "-ㄴ/는다고 하다 间接引语：“听说……”。" },
            { q: "이렇게 자세한 보고서는 거의 ＿＿＿.", o: ["없어요", "있어요", "해요"], a: 0, e: "거의 없다 “几乎没有”。" },
            { q: "데이터가 정책의 효과를 ＿＿＿ 있다.", o: ["보여주고", "보여주자", "보여줘"], a: 0, e: "-고 있다 表示正在进行。" }
          ],
          speaking: [
            { t: "최근 보도에 따르면 물가 상승이 둔화됐습니다.", tip: "-에 따르면 据……" },
            { t: "이 조사는 데이터 프라이버시에 대한 심각한 우려를 제기했습니다.", tip: "우려를 제기하다 提出担忧。" },
            { t: "사실과 의견을 구분하는 것이 중요합니다.", tip: "～을/를 구분하다 区分……" }
          ],
          listening: {
            lines: [
              { w: "📢", t: "과학자들이 오늘 배터리 기술의 새로운 성과를 발표했습니다." },
              { w: "📢", t: "몇 분 만에 충전되지만, 전문가들은 대량 생산까지는 몇 년이 걸릴 것이라고 말합니다." },
              { w: "📢", t: "한편 에너지 관련 주가는 크게 올랐습니다." }
            ],
            qs: [
              { q: "발표된 성과는?", o: ["새 휴대폰", "배터리 기술", "주가 폭락"], a: 1 },
              { q: "전문가들이 지적한 한계는?", o: ["비싼 가격", "대량 생산까지의 시간", "짧은 수명"], a: 1 },
              { q: "시장의 반응은?", o: ["에너지 주가 상승", "에너지 주가 하락", "반응 없음"], a: 0 }
            ]
          }
        },
        {
          id: "ko-l8", icon: "📞", title: "비즈니스 존댓말 商务敬语",
          desc: "掌握正式场合与商务电话表达",
          vocab: [
            { w: "검토", p: "geomto", t: "研讨；考虑" },
            { w: "연락", p: "yeollak", t: "联系" },
            { w: "참석", p: "chamsseok", t: "出席" },
            { w: "준비", p: "junbi", t: "准备" },
            { w: "양해", p: "yanghae", t: "谅解" },
            { w: "확인", p: "hwagin", t: "确认" }
          ],
          grammar: [
            { q: "자료를 확인해 ＿＿＿.", o: ["주시겠어요", "줘", "해요"], a: 0, e: "-아/어 주시겠어요? 是最礼貌的请求表达。" },
            { q: "내일 연락＿＿＿.", o: ["드리겠습니다", "줄게요", "했어요"], a: 0, e: "드리다 是 주다 的谦语：연락드리다。" },
            { q: "편하신 시간＿＿＿ 알려 주세요.", o: ["을", "가", "은"], a: 0, e: "时间作宾语：시간을 알려 주세요。" }
          ],
          speaking: [
            { t: "바쁘신 중에 죄송합니다만, 확인 부탁드립니다.", tip: "请求帮忙前的客套。" },
            { t: "내일 정오까지 연락드리겠습니다.", tip: "-까지 在……之前。" },
            { t: "그럼 잘 부탁드리겠습니다.", tip: "结束对话的标准表达。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "안녕하세요, 김민수 대리입니다." },
              { w: "B", t: "네, 안녕하세요." },
              { w: "A", t: "내일 미팅, 오후 두 시 괜찮으신가요?" },
              { w: "B", t: "네, 확인했습니다. 그때 뵙겠습니다." }
            ],
            qs: [
              { q: "전화한 사람은?", o: ["김민수 대리", "B", "과학자"], a: 0 },
              { q: "약속 시간은?", o: ["오늘 두 시", "내일 오후 두 시", "내일 정오"], a: 1 },
              { q: "B의 반응은?", o: ["거절했다", "확인 후 동의했다", "아무 말도 안 했다"], a: 1 }
            ]
          }
        },
        {
          id: "ko-l9", icon: "🎎", title: "문화와 관용어 文化与惯用语",
          desc: "理解韩国文化与高频惯用语",
          vocab: [
            { w: "관습", p: "gwanseup", t: "习俗" },
            { w: "예의", p: "yeui", t: "礼貌；礼仪" },
            { w: "관용구", p: "gwan'yonggu", t: "惯用语" },
            { w: "그대로", p: "geudaero", t: "照原样" },
            { w: "적응하다", p: "jeogeunghada", t: "适应" },
            { w: "다양성", p: "dayangseong", t: "多样性" }
          ],
          grammar: [
            { q: "억양에 익숙해지는＿＿＿ 시간이 걸렸어요.", o: ["데", "가", "을"], a: 0, e: "-는 데 시간이 걸리다 “做……花时间”。" },
            { q: "몇 년을 해외에 살＿＿＿, 그는 아직 고향이 그리워요.", o: ["았는데", "지만", "고"], a: 0, e: "-았/었는데 表示背景转折：“尽管生活了几年，但……”。" },
            { q: "소음을 더 이상 참＿＿＿ 수 없어요.", o: ["을", "는", "이"], a: 0, e: "참을 수 없다 “无法忍受”，참다 后接 을。" }
          ],
          speaking: [
            { t: "로마에 가면 로마법을 따르라.", tip: "韩语版“入乡随俗”。" },
            { t: "예의를 배우면 다양한 문화에 적응할 수 있어요.", tip: "-에 적응하다 适应……" },
            { t: "그가 무슨 말인지 전혀 몰랐어요.", tip: "전혀 모르다 完全不知道。" }
          ],
          listening: {
            lines: [
              { w: "A", t: "서울 생활 어때?" },
              { w: "B", t: "좋아, 그런데 관습을 익히는 데 시간이 좀 걸렸어." },
              { w: "A", t: "예를 들면?" },
              { w: "B", t: "술을 받을 때 두 손을 쓰는 거야. 존중을 표시하는 거지." },
              { w: "A", t: "흥미롭다, 로마에 가면 로마법을 따르라더니." }
            ],
            qs: [
              { q: "B는 어디에서 살아요?", o: ["도쿄", "서울", "로마"], a: 1 },
              { q: "어떤 관습이 나왔어요?", o: ["인사할 때 인사하기", "두 손으로 받기", "신발 벗기"], a: 1 },
              { q: "그 관습은 무엇을 표시해요?", o: ["용기", "존중", "부"], a: 1 }
            ]
          }
        }
      ]
    }
  ]
};

/* ---------- 成就定义 ---------- */
const ACHIEVEMENTS = [
  { id: "first_step", icon: "🚀", name: "迈出第一步", desc: "完成第一节课程", cond: (s) => s.completedCount >= 1 },
  { id: "scholar_3", icon: "📖", name: "勤学不辍", desc: "完成 3 节课程", cond: (s) => s.completedCount >= 3 },
  { id: "scholar_9", icon: "🎓", name: "学霸认证", desc: "完成 9 节课程", cond: (s) => s.completedCount >= 9 },
  { id: "streak_3", icon: "🔥", name: "三日连学", desc: "连续学习 3 天", cond: (s) => s.streak >= 3 },
  { id: "streak_7", icon: "⚡", name: "七日坚持", desc: "连续学习 7 天", cond: (s) => s.streak >= 7 },
  { id: "streak_30", icon: "👑", name: "月度王者", desc: "连续学习 30 天", cond: (s) => s.streak >= 30 },
  { id: "words_20", icon: "🃏", name: "词汇新星", desc: "掌握 20 个单词", cond: (s) => s.masteredWords >= 20 },
  { id: "words_100", icon: "📚", name: "词汇达人", desc: "掌握 100 个单词", cond: (s) => s.masteredWords >= 100 },
  { id: "polyglot", icon: "🌍", name: "多语探索者", desc: "在 2 种以上语言中完成课程", cond: (s) => s.langsStudied.length >= 2 },
  { id: "speaker_10", icon: "🎤", name: "敢说出口", desc: "完成 10 次口语练习", cond: (s) => s.speakingCount >= 10 },
  { id: "listener_10", icon: "🎧", name: "洗耳恭听", desc: "完成 10 次听力练习", cond: (s) => s.listeningCount >= 10 },
  { id: "perfect_5", icon: "💯", name: "满分收割机", desc: "5 次语法练习全对", cond: (s) => s.perfectCount >= 5 },
  { id: "social_first", icon: "✍️", name: "社区新秀", desc: "在社区发布第一条动态", cond: (s) => s.postCount >= 1 },
  { id: "xp_1000", icon: "⭐", name: "千分学者", desc: "累计获得 1000 XP", cond: (s) => s.xp >= 1000 }
];

/* ---------- 每日任务 ---------- */
const DAILY_QUESTS = [
  { id: "q_lesson", icon: "🎯", name: "完成 1 节课程", target: 1, metric: "lessons", reward: 30 },
  { id: "q_words", icon: "🃏", name: "记住 10 个单词", target: 10, metric: "words", reward: 20 },
  { id: "q_practice", icon: "✏️", name: "完成 2 项专项练习", target: 2, metric: "practices", reward: 25 }
];

/* ---------- 社区种子内容 ---------- */
const SEED_POSTS = [
  {
    id: "seed1", user: "小樱", color: "#FF6B81", tag: "日语", tagColor: "#FFE9EE",
    time: "10 分钟前", text: "今天终于分清了「は」和「が」！\n小技巧：は 强调后面的信息，が 强调前面的主语。大家有什么好的记忆方法吗？",
    likes: 24, liked: false,
    comments: [{ u: "Ken", c: " #FF6B81", t: "は是主题，が是主语，这样记比较好懂！" }, { u: "Mika", c: " #4A86F7", t: "多看日剧会越来越有语感的，がんばって！" }]
  },
  {
    id: "seed2", user: "Alex_Chen", color: "#4A86F7", tag: "英语", tagColor: "#E8F0FF",
    time: "1 小时前", text: "Shadowing（影子跟读法）坚持了 30 天，口语流利度明显提升！\n方法：选一段 2 分钟的音频 → 不看文本跟读 → 再看文本纠音。推荐给所有练口语的小伙伴 🎤",
    likes: 58, liked: false,
    comments: [{ u: "语界小助手", c: " #6C5CE7", t: "坚持 30 天太厉害了！平台口语跟读模块就支持逐句影子练习哦～" }]
  },
  {
    id: "seed3", user: "한국어사랑", color: "#2EA44F", tag: "韩语", tagColor: "#E6F6EC",
    time: "3 小时前", text: "TOPIK II 6급 합격했어요!! 🎉\n备考半年，每天 2 小时，听力和阅读是拿分关键。有问题的同学可以留言，知无不言！",
    likes: 102, liked: false,
    comments: [{ u: "豆芽", c: " #FDCB6E", t: "恭喜！请问写作最后一道大作文怎么准备呀？" }]
  },
  {
    id: "seed4", user: "Natsumi", color: "#E17055", tag: "打卡", tagColor: "#FFF1E8",
    time: "昨天", text: "连续打卡第 45 天 ✅\n今天学了敬语单元，发现商务日语的坑真的好多……明天继续！",
    likes: 41, liked: false, comments: []
  },
  {
    id: "seed5", user: "多语种收藏家", color: "#6C5CE7", tag: "经验", tagColor: "#EFEDFF",
    time: "2 天前", text: "同时学英语和韩语会混淆吗？我的体验是：\n1. 用不同场景绑定语言（英语=工作，韩语=追星）\n2. 学习时间错开，早晚各一门\n3. 发音体系完全不同，反而能互相促进\n供大家参考～",
    likes: 76, liked: false,
    comments: [{ u: "Lily", c: " #FD79A8", t: "场景绑定这个思路绝了，我也要试试！" }]
  }
];

/* ---------- 学习小组 ---------- */
const GROUPS = [
  { icon: "🌅", name: "早安晨读团", members: 1284, desc: "每天 7:00 一起晨读 15 分钟" },
  { icon: "🇯🇵", name: "JLPT N2 冲刺营", members: 862, desc: "12 月考试，组队刷题" },
  { icon: "🎬", name: "看剧学英语", members: 2156, desc: "每周一部剧，学地道表达" },
  { icon: "🇰🇷", name: "TOPIK 互助小组", members: 945, desc: "写作互改，听力共享" },
  { icon: "🎤", name: "开口说俱乐部", members: 1573, desc: "摆脱哑巴外语，语音打卡" }
];

/* ---------- 排行榜种子用户 ---------- */
const SEED_LEADERS = [
  { name: "한국어사랑", color: "#2EA44F", sub: "韩语 · 连续 89 天", xp: 4820 },
  { name: "Alex_Chen", color: "#4A86F7", sub: "英语 · 连续 64 天", xp: 3960 },
  { name: "Natsumi", color: "#E17055", sub: "日语 · 连续 45 天", xp: 3120 },
  { name: "小樱", color: "#FF6B81", sub: "日语 · 连续 21 天", xp: 2480 },
  { name: "豆芽", color: "#FDCB6E", sub: "韩语 · 连续 18 天", xp: 1860 },
  { name: "多语种收藏家", color: "#6C5CE7", sub: "英韩双修 · 连续 12 天", xp: 1340 },
  { name: "Ken", color: "#00B894", sub: "英语 · 连续 9 天", xp: 920 }
];

/* ---------- 导出 ---------- */
window.CONTENT = {
  langs: { en: EN, ja: JA, ko: KO },
  langList: [EN, JA, KO],
  ACHIEVEMENTS, DAILY_QUESTS, SEED_POSTS, GROUPS, SEED_LEADERS,

  // 工具：按 id 查找课程
  findLesson(id) {
    for (const lang of this.langList) {
      for (const lv of lang.levels) {
        const ls = lv.lessons.find((x) => x.id === id);
        if (ls) return { lang, level: lv, lesson: ls };
      }
    }
    return null;
  },

  // 某语言的全部课程（扁平）
  lessonsOf(langId) {
    const lang = this.langs[langId];
    const out = [];
    lang.levels.forEach((lv) => lv.lessons.forEach((l) => out.push({ level: lv, lesson: l })));
    return out;
  },

  // 全部单词（带课程归属）
  allWords(langId) {
    const out = [];
    this.lessonsOf(langId).forEach(({ lesson }) => {
      lesson.vocab.forEach((v) => out.push(Object.assign({ lessonId: lesson.id }, v)));
    });
    return out;
  },

  // 全部语法题
  allGrammar(langId) {
    const out = [];
    this.lessonsOf(langId).forEach(({ lesson }) => {
      lesson.grammar.forEach((q) => out.push(Object.assign({ lessonId: lesson.id }, q)));
    });
    return out;
  },

  // 全部口语句
  allSpeaking(langId) {
    const out = [];
    this.lessonsOf(langId).forEach(({ lesson }) => {
      lesson.speaking.forEach((s) => out.push(Object.assign({ lessonId: lesson.id }, s)));
    });
    return out;
  },

  // 全部听力材料
  allListening(langId) {
    const out = [];
    this.lessonsOf(langId).forEach(({ level, lesson }) => {
      out.push(Object.assign({ lessonId: lesson.id, levelName: level.name, title: lesson.title, icon: lesson.icon }, lesson.listening));
    });
    return out;
  }
};
})();
