/**
 * 16进制颜色转为RGB数组 [r, g, b]
 */
export function hexToRgb(str: string): number[] {
  let hexs: any = "";
  const reg = /^#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(str)) return [0, 0, 0];
  str = str.replace("#", "");
  hexs = str.match(/../g);
  for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16);
  return hexs;
}

/**
 * RGB转为16进制颜色 #xxxxxx
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const reg = /^\d{1,3}$/;
  if (!reg.test(String(r)) || !reg.test(String(g)) || !reg.test(String(b)))
    return "";
  const hexs = [r.toString(16), g.toString(16), b.toString(16)];
  for (let i = 0; i < 3; i++) {
    if (hexs[i].length === 1) hexs[i] = `0${hexs[i]}`;
  }
  return `#${hexs.join("")}`;
}

/**
 * 加深颜色
 */
export function darken(color: string, level: number): string {
  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.floor(rgb[i] * (1 - level));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

/**
 * 变浅颜色
 */
export function lighten(color: string, level: number): string {
  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++)
    rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i]);
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}
