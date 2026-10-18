import { execFileSync } from "node:child_process";

const base = process.argv[2];
if (!base) throw new Error("Provide a Git base SHA for the documentation check.");
const files = execFileSync("git", ["diff", "--name-only", `${base}...HEAD`], { encoding: "utf8" }).trim().split("\n");
const changed = files.some(file => /^(src\/|supabase\/|tests\/|scripts\/|\.codex\/|\.github\/|AGENTS\.md$|package(?:-lock)?\.json$|.*config\.)/.test(file));
const documentedFiles = execFileSync("git", ["diff", "--name-only", "--diff-filter=ACMRT", `${base}...HEAD`], { encoding: "utf8" }).trim().split("\n");
if (changed && !documentedFiles.some(file => /^docs\/features\/.+\.md$/.test(file))) {
  console.error("Feature changes require an updated docs/features/<slug>.md report after QA.");
  process.exit(1);
}
console.log("Documentation change check passed. Human/agent review must verify report accuracy and QA order.");
