import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {IconProps} from './interface';
/**
 *
 * @param strength value: 0 -> 4
 * @returns
 */
export function WifiStrengthIcon(props: IconProps & {strength: number}) {
  const {strength} = props;
  if (strength === 1) {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
        <Path
          d="M12 3C7.79 3 3.7 4.41.38 7 4.41 12.06 7.89 16.37 12 21.5c4.08-5.08 8.24-10.26 11.65-14.5C20.32 4.41 16.22 3 12 3zm0 2c3.07 0 6.09.86 8.71 2.45l-5.1 6.36A8.432 8.432 0 0012 13c-1.25 0-2.5.28-3.61.8L3.27 7.44C5.91 5.85 8.93 5 12 5z"
          fill={props.color || '#000'}
        />
      </Svg>
    );
  }
  if (strength === 2) {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
        <Path
          d="M12 3C7.79 3 3.7 4.41.38 7 4.41 12.06 7.89 16.37 12 21.5c4.08-5.08 8.24-10.26 11.65-14.5C20.32 4.41 16.22 3 12 3zm0 2c3.07 0 6.09.86 8.71 2.45l-3.21 3.98C16.26 10.74 14.37 10 12 10c-2.38 0-4.26.75-5.5 1.43L3.27 7.44C5.91 5.85 8.93 5 12 5z"
          fill={props.color || '#000'}
        />
      </Svg>
    );
  }
  if (strength === 3) {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
        <Path
          d="M12 3C7.79 3 3.7 4.41.38 7 4.41 12.06 7.89 16.37 12 21.5c4.08-5.08 8.24-10.26 11.65-14.5C20.32 4.41 16.22 3 12 3zm0 2c3.07 0 6.09.86 8.71 2.45l-1.94 2.43C17.26 9 14.88 8 12 8 9 8 6.68 9 5.21 9.84l-1.94-2.4C5.91 5.85 8.93 5 12 5z"
          fill={props.color || '#000'}
        />
      </Svg>
    );
  }
  if (strength === 4) {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
        <Path
          d="M12 3C7.79 3 3.7 4.41.38 7 4.41 12.06 7.89 16.37 12 21.5c4.08-5.08 8.24-10.26 11.65-14.5C20.32 4.41 16.22 3 12 3z"
          fill={props.color || '#000'}
        />
      </Svg>
    );
  }
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 3C7.79 3 3.7 4.41.38 7H.36C4.24 11.83 8.13 16.66 12 21.5c3.89-4.84 7.77-9.67 11.64-14.5h.01C20.32 4.41 16.22 3 12 3zm0 2c3.07 0 6.09.86 8.71 2.45L12 18.3 3.27 7.44C5.9 5.85 8.92 5 12 5z"
        fill={props.color || '#000'}
      />
    </Svg>
  );
}
