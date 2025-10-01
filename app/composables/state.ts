export const useProfile = () => useState<boolean>('profile', () => false)
export const useWelcomeDialog = () => useState<boolean>('showWelcomeDialog', () => false)