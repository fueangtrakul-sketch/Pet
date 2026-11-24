import React, { useState } from 'react';
import { Star, ThumbsUp, Send } from 'lucide-react';
import { ReviewFeedback, ReviewCategory, PetProfile } from '../types/pet';
import { SoundEffects } from '../services/soundEffects';
import { FlowNavigation, ScreenId } from './FlowNavigation';

interface ReviewScreenProps {
  reviews: ReviewFeedback[];
  onAddReview: (review: ReviewFeedback) => void;
  onLikeReview: (reviewId: string) => void;
  pets: PetProfile[];
  activePet: PetProfile | null;
  lang: 'en' | 'th';
  onNavigate?: (screen: ScreenId) => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  reviews,
  onAddReview,
  onLikeReview,
  pets,
  activePet,
  lang,
  onNavigate,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [petName, setPetName] = useState(activePet?.name || '');
  const [category, setCategory] = useState<ReviewCategory>('general');
  const [comment, setComment] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | '3'>('all');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const totalReviews = reviews.length;
  const avgScore =
    totalReviews > 0
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
      authorName: authorName.trim() || (lang === 'th' ? 'ผู้ใช้งานทั่วไป' : 'Pet Owner'),
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
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 3500);
  };

  const handleLike = (id: string) => {
    onLikeReview(id);
    SoundEffects.playPop();
  };

  const getCategoryLabel = (cat: ReviewCategory) => {
    switch (cat) {
      case 'accuracy':
        return lang === 'th' ? 'ความแม่นยำ' : 'Accuracy';
      case 'features':
        return lang === 'th' ? 'ฟีเจอร์การใช้งาน' : 'Features';
      case 'ui':
        return lang === 'th' ? 'การออกแบบ' : 'Interface';
      default:
        return lang === 'th' ? 'ภาพรวม' : 'General';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-1.5">
        <p className="text-xs font-medium text-[#4BA393]">
          {lang === 'th' ? 'ขั้นตอนที่ 5 · รีวิวและข้อเสนอแนะ' : 'Step 5 · Feedback & Ratings'}
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
          {lang === 'th' ? 'ความคิดเห็นและคะแนนความพึงพอใจ' : 'User Reviews & Feedback'}
        </h1>
        <p className="text-sm text-slate-400">
          {lang === 'th'
            ? 'ร่วมให้คะแนนและข้อเสนอแนะเพื่อพัฒนาความแม่นยำในการวิเคราะห์ ข้อมูลจะถูกบันทึกไว้อัตโนมัติ'
            : 'Rate your experience and share feedback. Submitted reviews persist locally on your device.'}
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary + Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Rating Overview */}
          <div className="rounded-xl border border-white/[0.08] bg-[#12161B] p-5 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-mono text-3xl font-semibold text-slate-100 tabular-nums">
                  {avgScore}
                  <span className="text-sm text-slate-500 font-normal"> / 5.0</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'th'
                    ? `อ้างอิงจาก ${totalReviews} รีวิว`
                    : `Based on ${totalReviews} reviews`}
                </p>
              </div>
              <div className="flex items-center gap-0.5 text-[#C89B54]">
                {[1, 2, 3, 4, 5].map(st => (
                  <Star key={st} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/[0.06]">
              {[5, 4, 3, 2, 1].map(starNum => {
                const count = starCounts[starNum as keyof typeof starCounts];
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={starNum} className="flex items-center gap-3 text-xs">
                    <span className="w-6 font-mono text-slate-400 tabular-nums">{starNum}★</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#0B0D10] overflow-hidden">
                      <div
                        className="h-full bg-[#C89B54] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right font-mono text-slate-500 tabular-nums">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-white/[0.08] bg-[#12161B] p-5 space-y-4"
          >
            <h2 className="font-display text-base font-semibold text-slate-100">
              {lang === 'th' ? 'ส่งความคิดเห็นของคุณ' : 'Submit Feedback'}
            </h2>

            {submittedNotice && (
              <div className="rounded-lg border border-[#4BA393]/40 bg-[#4BA393]/10 px-3.5 py-2.5 text-xs text-slate-200">
                {lang === 'th'
                  ? 'บันทึกรีวิวของคุณเรียบร้อยแล้ว ขอบคุณสำหรับความคิดเห็น'
                  : 'Your review has been saved. Thank you for your feedback.'}
              </div>
            )}

            {/* Star Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                {lang === 'th' ? 'คะแนนความพึงพอใจ' : 'Rating'}
              </label>
              <div className="flex items-center gap-1.5">
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
                      aria-label={`${starNum} stars`}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          active ? 'text-[#C89B54] fill-[#C89B54]' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-xs font-mono text-slate-400 tabular-nums">
                  {hoverRating !== null ? hoverRating : rating} / 5
                </span>
              </div>
            </div>

            {/* Name & Pet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  {lang === 'th' ? 'ชื่อผู้รีวิว' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  placeholder={lang === 'th' ? 'ระบุชื่อหรือนามแฝง' : 'e.g. Alex'}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D10] border border-white/[0.1] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#4BA393]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  {lang === 'th' ? 'ชื่อสัตว์เลี้ยง' : 'Pet Name'}
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={e => setPetName(e.target.value)}
                  placeholder={pets.length > 0 ? pets[0].name : lang === 'th' ? 'เช่น ส้ม' : 'e.g. Cooper'}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0D10] border border-white/[0.1] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#4BA393]"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                {lang === 'th' ? 'หมวดหมู่' : 'Category'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-lg bg-[#0B0D10] border border-white/[0.08]">
                {(['general', 'accuracy', 'features', 'ui'] as ReviewCategory[]).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      category === cat
                        ? 'bg-[#1F2730] text-slate-100'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                {lang === 'th' ? 'ข้อความข้อเสนอแนะ *' : 'Comments *'}
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={
                  lang === 'th'
                    ? 'พิมพ์ประสบการณ์การใช้งานหรือคำแนะนำเพิ่มเติม...'
                    : 'Share your experience or suggestions...'
                }
                className="w-full px-3 py-2 rounded-lg bg-[#0B0D10] border border-white/[0.1] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#4BA393] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 min-h-[42px] rounded-lg bg-[#3D8B7D] hover:bg-[#4BA393] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'ส่งความคิดเห็น' : 'Submit Review'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Reviews List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-semibold text-slate-100">
              {lang === 'th' ? 'รีวิวจากผู้ใช้งาน' : 'Community Feedback'}
              <span className="ml-2 text-xs font-mono text-slate-500 tabular-nums">
                ({filteredReviews.length})
              </span>
            </h2>

            {/* Filter segmented control */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#12161B] border border-white/[0.08]">
              {(['all', '5', '4', '3'] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    selectedFilter === f
                      ? 'bg-[#1F2730] text-slate-100 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f === 'all' ? (lang === 'th' ? 'ทั้งหมด' : 'All') : `${f}★`}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] bg-[#12161B]">
            {filteredReviews.length > 0 ? (
              filteredReviews.map(rev => (
                <article key={rev.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-semibold text-slate-100">
                        {rev.authorName}
                      </h3>
                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2">
                        {rev.petName && (
                          <>
                            <span>{rev.petName}</span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span>{getCategoryLabel(rev.category)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{rev.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-[#C89B54] shrink-0">
                      {[1, 2, 3, 4, 5].map(st => (
                        <Star
                          key={st}
                          className={`w-3.5 h-3.5 ${
                            st <= rev.rating ? 'fill-current' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleLike(rev.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{lang === 'th' ? 'มีประโยชน์' : 'Helpful'}</span>
                      <span className="font-mono tabular-nums text-slate-500">({rev.likes})</span>
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="p-10 text-center text-xs text-slate-500">
                {lang === 'th' ? 'ไม่พบรีวิวในหมวดคะแนนที่เลือก' : 'No reviews match this rating filter.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {onNavigate && (
        <FlowNavigation
          currentScreen="review"
          onNavigate={onNavigate}
          lang={lang}
        />
      )}
    </div>
  );
};
