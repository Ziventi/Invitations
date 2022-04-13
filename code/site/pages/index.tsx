import type { NextPage } from 'next';

import React, { useRef, useState } from 'react';

const Home: NextPage = () => {
  const [state, setState] = useState({
    text: '',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  function draw(): void {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // ctx.textAlign = 'center';
    // ctx.font = '100px Arial';
    // ctx.fillStyle = '#000';
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // ctx.fillStyle = '#fff';
    // ctx.fillText(state.text, ctx.canvas.width / 2, ctx.canvas.height / 2);
    const img = new Image();
    img.src = '/namecard.png';
    img.onload = () => {
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }

  return (
    <main>
      <section className={'controls'}>
        <textarea
          onChange={(e) => {
            setState({
              text: e.target.value,
            });
          }}
          value={state.text}
          placeholder={'List your guest names'}
        />
        <button onClick={draw}>Draw</button>
      </section>
      <section className={'preview'}>
        <canvas ref={canvasRef} />
      </section>
    </main>
  );
};

export default Home;
