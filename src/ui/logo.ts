import chalk from "chalk";

export function printBiceLogo(version: string) {
  const BICE_BLUE = chalk.hex("#326295");

  const ASCII_BICE_CLI = `\n
▬▬▬▬▬▬▬▬▬▬  ██████  ██  ██████ ███████    ██████ ██      ██ 
▬▬▬▬▬▬▬▬▬▬  ██   ██ ██ ██      ██         ██     ██      ██ 
▬▬▬▬▬▬▬▬▬▬  ██████  ██ ██      █████      ██     ██      ██ 
▬▬▬▬▬▬▬▬▬▬  ██   ██ ██ ██      ██         ██     ██      ██ 
▬▬▬▬▬▬▬▬▬▬  ██████  ██  ██████ ███████    ██████ ███████ ██ `;

  console.log(BICE_BLUE(ASCII_BICE_CLI));

  if (version)
    console.log(
      `\n  ${chalk.dim(`v${version} · Manage your BICE account from the terminal\n`)}`,
    );
}
