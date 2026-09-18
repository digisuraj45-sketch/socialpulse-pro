import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, User, Clock, ArrowRight, Sparkles, Tag } from 'lucide-react';

export const PublicBlogView: React.FC = () => {
  const { setCurrentView } = useApp();

  const articles = [
    {
      id: 1,
      title: 'How High-Retention Video Views Accelerate Algorithmic Recommendations',
      slug: 'high-retention-video-views-algorithm',
      excerpt: 'Analyzing the mathematical interplay between average percentage viewed (APV), initial velocity, and Explore/ForYou feed triggers across modern video architectures.',
      author: 'Suraj Sharma, Growth Engineer',
      date: 'Sep 15, 2026',
      readTime: '6 min read',
      tag: 'Algorithms & Growth'
    },
    {
      id: 2,
      title: 'Architecting Reseller SMM Infrastructure on Hostinger Web & Cloud',
      slug: 'hostinger-smm-infrastructure-architecture',
      excerpt: 'How database queues, atomic wallet ledgers, and scheduled cron dispatchers enable enterprise scale on cost-effective shared and cloud hosting environments.',
      author: 'DevOps Architecture Team',
      date: 'Sep 10, 2026',
      readTime: '8 min read',
      tag: 'Engineering & DevOps'
    },
    {
      id: 3,
      title: 'Digital Marketing Service Compliance & Acceptable Use in 2026',
      slug: 'compliance-acceptable-use-guidelines',
      excerpt: 'Understanding platform rules, avoiding synthetic bypass schemes, and establishing transparent client expectations for social marketing fulfillment.',
      author: 'Legal & Trust Operations',
      date: 'Aug 28, 2026',
      readTime: '5 min read',
      tag: 'Compliance & Safety'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Marketing Intelligence</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">SocialPulse Insights & Strategy</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            In-depth engineering notes, digital growth playbooks, and platform fulfillment best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map(art => (
            <article
              key={art.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/40 transition group"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <Tag className="w-2.5 h-2.5" /> {art.tag}
                </span>

                <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition leading-snug">
                  {art.title}
                </h2>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{art.readTime}</span>
                </div>
                <span>{art.date}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
