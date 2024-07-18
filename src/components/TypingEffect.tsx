// components/TypingEffect.tsx
'use client';
import React from 'react';
import { ReactTyped } from 'react-typed';

const TypingEffect = () => {
	return (
		<div className='text-xl mt-4'>
			<ReactTyped strings={[`Samuel D' Siqueira `]} typeSpeed={80} backSpeed={80} loop />
		</div>
	);
};

export default TypingEffect;
