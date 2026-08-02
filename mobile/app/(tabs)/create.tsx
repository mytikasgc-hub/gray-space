import { Redirect } from 'expo-router'

/** Hidden route — create is opened via the center orb in the tab bar. */
export default function CreateScreen() {
  return <Redirect href="/(tabs)/feed" />
}
