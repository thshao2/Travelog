import { useNavigation as useNativeNavigation, NavigationProp } from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      map: undefined;
      profile: undefined;
      index: undefined;
      explore: undefined;
    }
  }
}

// Extend useNavigation hook for typescript
export const useNavigation = () => useNativeNavigation<NavigationProp<ReactNavigation.RootParamList>>();
