import './easing.css';
import './animations.css';

export const animations = {
    'fade': 'aos-fade',
	'fade-up': 'aos-fade aos-fade-up',
	'fade-down': 'aos-fade aos-fade-down',
	'fade-left': 'aos-fade aos-fade-left',
	'fade-right': 'aos-fade aos-fade-right',
	'fade-up-right': 'aos-fade aos-fade-up-right',
	'fade-up-left': 'aos-fade aos-fade-up-left',
	'fade-down-right': 'aos-fade aos-fade-down-right',
	'fade-down-left': 'aos-fade aos-fade-down-left',
	'zoom-in': 'aos-zoom aos-zoom-in',
	'zoom-in-up': 'aos-zoom aos-zoom-in-up',
	'zoom-in-down': 'aos-zoom aos-zoom-in-down',
	'zoom-in-left': 'aos-zoom aos-zoom-in-left',
	'zoom-in-right': 'aos-zoom aos-zoom-in-right',
	'zoom-out': 'aos-zoom aos-zoom-out',
	'zoom-out-up': 'aos-zoom aos-zoom-out-up',
	'zoom-out-down': 'aos-zoom aos-zoom-out-down',
	'zoom-out-left': 'aos-zoom aos-zoom-out-left',
	'zoom-out-right': 'aos-zoom aos-zoom-out-right',
	'slide-up': 'aos-slide aos-slide-up',
	'slide-down': 'aos-slide aos-slide-down',
	'slide-left': 'aos-slide aos-slide-left',
	'slide-right': 'aos-slide aos-slide-right',
	'flip-left': 'aos-flip aos-flip-left',
	'flip-right': 'aos-flip aos-flip-right',
	'flip-up': 'aos-flip aos-flip-up',
	'flip-down': 'aos-flip aos-flip-down'
} as const;

export const easings = {
	linear: 'aos-easing-linear',
	ease: 'aos-easing-ease',
	'ease-in': 'aos-easing-ease-in',
	'ease-out': 'aos-easing-ease-out',
	'ease-in-out': 'aos-easing-ease-in-out',
	'ease-in-back': 'aos-easing-ease-in-back',
	'ease-out-back': 'aos-easing-ease-out-back',
	'ease-in-out-back': 'aos-easing-ease-in-out-back',
	'ease-in-sine': 'aos-easing-ease-in-sine',
	'ease-out-sine': 'aos-easing-ease-out-sine',
	'ease-in-out-sine': 'aos-easing-ease-in-out-sine',
	'ease-in-quadratic': 'aos-easing-ease-in-quadratic',
	'ease-out-quadratic': 'aos-easing-ease-out-quadratic',
	'ease-in-out-quadratic': 'aos-easing-ease-in-out-quadratic',
	'ease-in-cubic': 'aos-easing-ease-in-cubic',
	'ease-out-cubic': 'aos-easing-ease-out-cubic',
	'ease-in-out-cubic': 'aos-easing-ease-in-out-cubic',
	'ease-in-quartic': 'aos-easing-ease-in-quartic',
	'ease-out-quartic': 'aos-easing-ease-out-quartic',
	'ease-in-out-quartic': 'aos-easing-ease-in-out-quartic'
} as const;

export type Animations = keyof typeof animations;
export type Easing = keyof typeof easings;
