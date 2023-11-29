'use client'

import { useRef, useState, useEffect } from 'react'


export const PointerCircleTrailer = () => {
  const circleRef = useRef(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  window.addEventListener('mousemove', function (e) {
    setCoords({
      x : e.clientX,
      y : e.clientY
    })

    animateCircles()
  })

  /*useEffect(() => {
    animateCircles()
  }, [coords])*/

  const colors = [
    '#ffb56b',
    '#fdaf69',
    '#f89d63',
    '#f59761',
    '#ef865e',
    '#ec805d',
    '#e36e5c',
    '#df685c',
    '#d5585c',
    '#d1525c',
    '#c5415d',
    '#c03b5d',
    '#b22c5e',
    '#ac265e',
    '#9c155f',
    '#950f5f',
    '#830060',
    '#7c0060',
    '#680060',
    '#60005f',
    '#48005f',
    '#3d005e',
  ];

  const animateCircles = () => {
    let x = coords.x
    let y = coords.y

    const circlesNode = circleRef.current
    const circles = circlesNode.querySelectorAll('.circle')

    circles.forEach((circle, index) => {
      circle.style.left = x - 12 + 'px';
      circle.style.top = y - 12 + 'px';

      circle.style.scale = (circles.length - index) / circles.length;

      circle.x = x;
      circle.y = y;

      const nextCircle = circles[index + 1] || circles[0];

      x += (nextCircle.x - x) * 0.3;
      y += (nextCircle.y - y) * 0.3;
    });

    //requestAnimationFrame(animateCircles);
  }

  return (
    <div ref={circleRef}>
      {colors.map((color, index) =>
        <div
          key={index}
          className={'circle'}
          style={{
            height: 24,
            width: 24,
            borderRadius: 24,
            backgroundColor: colors[index],
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 99999999, /* so that it stays on top of all other elements */
          }}
          x={0}
          y={0}
          /*onMouseMove={(e) => handleMouseMove(e)}*/
        >

        </div>
      )}
    </div>
  )
}