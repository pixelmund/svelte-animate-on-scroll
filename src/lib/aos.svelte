<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type Easing, type Animations, easings, animations } from './css/index.js';
	import type { HTMLAttributes } from 'svelte/elements';

	interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
		animate: Animations;
		ease?: Easing;
		delay?: number;
		duration?: number;
		distance?: string;
		once?: boolean;
		top?: number;
		bottom?: number;
		class?: {
			container?: string;
			animate?: string;
		};
		onupdate?: (oberserving: boolean) => void;
		children: Snippet;
	}

	let {
		animate,
		ease = 'ease-in-out',
		once = true,
		top = 0,
		bottom = 0,
		delay = 0,
		duration = 300,
		distance = '100px',
		class: className = {
			container: '',
			animate: ''
		},
		onupdate = () => {},
		children,
		...props
	}: ContainerProps = $props();

	let observing = $state(false);
	let container = $state<HTMLDivElement>();

	function intersection_verify() {
		// bottom left top right
		const rootMargin = `${-bottom}px 0px ${-top}px 0px`;

		const observer = new IntersectionObserver(
			(entries) => {
				observing = entries[0].isIntersecting;
				if (observing && once) {
					observer.unobserve(container!);
				}
			},
			{
				rootMargin
			}
		);

		observer.observe(container!);
		return () => observer.unobserve(container!);
	}

	function bounding_verify() {
		if (!container) return;
		const c = container.getBoundingClientRect();
		observing = c.top + top < window.innerHeight && c.bottom - bottom > 0;

		if (observing && once) {
			window.removeEventListener('scroll', bounding_verify);
		}

		window.addEventListener('scroll', bounding_verify);
		return () => window.removeEventListener('scroll', bounding_verify);
	}

	$effect(() => {
		onupdate(observing);
	});

	$effect.pre(() => {
		if (!container) return;

		if (IntersectionObserver) {
			return intersection_verify();
		} else {
			return bounding_verify();
		}
	});

	let easing = $derived(easings[ease]);
	let animation = $derived(animations[animate]);
</script>

<div
	bind:this={container}
	style="--aos-distance: {distance}"
	class={[className.container]}
	{...props}
>
	<div
		style="transition-duration: {duration}ms; transition-delay: {observing ? delay : 0}ms"
		class={[
			easing,
			animation,
			className.animate,
			observing ? 'aos-animate pointer-events-auto' : 'pointer-events-none'
		]}
	>
		{@render children()}
	</div>
</div>

<style>
	.pointer-events-none {
		pointer-events: none;
	}

	.pointer-events-auto {
		pointer-events: auto;
	}
</style>
