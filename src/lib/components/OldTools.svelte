<script lang="ts">
  import { onMount } from 'svelte';

  // import { spring } from 'svelte/motion';
  import { spring } from '$lib/spring';
  const x = spring();

  const reinsert = (arr, from, to) => {
    const _arr = arr.slice(0);
    const val = _arr[from];
    _arr.splice(from, 1);
    _arr.splice(to, 0, val);
    return _arr;
  }

  const clamp = (n, min, max) => Math.max(Math.min(n, max), min);
  const [width, height] = [11, 70, 90];
  const pizza = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const layout = pizza.map(n => {
    const row = Math.floor(n / 3);
    const col = n % 3;
    return [width * col, height * row];
  });

  let order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const handleTouchStart = (key, pressLocation, e: TouchEvent) => { handleMouseDown(key, pressLocation, e.touches[0]); };
  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    handleMouseMove(e.touches[0]);
  };
  const handleMouseDown = (key, [pressX, pressY], { pageX, pageY }) => {
    lastPress = key;
    isPressed = true;
    mouseCircleDelta = [pageX - pressX, pageY - pressY];
    mouseXY = [pressX, pressY];
  };
  const handleMouseMove = ({ pageX, pageY }) => {
    const [ dx, dy ] = mouseCircleDelta;
    if (isPressed) {
      const newMouseXY = [pageX - dx, pageY - dy];
      const col = clamp(Math.floor(newMouseXY[0] / width), 0, 2);
      const row = clamp(Math.floor(newMouseXY[1] / height), 0, Math.floor(count / 3));
      const index = row * 3 + col;
      const newOrder = reinsert(order, order.indexOf(lastPress), index);
      mouseXY = newMouseXY;
      order = newOrder;
    }
  };
  const handleMouseUp = () => {
    isPressed = false;
    mouseCircleDelta = [0, 0];
  };

  const getPositionsFromOrder = (order) => {
    return order.map((_, key) => {
      console.log("key, ", key);
      let style;
      let x, y;
      const visualPosition = order.indexOf(key);
      if (key === lastPress && isPressed) {
        // Move around
        [x, y] = mouseXY;
        const style = {
          translateX: x, translateY: y,
          // scale: spring(1.2),
          scale: 1.2,
          scaleSpring: spring(1.2),
          boxShadow: (x - (3 * width - 50) / 2) / 15,
          // boxShadow: spring((x - (3 * width - 50) / 2) / 15),
          x, y
        };
        return style;
      } else {
        // Transition to where you belong
        [x, y] = layout[visualPosition];
        style = {
          translateX: x,
          translateY: y,
          scale: 1,
          scaleSpring: spring(1),
          boxShadow: (x - (3 * width - 50) / 2) / 15,
          x, y
        };
        return style;
      }
    });
  }

  let positions = getPositionsFromOrder(order);

  $: {
    // positions = getPositionsFromOrder(order);
    // Surgically update positions
  }
</script>

<div class="h-screen w-screen relative">
</div>