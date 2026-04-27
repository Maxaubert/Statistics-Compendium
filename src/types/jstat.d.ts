declare module "jstat" {
  interface JStatStatic {
    poisson: { cdf(k: number, mu: number): number; pdf(k: number, mu: number): number };
    binomial: { cdf(k: number, n: number, p: number): number; pdf(k: number, n: number, p: number): number };
    normal: { cdf(z: number, mean: number, std: number): number; inv(p: number, mean: number, std: number): number };
    studentt: { inv(p: number, df: number): number };
    chisquare: { inv(p: number, df: number): number };
  }
  export const jStat: JStatStatic;
}
