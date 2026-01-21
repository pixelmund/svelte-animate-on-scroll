<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type Easing, type Animations, easings, animations } from './css/index.js';
	import type { HTMLAttributes } from 'svelte/elements';

	// Breakpoint configuration (desktop-first, Tailwind-style)
	const BREAKPOINTS = {
		'2xl': 1536,
		xl: 1280,
		lg: 1024,
		md: 768,
		sm: 640
	} as const;

	type BreakpointKey = keyof typeof BREAKPOINTS;

	interface BreakpointOptions {
		enabled?: boolean;
		animate?: Animations;
		ease?: Easing;
		delay?: number;
		duration?: number;
		distance?: string;
		once?: boolean;
		top?: number;
		bottom?: number;
	}

	interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
		animate: Animations;
		ease?: Easing;
		delay?: number;
		duration?: number;
		distance?: string;
		once?: boolean;
		top?: number;
		bottom?: number;
		enabled?: boolean;
		breakpoints?: Partial<Record<BreakpointKey, BreakpointOptions>>;
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
		enabled = true,
		breakpoints,
		class: className = {
			container: '',
			animate: ''
		},
		onupdate = () => {},
		children,
		...props
	}: ContainerProps = $props();

	// Window width tracking for responsive breakpoints
	let windowWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 1920);

	// Get the active breakpoint based on current window width (desktop-first)
	function getActiveBreakpoint(width: number): BreakpointKey | null {
		// Check breakpoints from smallest to largest
		// Desktop-first: apply when width <= threshold
		const breakpointOrder: BreakpointKey[] = ['sm', 'md', 'lg', 'xl', '2xl'];

		for (const bp of breakpointOrder) {
			if (width <= BREAKPOINTS[bp] && breakpoints?.[bp]) {
				return bp;
			}
		}
		return null;
	}

	// Derive effective options by merging base props with active breakpoint overrides
	let effectiveOptions = $derived.by(() => {
		const activeBreakpoint = getActiveBreakpoint(windowWidth);
		const overrides = activeBreakpoint ? breakpoints?.[activeBreakpoint] : null;

		if (!overrides) {
			return {
				enabled,
				animate,
				ease,
				delay,
				duration,
				distance,
				once,
				top,
				bottom
			};
		}

		return {
			enabled: overrides.enabled ?? enabled,
			animate: overrides.animate ?? animate,
			ease: overrides.ease ?? ease,
			delay: overrides.delay ?? delay,
			duration: overrides.duration ?? duration,
			distance: overrides.distance ?? distance,
			once: overrides.once ?? once,
			top: overrides.top ?? top,
			bottom: overrides.bottom ?? bottom
		};
	});

	let observing = $state(false);
	let container = $state<HTMLDivElement>();

	function intersection_verify() {
		// bottom left top right
		const rootMargin = `${-effectiveOptions.bottom}px 0px ${-effectiveOptions.top}px 0px`;

		const observer = new IntersectionObserver(
			(entries) => {
				observing = entries[0].isIntersecting;
				if (observing && effectiveOptions.once) {
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
		observing =
			c.top + effectiveOptions.top < window.innerHeight &&
			c.bottom - effectiveOptions.bottom > 0;

		if (observing && effectiveOptions.once) {
			window.removeEventListener('scroll', bounding_verify);
		}

		window.addEventListener('scroll', bounding_verify);
		return () => window.removeEventListener('scroll', bounding_verify);
	}

	$effect(() => {
		onupdate(observing);
	});

	// Resize listener for responsive breakpoints
	$effect(() => {
		if (typeof window === 'undefined') return;

		function handleResize() {
			windowWidth = window.innerWidth;
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	$effect.pre(() => {
		if (!container || !effectiveOptions.enabled) return;

		if (IntersectionObserver) {
			return intersection_verify();
		} else {
			return bounding_verify();
		}
	});

	let easing = $derived(easings[effectiveOptions.ease]);
	let animation = $derived(animations[effectiveOptions.animate]);
</script>

{#if effectiveOptions.enabled}
	<div
		bind:this={container}
		style="--aos-distance: {effectiveOptions.distance}"
		class={[className.container]}
		{...props}
	>
		<div
			style="transition-duration: {effectiveOptions.duration}ms; transition-delay: {observing ? effectiveOptions.delay : 0}ms"
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
{:else}
	{@render children()}
{/if}

<style>
	.pointer-events-none {
		pointer-events: none;
	}

	.pointer-events-auto {
		pointer-events: auto;
	}
</style>
