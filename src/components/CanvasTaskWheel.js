import { useState, useRef, useEffect } from 'react';

export default function CanvasTaskWheel({ tasks, onSelectIndex, canvasSize }) {
  const CANVAS_SIZE = canvasSize || 400;
  const RADIUS = CANVAS_SIZE / 2;
  const COLORS = [
    '#A7C7E7', '#B5EAD7', '#FFFACD', '#FFB7B2', '#CBAACB', '#FFDAC1', '#B5EAD7', '#E2F0CB', '#FFB347', '#B0E0E6', '#FFD1DC', '#F3E2A9', '#B39EB5', '#FF6961', '#77DD77', '#AEC6CF', '#FDFD96', '#CFCFC4', '#836953', '#779ECB'
  ];

  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0); // องศาปัจจุบัน
  const [spinning, setSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [highlightAlpha, setHighlightAlpha] = useState(0.4); // 0-0.4

  // วาดวงล้อ
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    if (!tasks || tasks.length === 0) return;
    const anglePerSlice = (2 * Math.PI) / tasks.length;
    let startAngle = rotation * Math.PI / 180;
    tasks.forEach((task, i) => {
      const endAngle = startAngle + anglePerSlice;
      ctx.beginPath();
      ctx.moveTo(RADIUS, RADIUS);
      ctx.arc(RADIUS, RADIUS, RADIUS - 5, startAngle, endAngle, false);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      // highlight เฉพาะสีแบบ smooth
      if (i === highlightedIndex && highlightAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = highlightAlpha;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(RADIUS, RADIUS);
        ctx.arc(RADIUS, RADIUS, RADIUS - 5, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      // ขีดแบ่ง
      ctx.save();
      ctx.strokeStyle = '#B59F78';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(RADIUS, RADIUS);
      ctx.lineTo(
        RADIUS + (RADIUS - 5) * Math.cos(startAngle),
        RADIUS + (RADIUS - 5) * Math.sin(startAngle)
      );
      ctx.stroke();
      ctx.restore();
      // ข้อความ
      ctx.save();
      ctx.translate(RADIUS, RADIUS);
      ctx.rotate(startAngle + anglePerSlice / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#58482D';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(task.name, RADIUS * 0.6, 0, RADIUS * 0.7);
      ctx.restore();
      startAngle = endAngle;
    });
    // วาดขอบวงล้อ
    ctx.save();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#B59F78';
    ctx.beginPath();
    ctx.arc(RADIUS, RADIUS, RADIUS - 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();

    // วาดลูกศรสามเหลี่ยมสีแดงที่ขอบล่าง (กลางล่าง) หันมุมแหลมเข้าวงล้อ
    ctx.save();
    ctx.fillStyle = '#D32F2F';
    ctx.beginPath();
    ctx.moveTo(RADIUS, CANVAS_SIZE - 38); // ปลายแหลม (ใกล้ขอบวงล้อ)
    ctx.lineTo(RADIUS - 22, CANVAS_SIZE - 10); // ฐานซ้าย (ล่างสุด)
    ctx.lineTo(RADIUS + 22, CANVAS_SIZE - 10); // ฐานขวา (ล่างสุด)
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, [tasks, rotation, highlightedIndex, highlightAlpha]);

  // ฟังก์ชันหมุนวงล้อ (สุ่ม task ก่อน แล้วหมุนทีเดียวจบ)
  const spinWheel = () => {
    if (!tasks || tasks.length === 0 || spinning) return;
    setHighlightedIndex(null);
    setSpinning(true);
    setHighlightAlpha(0.4);
    // 1. สุ่ม index ก่อน
    const randomIndex = Math.floor(Math.random() * tasks.length);
    // 2. คำนวณองศาที่ต้องหมุน (หมุนหลายรอบ + ไปหยุดตรง slice ที่สุ่มได้ที่ 90 องศา)
    const rounds = Math.floor(Math.random() * 3) + 3; // 3-5 รอบ
    const anglePerSlice = 360 / tasks.length;
    // ลูกศรอยู่ที่ 90 องศา ต้องให้ slice ที่ randomIndex ไปหยุดตรงนั้น
    const targetAngle = 90 - (randomIndex * anglePerSlice + anglePerSlice / 2);
    const totalAngle = 360 * rounds + targetAngle;
    const start = performance.now();
    const duration = 2200;
    let lastAngle = rotation;
    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const angle = lastAngle + (totalAngle - (lastAngle % 360)) * ease;
      setRotation(angle % 360);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setRotation(targetAngle);
        setSpinning(false);
        setHighlightedIndex(randomIndex);
        if (onSelectIndex) onSelectIndex(randomIndex);
        // กระพริบ smooth 10 ครั้ง
        let blink = 0;
        let fadeIn = true;
        let alpha = 0.0;
        function blinkStep() {
          if (blink >= 10) {
            setHighlightAlpha(0.4);
            if (onSelectIndex) onSelectIndex(randomIndex);
            return;
          }
          if (fadeIn) {
            alpha += 0.08;
            if (alpha >= 0.4) {
              alpha = 0.4;
              fadeIn = false;
            }
          } else {
            alpha -= 0.08;
            if (alpha <= 0) {
              alpha = 0;
              fadeIn = true;
              blink++;
            }
          }
          setHighlightAlpha(alpha);
          requestAnimationFrame(blinkStep);
        }
        blinkStep();
      }
    }
    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-2 border-gray-400 rounded-full bg-white"
          style={{ boxShadow: '0 4px 24px #e0d6c0' }}
        />
        {/* ปุ่ม Spin ตรงกลางวงล้อ */}
        <button
          onClick={spinWheel}
          disabled={spinning || !tasks || tasks.length === 0}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-3 rounded-full bg-[#B59F78] text-white font-bold text-lg shadow-md hover:bg-[#8d7c5f] disabled:opacity-50 z-10"
        >
          {spinning ? 'Spinning...' : 'Spin'}
        </button>
      </div>
      {/* Selected Task ใต้ canvas */}
      {highlightedIndex !== null && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center shadow-md w-full max-w-xs">
          <p className="font-medium text-[#58482D]">Selected Task:</p>
          <p className="text-lg font-bold text-[#58482D] mt-1">{tasks[highlightedIndex]?.name}</p>
        </div>
      )}
    </div>
  );
}