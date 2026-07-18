import { Platform } from 'react-native';
import Slider from '@react-native-community/slider';

type Props = {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
};

/** Gold-track age slider. Native uses the community slider; web uses a real
 *  input[type=range] because the community slider's web build ignores mouse input. */
export default function AgeSlider({ min, max, value, onChange }: Props) {
  if (Platform.OS === 'web') {
    // react-native-web renders plain DOM; a real range input is the reliable web control
    const { unstable_createElement } = require('react-native-web');
    return unstable_createElement('input', {
      type: 'range',
      min,
      max,
      step: 1,
      value,
      onChange: (e: { target: { value: string } }) => onChange(parseInt(e.target.value, 10)),
      style: { width: '100%', height: 40, accentColor: '#c4a878', cursor: 'pointer' },
    });
  }
  return (
    <Slider
      style={{ width: '100%', height: 40 }}
      minimumValue={min}
      maximumValue={max}
      step={1}
      value={value}
      onValueChange={onChange}
      minimumTrackTintColor="#c4a878"
      maximumTrackTintColor="#3a342b"
      thumbTintColor="#c4a878"
    />
  );
}
