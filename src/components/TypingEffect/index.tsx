// components/TypingEffect.tsx
'use client';
import React from 'react';
import { ReactTyped } from 'react-typed';

const TypingEffect = () => {
	return (
		<div className=' text-green-500 text-xl w-full h-12 text-center mt-4'>
			<ReactTyped strings={[`Samuel D' Siqueira`, 'Software Developer']} typeSpeed={80} backSpeed={80} showCursor loop />
		</div>
	);
};

export default TypingEffect;
