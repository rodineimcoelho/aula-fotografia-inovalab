export type LightingSettings = { angle: number; size: number; power: number; color: string; fill: number; sky: boolean; mixed: boolean };
export const lightingDefaults: LightingSettings[] = [
  {angle:180,size:.18,power:1,color:'neutral',fill:.12,sky:false,mixed:false},
  {angle:155,size:.18,power:1,color:'warm',fill:.005,sky:true,mixed:false},
  {angle:0,size:.18,power:1,color:'neutral',fill:.12,sky:false,mixed:false},
  {angle:-90,size:.18,power:1,color:'neutral',fill:.12,sky:false,mixed:false},
  {angle:-55,size:2.4,power:1,color:'neutral',fill:.12,sky:false,mixed:false},
  {angle:-45,size:.18,power:1,color:'warm',fill:.08,sky:false,mixed:true},
];
export const lightingColors: Record<string,string> = {warm:'#ffb477',neutral:'#fff8eb',cool:'#87baff'};
