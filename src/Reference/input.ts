const last_keys: { [key: string]: boolean } = {};
const curr_keys: { [key: string]: boolean } = {};

export function init(): void {
  // Registers event listeners
  window.addEventListener("keydown", (e) => {
    curr_keys[e.key] = true;
  });
  window.addEventListener("keyup", (e) => {
    curr_keys[e.key] = false;
  });
}

export function update(): void {
  Object.assign(last_keys, curr_keys);
}

export function isKeyPressed(key: string): boolean {
  return curr_keys[key] && !last_keys[key];
}

export function isKeyReleased(key: string): boolean {
  return !curr_keys[key] && last_keys[key];
}

export function isKeyDown(key: string): boolean {
  return curr_keys[key];
}
