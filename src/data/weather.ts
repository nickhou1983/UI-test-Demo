import type { DestinationWeather } from '../types';

const weatherData: Record<string, DestinationWeather> = {
  bali: {
    current: { temp: 30, high: 32, low: 25, condition: 'sunny', humidity: 75, windSpeed: 12 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'sunny', high: 32, low: 25 },
      { dayKey: 'weather.tue', condition: 'cloudy', high: 31, low: 24 },
      { dayKey: 'weather.wed', condition: 'rainy', high: 29, low: 24 },
      { dayKey: 'weather.thu', condition: 'sunny', high: 31, low: 25 },
      { dayKey: 'weather.fri', condition: 'sunny', high: 33, low: 26 },
    ],
  },
  kyoto: {
    current: { temp: 12, high: 15, low: 6, condition: 'cloudy', humidity: 55, windSpeed: 8 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'cloudy', high: 14, low: 5 },
      { dayKey: 'weather.tue', condition: 'rainy', high: 12, low: 6 },
      { dayKey: 'weather.wed', condition: 'sunny', high: 16, low: 7 },
      { dayKey: 'weather.thu', condition: 'sunny', high: 17, low: 8 },
      { dayKey: 'weather.fri', condition: 'cloudy', high: 15, low: 7 },
    ],
  },
  santorini: {
    current: { temp: 18, high: 20, low: 13, condition: 'sunny', humidity: 50, windSpeed: 18 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'sunny', high: 20, low: 13 },
      { dayKey: 'weather.tue', condition: 'sunny', high: 21, low: 14 },
      { dayKey: 'weather.wed', condition: 'cloudy', high: 19, low: 12 },
      { dayKey: 'weather.thu', condition: 'sunny', high: 22, low: 14 },
      { dayKey: 'weather.fri', condition: 'cloudy', high: 20, low: 13 },
    ],
  },
  paris: {
    current: { temp: 10, high: 13, low: 5, condition: 'cloudy', humidity: 65, windSpeed: 15 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'rainy', high: 11, low: 4 },
      { dayKey: 'weather.tue', condition: 'cloudy', high: 12, low: 5 },
      { dayKey: 'weather.wed', condition: 'cloudy', high: 13, low: 6 },
      { dayKey: 'weather.thu', condition: 'sunny', high: 15, low: 7 },
      { dayKey: 'weather.fri', condition: 'rainy', high: 10, low: 4 },
    ],
  },
  maldives: {
    current: { temp: 31, high: 33, low: 27, condition: 'sunny', humidity: 70, windSpeed: 10 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'sunny', high: 33, low: 27 },
      { dayKey: 'weather.tue', condition: 'sunny', high: 32, low: 27 },
      { dayKey: 'weather.wed', condition: 'cloudy', high: 31, low: 26 },
      { dayKey: 'weather.thu', condition: 'rainy', high: 30, low: 26 },
      { dayKey: 'weather.fri', condition: 'sunny', high: 33, low: 28 },
    ],
  },
  swiss: {
    current: { temp: 4, high: 7, low: -1, condition: 'snowy', humidity: 60, windSpeed: 20 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'snowy', high: 5, low: -2 },
      { dayKey: 'weather.tue', condition: 'cloudy', high: 6, low: 0 },
      { dayKey: 'weather.wed', condition: 'sunny', high: 8, low: 1 },
      { dayKey: 'weather.thu', condition: 'snowy', high: 3, low: -3 },
      { dayKey: 'weather.fri', condition: 'cloudy', high: 6, low: 0 },
    ],
  },
  newyork: {
    current: { temp: 8, high: 12, low: 3, condition: 'cloudy', humidity: 55, windSpeed: 22 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'sunny', high: 13, low: 4 },
      { dayKey: 'weather.tue', condition: 'cloudy', high: 11, low: 3 },
      { dayKey: 'weather.wed', condition: 'rainy', high: 9, low: 2 },
      { dayKey: 'weather.thu', condition: 'cloudy', high: 10, low: 3 },
      { dayKey: 'weather.fri', condition: 'sunny', high: 14, low: 5 },
    ],
  },
  chengdu: {
    current: { temp: 16, high: 19, low: 11, condition: 'cloudy', humidity: 70, windSpeed: 6 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'cloudy', high: 18, low: 10 },
      { dayKey: 'weather.tue', condition: 'rainy', high: 15, low: 10 },
      { dayKey: 'weather.wed', condition: 'rainy', high: 14, low: 9 },
      { dayKey: 'weather.thu', condition: 'cloudy', high: 17, low: 11 },
      { dayKey: 'weather.fri', condition: 'sunny', high: 20, low: 12 },
    ],
  },
  machupicchu: {
    current: { temp: 14, high: 18, low: 5, condition: 'cloudy', humidity: 65, windSpeed: 14 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'sunny', high: 19, low: 6 },
      { dayKey: 'weather.tue', condition: 'cloudy', high: 17, low: 5 },
      { dayKey: 'weather.wed', condition: 'rainy', high: 15, low: 5 },
      { dayKey: 'weather.thu', condition: 'rainy', high: 14, low: 4 },
      { dayKey: 'weather.fri', condition: 'cloudy', high: 16, low: 5 },
    ],
  },
  capetown: {
    current: { temp: 24, high: 27, low: 16, condition: 'sunny', humidity: 45, windSpeed: 25 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'sunny', high: 28, low: 17 },
      { dayKey: 'weather.tue', condition: 'sunny', high: 27, low: 16 },
      { dayKey: 'weather.wed', condition: 'cloudy', high: 25, low: 15 },
      { dayKey: 'weather.thu', condition: 'stormy', high: 22, low: 14 },
      { dayKey: 'weather.fri', condition: 'sunny', high: 26, low: 16 },
    ],
  },
  greatbarrierreef: {
    current: { temp: 28, high: 30, low: 23, condition: 'sunny', humidity: 72, windSpeed: 16 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'sunny', high: 30, low: 23 },
      { dayKey: 'weather.tue', condition: 'cloudy', high: 29, low: 22 },
      { dayKey: 'weather.wed', condition: 'rainy', high: 27, low: 22 },
      { dayKey: 'weather.thu', condition: 'stormy', high: 26, low: 21 },
      { dayKey: 'weather.fri', condition: 'sunny', high: 30, low: 23 },
    ],
  },
  nepal: {
    current: { temp: 8, high: 13, low: 1, condition: 'sunny', humidity: 40, windSpeed: 10 },
    forecast: [
      { dayKey: 'weather.mon', condition: 'sunny', high: 14, low: 2 },
      { dayKey: 'weather.tue', condition: 'cloudy', high: 12, low: 1 },
      { dayKey: 'weather.wed', condition: 'snowy', high: 5, low: -3 },
      { dayKey: 'weather.thu', condition: 'snowy', high: 3, low: -5 },
      { dayKey: 'weather.fri', condition: 'cloudy', high: 10, low: 0 },
    ],
  },
};

export function getWeatherForDestination(id: string): DestinationWeather | undefined {
  return weatherData[id];
}

export const conditionEmoji: Record<string, string> = {
  sunny: '☀️',
  cloudy: '⛅',
  rainy: '🌧️',
  snowy: '❄️',
  stormy: '⛈️',
};
