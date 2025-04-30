# svelte-animate-on-scroll

A lightweight and customizable animate-on-scroll library for Svelte applications. Add beautiful scroll animations to your components with ease.

## Installation

```bash
npm install svelte-animate-on-scroll
```

## Usage

```svelte
<script>
  import { AOS } from 'svelte-animate-on-scroll';
</script>

<AOS animate="fade-up">
  <h1>This will fade up on scroll</h1>
</AOS>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| animate | string | required | Animation type to apply. See [Available Animations](#available-animations) |
| ease | string | 'ease-in-out' | Easing function to use. See [Available Easings](#available-easings) |
| delay | number | 0 | Delay before animation starts (in milliseconds) |
| duration | number | 300 | Duration of the animation (in milliseconds) |
| distance | string | '100px' | Distance for translate animations |
| once | boolean | true | Whether animation should only happen once |
| top | number | 0 | Offset from top of viewport before triggering |
| bottom | number | 0 | Offset from bottom of viewport before triggering |
| class | object | { container: '', animate: '' } | Custom classes for container and animated elements |
| onupdate | function | (observing) => {} | Callback when visibility changes |

## Available Animations

- Fade animations:
  - fade
  - fade-up
  - fade-down
  - fade-left
  - fade-right
  - fade-up-right
  - fade-up-left
  - fade-down-right
  - fade-down-left

- Zoom animations:
  - zoom-in
  - zoom-in-up
  - zoom-in-down
  - zoom-in-left
  - zoom-in-right
  - zoom-out
  - zoom-out-up
  - zoom-out-down
  - zoom-out-left
  - zoom-out-right

- Slide animations:
  - slide-up
  - slide-down
  - slide-left
  - slide-right

- Flip animations:
  - flip-left
  - flip-right
  - flip-up
  - flip-down

## Available Easings

- linear
- ease
- ease-in
- ease-out
- ease-in-out
- ease-in-back
- ease-out-back
- ease-in-out-back
- ease-in-sine
- ease-out-sine
- ease-in-out-sine
- ease-in-quadratic
- ease-out-quadratic
- ease-in-out-quadratic
- ease-in-cubic
- ease-out-cubic
- ease-in-out-cubic
- ease-in-quartic
- ease-out-quartic
- ease-in-out-quartic

## Examples

```svelte
<!-- Basic usage -->
<AOS animate="fade-up">
  <div>Content that fades up</div>
</AOS>

<!-- With custom options -->
<AOS
  animate="zoom-in"
  ease="ease-out-back"
  delay={200}
  duration={600}
  distance="50px"
  once={false}
>
  <div>Content that zooms in repeatedly</div>
</AOS>

<!-- With custom classes -->
<AOS
  animate="slide-left"
  class={{
    container: 'my-container-class',
    animate: 'my-animation-class'
  }}
>
  <div>Content that slides from the left</div>
</AOS>

<!-- With visibility callback -->
<AOS
  animate="flip-up"
  onupdate={(visible) => {
    console.log('Element is visible:', visible);
  }}
>
  <div>Content that flips up</div>
</AOS>
```

## Browser Support

The library uses the IntersectionObserver API with a fallback to getBoundingClientRect for older browsers. No additional polyfills are required for modern browsers.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
