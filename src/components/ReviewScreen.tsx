import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Send,
  Filter,
  CheckCircle2,
  Heart,
  PawPrint,
  User,
  Tag,
  Clock,
  Flame,
} from 'lucide-react';
import { ReviewFeedback, ReviewCategory, PetProfile } from '../types/pet';
import { Card3D } from './Card3D';
import { SoundEffects } from '../services/soundEffects';

interface ReviewScreenProps {
  reviews: ReviewFeedback[];
  onAddReview: (review: ReviewFeedback) => void;
  onLikeReview: (reviewId: string) => void;
  pets: PetProfile[];
  activePet: PetProfile | null;
  lang: 'en' | 'th';
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  reviews,
  onAddReview,
  onLikeReview,
  pets,
  activePet,
  lang,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [petName, setPetName] = useState(activePet?.name || '');
  const [category, setCategory] = useState<ReviewCategory>('general');
  const [comment, setComment] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | '3'>('all');
  const [submittedToast, setSubmittedToast] = useState(false);

  // Compute average score & distribution
  const totalReviews = reviews.length;
  const avgScore = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const starCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const filteredReviews = reviews.filter(r => {
    if (selectedFilter === 'all') return true;
    return r.rating === Number(selectedFilter);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: ReviewFeedback = {
      id: `rev_${Date.now()}`,
      authorName: authorName.trim() || (lang === 'th' ? 'ผู้ใช้งานไม่ระบุชื่อ' : 'Anonymous Pet Lover'),
      petName: petName.trim() || (activePet ? activePet.name : undefined),
      rating,
      comment: comment.trim(),
      category,
      createdAt: lang === 'th' ? 'เมื่อสักครู่' : 'Just now',
      likes: 1,
    };

    onAddReview(newReview);
    SoundEffects.playMagicChime();
    setComment('');
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 3500);
  };

  const handleLike = (id: string) => {
    onLikeReview(id);
    SoundEffects.playPop();
  };

  const getCategoryLabel = (cat: ReviewCategory) => {
    switch (cat) {
      case 'accuracy':
        return lang === 'th' ? 'ความแม่นยำในการแปล' : 'Accuracy';
      case 'features':
        return lang === 'th' ? 'ฟีเจอร์ & เสียง' : 'Features & Audio';
      case 'ui':
        return lang === 'th' ? 'ความสวยงาม 3D' : 'UI & 3D Design';
      default:
        return lang === 'th' ? 'ความประทับใจทั่วไป' : 'General';
    }
  };

