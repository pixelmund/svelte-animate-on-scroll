<script lang="ts">
	import { tick, type Snippet } from 'svelte';
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

	// Two-phase mounting to ensure proper CSS transitions:
	// Phase 1: mounted - adds animation class (sets initial hidden state with transform)
	// Phase 2: ready - adds transition class (after a frame, so browser can transition from initial state)
	let mounted = $state(false);
	let ready = $state(false);

	// Window width tracking for responsive breakpoints
	let windowWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 1920);

	// Get the active breakpoint based on current window width (desktop-first)
	function getActiveBreakpoint(width: number): BreakpointKey | null {
		if (!breakpoints) return null;

		// Get defined breakpoints and sort by threshold (smallest to largest)
		const definedBreakpoints = (Object.keys(breakpoints) as BreakpointKey[])
			.filter((bp) => breakpoints![bp] !== undefined)
			.sort((a, b) => BREAKPOINTS[a] - BREAKPOINTS[b]);

		if (definedBreakpoints.length === 0) return null;

		// Desktop-first: find the smallest defined breakpoint whose threshold >= width
		// This cascades settings down - e.g., defining only "lg" applies to sm, md, and lg
		for (const bp of definedBreakpoints) {
			if (width <= BREAKPOINTS[bp]) {
				return bp;
			}
		}

		// Width is larger than all defined breakpoints - no override applies
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
			c.top + effectiveOptions.top < window.innerHeight && c.bottom - effectiveOptions.bottom > 0;

		if (observing && effectiveOptions.once) {
			window.removeEventListener('scroll', bounding_verify);
		}

		window.addEventListener('scroll', bounding_verify);
		return () => window.removeEventListener('scroll', bounding_verify);
	}

	$effect(() => {
		onupdate(observing);
	});

	// Resize listener for responsive breakpoints + set mounted on client
	$effect(() => {
		if (typeof window === 'undefined') return;

		// Phase 1: Add animation class (sets initial hidden state)
		mounted = true;

		// Phase 2: Add transition class after DOM update (allows browser to register initial state first)
		tick().then(() => {
			ready = true;
		});

		function handleResize() {
			windowWidth = window.innerWidth;
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	// Set up observer only after ready - ensures transition class is in DOM first
	$effect(() => {
		if (!container || !effectiveOptions.enabled || !ready) return;

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
			style="transition-duration: {effectiveOptions.duration}ms; transition-delay: {observing
				? effectiveOptions.delay
				: 0}ms"
			class={[
				ready ? easing : '',
				mounted ? animation : 'aos-ssr-hidden',
				className.animate,
				observing && ready ? 'aos-animate pointer-events-auto' : 'pointer-events-none'
			]}
		>
			{@render children()}
		</div>
	</div>
{:else}
	<div bind:this={container} class={[className.container]} {...props}>
		<div class={[className.animate]}>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.pointer-events-none {
		pointer-events: none;
	}

	.pointer-events-auto {
		pointer-events: auto;
	}

	/* Hide element during SSR to prevent flash before animation class is applied */
	.aos-ssr-hidden {
		opacity: 0;
	}
</style>
