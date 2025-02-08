declare module 'react-native-config' {
  export interface NativeConfig {
    API_URL?: string;
    AMPLITUDE_API_KEY?: string;
  }
  export const Config: NativeConfig;
  export default Config;
}
