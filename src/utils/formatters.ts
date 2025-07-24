export function formatDifficulty(difficulty: string): string {
  switch (difficulty) {
    case "nenarocne":
      return "Nenáročné";
    case "stredne_narocne":
      return "Středně náročné";
    case "narocne":
      return "Náročné";
    default:
      return difficulty;
  }
}