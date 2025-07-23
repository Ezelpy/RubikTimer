// import { promisify } from 'util';
// import { exec } from 'child_process';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // __dirname fix for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const execAsync = promisify(exec);

// export async function generateScramble(count = 1) {
//   // Path to TNoodle JAR in vendor/ directory adjacent to this file
//   const jarPath = path.resolve(__dirname, 'vendor', 'tnoodle-cli-1.1.1.jar');
//   const cmd     = `java -jar "${jarPath}" scramble --puzzle three --count ${count}`;

//   const { stdout } = await execAsync(cmd);
//   const scrambles  = stdout.trim().split(/\r?\n/);

//   return count === 1 ? scrambles[0] : scrambles;
// }

// export default generateScramble;

export async function generateScramble() {
    const response = await fetch('/generate-scramble/');
    const data = await response.json();
    return data.scramble;
}