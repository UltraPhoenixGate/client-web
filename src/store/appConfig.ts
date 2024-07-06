// @ts-expect-error tauri is not defined in the browser
export const isApp = window?.__TAURI__ !== undefined
