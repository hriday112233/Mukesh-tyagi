export function calculatePolygonArea(points: { x: number; y: number }[]): number {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

export type AreaUnit = 'metric' | 'imperial' | 'gaj' | 'guntha' | 'kanal' | 'cent' | 'ankanam';

export function formatArea(pixels: number, unit: AreaUnit = 'metric', scale: number = 0.1): string {
  // scale: 1 pixel = 0.1 meters
  const metersSq = pixels * scale * scale;
  const feetSq = metersSq * 10.7639;

  switch (unit) {
    case 'imperial':
      return `${feetSq.toFixed(2)} ft²`;
    case 'gaj':
      const gaj = feetSq / 9;
      return `${gaj.toFixed(2)} Gaj`;
    case 'guntha':
      const guntha = feetSq / 1089;
      return `${guntha.toFixed(2)} Guntha`;
    case 'kanal':
      const kanal = feetSq / 5445;
      return `${kanal.toFixed(2)} Kanal`;
    case 'cent':
      const cent = feetSq / 435.6;
      return `${cent.toFixed(2)} Cent`;
    case 'ankanam':
      const ankanam = feetSq / 72;
      return `${ankanam.toFixed(2)} Ankanam`;
    default:
      return `${metersSq.toFixed(2)} m²`;
  }
}
