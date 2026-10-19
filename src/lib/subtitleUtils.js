export const subtitleLanguages = [
  ["en", "English"], ["sw", "Swahili"], ["ar", "Arabic"],
  ["zh", "Chinese"], ["nl", "Dutch"], ["fr", "French"],
  ["de", "German"], ["hi", "Hindi"], ["id", "Indonesian"],
  ["it", "Italian"], ["ja", "Japanese"], ["ko", "Korean"],
  ["ms", "Malay"], ["fa", "Persian"], ["pl", "Polish"],
  ["pt", "Portuguese"], ["pt-br", "Portuguese (Brazil)"],
  ["ru", "Russian"], ["es", "Spanish"], ["ta", "Tamil"],
  ["th", "Thai"], ["tr", "Turkish"], ["uk", "Ukrainian"], ["vi", "Vietnamese"],
];

export function safeSubtitleFilename(value, extension = "srt") {
  const name = String(value || "subtitle").split(/[\\/]/).pop()
    .replace(/\.[a-z0-9]{2,4}$/i, "")
    .replace(/[^a-z0-9._ -]/gi, "_").slice(0, 160);
  return `${name || "subtitle"}.${extension}`;
}

export function subtitleToVtt(value) {
  const text = value.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  if (/^WEBVTT(?:\s|$)/.test(text)) return text;
  if (!/\d{2}:\d{2}:\d{2}[,.]\d{3}\s+-->\s+\d{2}:\d{2}:\d{2}[,.]\d{3}/.test(text)) {
    throw new Error("This file cannot be converted to WebVTT. Download the original instead.");
  }
  return `WEBVTT\n\n${text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2")}\n`;
}
