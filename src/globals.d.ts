declare module '*.module.css' {
  const styles: { [key: string]: string }
  export = styles
}

declare module '@rehooks/online-status' {
  export default function useOnlineStatus(): boolean
}
