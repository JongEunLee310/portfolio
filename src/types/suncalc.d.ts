declare module "suncalc" {
  type SunTimes = {
    sunrise: Date;
    sunset: Date;
    solarNoon: Date;
    dawn: Date;
    dusk: Date;
    nauticalDawn: Date;
    nauticalDusk: Date;
    nightEnd: Date;
    night: Date;
    goldenHourEnd: Date;
    goldenHour: Date;
  };

  type SunCalc = {
    getTimes: (date: Date, latitude: number, longitude: number) => SunTimes;
  };

  const SunCalc: SunCalc;
  export default SunCalc;
}