  const getStarRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return lang === 'th' ? '5 ดาว - ยอดเยี่ยม ประทับใจมาก! 🌟' : '5 Stars - Outstanding! 🌟';
      case 4:
        return lang === 'th' ? '4 ดาว - ดีมาก ชื่นชอบ ✨' : '4 Stars - Great! ✨';
      case 3:
        return lang === 'th' ? '3 ดาว - พอใช้ได้ มีประโยชน์ 👍' : '3 Stars - Good 👍';
      case 2:
        return lang === 'th' ? '2 ดาว - อยากให้ปรับปรุงเพิ่มเติม' : '2 Stars - Needs Improvement';
      default:
        return lang === 'th' ? '1 ดาว - ต้องแก้ไข' : '1 Star';
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* 3D Floating Props */}
      <div className="absolute top-8 right-6 text-2xl animate-float-3d opacity-45 pointer-events-none drop-shadow-md hidden md:block">
        ⭐
      </div>
      <div className="absolute bottom-16 left-4 text-2xl animate-float-3d opacity-45 pointer-events-none drop-shadow-md hidden md:block" style={{ animationDelay: '1.5s' }}>
        💖
      </div>

      {/* Success Toast */}
      {submittedToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-full animate-spring-up">
          <div className="glass-panel p-4 rounded-2xl border-2 border-yellow-400 bg-emerald-950/95 shadow-2xl flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-yellow-400 text-emerald-950 font-bold shrink-0">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="font-game text-sm font-bold text-white">
                {lang === 'th' ? 'ส่งรีวิวเรียบร้อยแล้ว! ขอบคุณครับ ✨' : 'Review Submitted! Thank you ✨'}
              </h4>
              <p className="text-xs text-emerald-200 mt-0.5">
                {lang === 'th' ? 'ความคิดเห็นของคุณถูกบันทึกไว้ในระบบเรียบร้อย' : 'Your feedback has been saved successfully.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Box 1: Title with Staggered Spring-Bounce Entrance */}
      <div className="animate-spring-up stagger-1 text-center space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-300 font-semibold mb-1 shadow-lg">
          <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          <span>{lang === 'th' ? 'ขั้นตอนที่ 5: รีวิวและข้อเสนอแนะ' : 'Step 5: Reviews & User Feedback'}</span>
        </div>
        <h1 className="font-game text-3xl sm:text-5xl font-black text-white uppercase tracking-wider drop-shadow-lg text-hero-3d">
          REVIEWS & FEEDBACK
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/90 font-medium drop-shadow max-w-md mx-auto">
          {lang === 'th'
            ? 'ให้คะแนนดาว พิมพ์แนะนำความคิดเห็น และแชร์ความประทับใจของคุณกับ Pet Translator Mood'
            : 'Rate your experience, leave suggestions, and read community feedback in 3D'}
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border-emerald-400/30 shadow-2xl space-y-6 preserve-3d">
        {/* Top Summary: Rating Overview & Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Average Rating Score Card (5 cols) */}
          <Card3D depth={7} className="md:col-span-5 animate-spring-up stagger-2">
            <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-center space-y-2.5 h-full shadow-xl preserve-3d">
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider translate-z-20">
                {lang === 'th' ? 'คะแนนความพึงพอใจเฉลี่ย' : 'Average User Rating'}
              </span>

              <div className="text-5xl sm:text-6xl font-black font-game text-yellow-300 drop-shadow-xl translate-z-30">
                {avgScore}
              </div>

              {/* Big Star display */}
              <div className="flex items-center space-x-1 text-yellow-300 translate-z-20">
                {[1, 2, 3, 4, 5].map(st => (
                  <Star
                    key={st}
                    className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                  />
                ))}
              </div>

              <span className="text-xs text-emerald-200/80 font-mono translate-z-10">
                {lang === 'th' ? `จากทั้งหมด ${totalReviews} รีวิวจากผู้เลี้ยง` : `Based on ${totalReviews} community reviews`}
              </span>
            </div>
          </Card3D>

          {/* Star Distribution Bars (7 cols) */}
          <Card3D depth={6} className="md:col-span-7 animate-spring-up stagger-3">
            <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-2xl p-5 space-y-2.5 h-full flex flex-col justify-center shadow-xl preserve-3d">
              <div className="flex items-center justify-between pb-1 border-b border-emerald-500/20 translate-z-20">
                <h3 className="font-game text-xs sm:text-sm font-bold text-white tracking-wide">
                  {lang === 'th' ? 'สัดส่วนคะแนนดาว' : 'Rating Distribution'}
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">100% Verified Feedback</span>
              </div>

              {[5, 4, 3, 2, 1].map(starNum => {
                const count = starCounts[starNum as keyof typeof starCounts];
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={starNum} className="flex items-center space-x-3 text-xs translate-z-10">
                    <span className="w-12 text-yellow-300 font-game font-bold flex items-center space-x-0.5">
                      <span>{starNum}</span>
                      <Star className="w-3 h-3 fill-yellow-400 inline" />
                    </span>

                    <div className="flex-1 bg-emerald-950 h-2.5 rounded-full overflow-hidden border border-emerald-500/30">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-yellow-300 h-full rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(74,222,128,0.5)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <span className="w-8 text-right font-mono text-emerald-300 text-[11px]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card3D>
        </div>

        {/* Submit Review Form (Interactive 3D Glass Form) */}
        <Card3D depth={8} className="animate-spring-up stagger-4">
          <div className="glass-panel p-5 sm:p-7 rounded-2xl border-2 border-emerald-400/50 bg-emerald-950/80 shadow-2xl space-y-5 preserve-3d">
            <div className="flex items-center space-x-3 translate-z-20">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-emerald-950 font-bold flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 h-5 fill-emerald-950" />
              </div>
              <div>
                <h3 className="font-game text-base sm:text-lg font-bold text-white tracking-wide">
                  {lang === 'th' ? 'เขียนรีวิวและข้อเสนอแนะของคุณ' : 'Write a Review & Share Feedback'}
                </h3>
                <p className="text-xs text-emerald-300/80">
                  {lang === 'th' ? 'ความคิดเห็นของคุณจะช่วยพัฒนาแอปและถูกบันทึกไว้ในเครื่องของคุณตลอดเวลา' : 'Your review will be saved and visible to you every time you return.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 translate-z-10">
              {/* Interactive Star Picker */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30">
                <label className="text-xs font-bold text-emerald-200 block">
                  {lang === 'th' ? 'ให้คะแนนความพึงพอใจ *' : 'Your Rating *'}
                </label>

                <div className="flex items-center space-x-2 pt-1">
                  {[1, 2, 3, 4, 5].map(starNum => {
                    const active = (hoverRating !== null ? hoverRating : rating) >= starNum;
                    return (
                      <button
                        key={starNum}
                        type="button"
                        onClick={() => {
                          setRating(starNum);
                          SoundEffects.playPop();
                        }}
                        onMouseEnter={() => setHoverRating(starNum)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-9 sm:h-9 transition-colors ${
                            active
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-game font-bold text-yellow-300">
                    {getStarRatingLabel(hoverRating !== null ? hoverRating : rating)}
                  </span>
                </div>
              </div>

              {/* Author & Pet Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-200 block">
                    {lang === 'th' ? 'ชื่อของคุณ / ฉายา' : 'Your Name / Nickname'}
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={e => setAuthorName(e.target.value)}
                    placeholder={lang === 'th' ? 'เช่น ทาสแมวเอก, พ่อน้องมิลค์' : 'e.g. Alex (Dog Parent)'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-200 block">
                    {lang === 'th' ? 'ชื่อสัตว์เลี้ยงของคุณ' : 'Pet Name'}
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={e => setPetName(e.target.value)}
                    placeholder={
                      pets.length > 0
                        ? `เช่น ${pets[0].name}`
                        : lang === 'th'
                        ? 'เช่น น้องส้ม, บัดดี้'
                        : 'e.g. Luna, Buddy'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-200 block">
                  {lang === 'th' ? 'หมวดหมู่ความคิดเห็น' : 'Category'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['general', 'accuracy', 'features', 'ui'] as ReviewCategory[]).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        SoundEffects.playPop();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        category === cat
                          ? 'bg-yellow-400 text-emerald-950 font-game shadow-md scale-105'
                          : 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-800/40'
                      }`}
                    >
                      {getCategoryLabel(cat)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-200 block">
                  {lang === 'th' ? 'พิมพ์ข้อเสนอแนะหรือคำแนะนำ *' : 'Feedback / Suggestions *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder={
                    lang === 'th'
                      ? 'แชร์ความรู้สึกของคุณ เช่น การแปลภาษากายแม่นยำแค่ไหน หรืออยากให้มีฟีเจอร์อะไรเพิ่ม...'
                      : 'Share your experience, translation accuracy impressions, or suggestions...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-emerald-950 font-game font-bold text-sm sm:text-base btn-3d-yellow shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4 fill-emerald-950" />
                <span>{lang === 'th' ? 'ส่งรีวิวและข้อเสนอแนะ (Submit Feedback)' : 'Submit Review & Feedback'}</span>
              </button>
            </form>
          </div>
        </Card3D>

        {/* Reviews List & Community Feed */}
        <div className="animate-spring-up stagger-5 space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-game text-base sm:text-lg font-bold text-white tracking-wide">
                {lang === 'th' ? 'รีวิวทั้งหมด' : 'Community Reviews'}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 font-mono">
                {filteredReviews.length} {lang === 'th' ? 'รายการ' : 'entries'}
              </span>
            </div>

            {/* Rating Filter Pills */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-emerald-300 text-[11px] font-mono mr-1">Filter:</span>
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] cursor-pointer ${
                  selectedFilter === 'all' ? 'bg-emerald-400 text-emerald-950 font-bold' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('5')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] cursor-pointer ${
                  selectedFilter === '5' ? 'bg-yellow-400 text-emerald-950 font-bold' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                5★
              </button>
              <button
                onClick={() => setSelectedFilter('4')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] cursor-pointer ${
                  selectedFilter === '4' ? 'bg-yellow-400 text-emerald-950 font-bold' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                4★
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="space-y-3.5">
            {filteredReviews.map(rev => (
              <Card3D key={rev.id} depth={5}>
                <div className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/70 hover:border-emerald-400/60 shadow-xl space-y-3 preserve-3d transition-all">
                  <div className="flex items-start justify-between gap-3 translate-z-20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-emerald-950 font-game font-bold text-base shadow-md">
                        {rev.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-game text-sm sm:text-base font-bold text-white">
                            {rev.authorName}
                          </h4>
                          {rev.petName && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/90 text-yellow-300 border border-emerald-500/30 flex items-center space-x-1">
                              <span>🐾</span>
                              <span>{rev.petName}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-emerald-300/80 font-mono">
                          <span>{rev.createdAt}</span>
                          <span>·</span>
                          <span className="text-emerald-400">{getCategoryLabel(rev.category)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Star Rating display */}
                    <div className="flex items-center space-x-0.5 text-yellow-300 shrink-0">
                      {[1, 2, 3, 4, 5].map(st => (
                        <Star
                          key={st}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            st <= rev.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-neutral-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment Content */}
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed translate-z-10 bg-black/30 p-3 rounded-xl border border-emerald-500/20 font-medium">
                    "{rev.comment}"
                  </p>

                  {/* Footer Actions: Like Button */}
                  <div className="flex items-center justify-between text-xs pt-1 translate-z-20">
                    <button
                      onClick={() => handleLike(rev.id)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-500/30 text-emerald-200 hover:text-white cursor-pointer transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-yellow-300" />
                      <span>{lang === 'th' ? 'มีประโยชน์' : 'Helpful'}</span>
                      <span className="font-bold text-yellow-300 font-mono">({rev.likes})</span>
                    </button>

                    <span className="text-[10px] font-mono text-emerald-400/80">
                      ✓ บันทึกถาวรในระบบ (Saved)
                    </span>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
