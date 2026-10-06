'use client';

import React, { useState } from 'react';

interface Props {
  images: string[];
  name: string;
}

export const ProductGallery: React.FC<Props> = ({ images, name }) => {
  const imageList = images && images.length > 0 ? images : ['/images/hero-men.png'];
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-120">
        {imageList.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`w-18 h-22 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
              activeIdx === i ? 'border-gold shadow-md' : 'border-border-light hover:border-gray-400'
            }`}
          >
            <img src={img} alt={`${name} thumb ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div className="flex-1 aspect-3/4 rounded-2xl overflow-hidden bg-alabaster border border-border-light relative">
        <img
          src={imageList[activeIdx]}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>
    </div>
  );
};
