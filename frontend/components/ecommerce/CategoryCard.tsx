'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  badge?: string;
}

export const CategoryCard: React.FC<Props> = ({ title, subtitle, image, href, badge }) => {
  return (
    <Link
      href={href}
      className="group relative block aspect-4/5 overflow-hidden rounded-2xl border border-border-light shadow-sm"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-transparent transition-opacity" />

      {badge && (
        <span className="absolute top-3 left-3 bg-gold text-obsidian text-[9px] font-mono font-bold px-2 py-0.5 rounded">
          {badge}
        </span>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-porcelain">
        <div>
          <span className="text-[10px] font-mono text-gold tracking-widest uppercase block mb-1">
            {subtitle}
          </span>
          <h3 className="font-headline font-black text-xl tracking-tight uppercase">
            {title}
          </h3>
        </div>
        <div className="w-8 h-8 rounded-full bg-porcelain/20 backdrop-blur-md flex items-center justify-center group-hover:bg-gold group-hover:text-obsidian transition-colors">
          <ArrowUpRight size={16} />
        </div>
      </div>
    </Link>
  );
};
