// Typographic decoration, not the brand mark (that is WaveMark): Fraunces's
// own opening double quote, traced from the exact typeface the product sets
// its questions in (wght 500). It marks the landing pull-quote as a thing
// somebody says. Colour comes from currentColor; on the page it is rule tone.
const MARK_PATH =
  "M31.71 53.02Q44.45 53.02 50.98 59.18Q57.52 65.34 57.52 75.20Q57.52 86.25 49.59 93.13Q41.66 100.00 30.28 100.00Q17.04 100.00 8.52 90.76Q0.00 81.53 0.00 62.55Q0.00 44.76 6.71 31.73Q13.41 18.69 23.91 10.81Q34.41 2.92 45.63 0.39Q50.27 -0.45 52.76 0.52Q55.24 1.49 55.83 4.27Q56.42 6.72 54.74 8.95Q53.05 11.19 47.74 13.30Q38.63 16.84 32.30 22.28Q25.98 27.72 22.73 33.88Q19.48 40.03 19.48 45.77Q19.48 49.14 21.30 51.08Q23.11 53.02 27.92 53.02ZM104.42 53.02Q117.15 53.02 123.73 59.18Q130.31 65.34 130.31 75.29Q130.31 86.25 122.38 93.13Q114.45 100.00 103.07 100.00Q89.74 100.00 81.26 90.81Q72.79 81.61 72.79 62.55Q72.79 44.84 79.45 31.77Q86.11 18.69 96.66 10.81Q107.20 2.92 118.42 0.39Q122.80 -0.45 125.37 0.52Q127.95 1.49 128.54 4.27Q129.21 6.72 127.48 8.95Q125.75 11.19 120.52 13.38Q111.33 16.84 105.05 22.28Q98.76 27.72 95.47 33.92Q92.19 40.12 92.19 45.77Q92.19 49.14 94.00 51.08Q95.81 53.02 100.70 53.02Z";

export function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 -0.5 130.31 101"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d={MARK_PATH} />
    </svg>
  );
}
